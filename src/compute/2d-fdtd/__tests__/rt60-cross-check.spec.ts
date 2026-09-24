/**
 * Issue #199: the 2D field's reverberation time comes from its surfaces, and
 * is checked against statistical room acoustics rather than against FDTD's own
 * previous output.
 *
 * The oracle is the 2D form of Eyring. In two dimensions the mean free path is
 * `πS/P` (area over perimeter) rather than `4V/S`, so
 *
 * ```
 * T60 = 6·(πS/P) / (−c·log10(1 − α))
 * ```
 *
 * The material's α is diffuse-field (Sabine) absorption, and since #221 the
 * wall is built so that its 2D diffuse-field absorption *is* α. So the decay is
 * compared with Eyring at α itself, and bounded above by Eyring at the wall's
 * normal-incidence absorption — lower than α, since a locally-reacting surface
 * absorbs most between normal and grazing incidence, so that end is the
 * longest T60 a field could have that never went diffuse.
 *
 * What this replaces: before impedance walls, every surface was perfectly
 * rigid and the only decay was the global `damping` sponge. Since the step
 * count per simulated second is `c·√2 / cellSize`, that decay was a function of
 * the mesh — 71 s of T60 at half-metre cells, 5.6 s at the 0.039 m default,
 * 2.8 s at half of that. The grid-independence test below is the direct
 * replacement for it.
 */

import { DEFAULT_DAMPING } from '../index-constants';
import {
  ghostGainForAbsorption,
  ghostGainForImpedance,
  wallChannelForGhostGain,
} from '../impedance';
import { impedanceForAbsorption } from '../../acoustics/reflection-coefficient';
import { impedanceForRandomIncidenceAbsorption } from '../../acoustics/random-incidence';
import { createField2D, stepField, type Field2D } from '../wall-stencil';

const C = Math.SQRT1_2;
const C2 = 0.5;
const SOUND_SPEED = 343;

/**
 * A rectangular room with a one-cell wall ring of the given database
 * absorption — or of an explicit ghost gain, for the tests that drive the
 * boundary rather than the material convention.
 */
function shoebox(widthM: number, heightM: number, dx: number, alpha: number, gain?: number): Field2D {
  const nx = Math.round(widthM / dx) + 2;
  const ny = Math.round(heightM / dx) + 2;
  const field = createField2D(nx, ny);
  const channel = wallChannelForGhostGain(gain ?? ghostGainForAbsorption(alpha, C));
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) {
        field.channel[j * nx + i] = channel;
      }
    }
  }
  return field;
}

/** Second derivative of a Gaussian, rolled off above `fMax`. */
function pulse(steps: number, dt: number, fMax: number): Float64Array {
  const out = new Float64Array(steps);
  const width = 2 / (Math.PI * fMax * dt);
  const centre = steps / 2;
  for (let t = 0; t < steps; t++) {
    const u = (t - centre) / width;
    out[t] = (1 - 2 * u * u) * Math.exp(-u * u);
  }
  return out;
}

/**
 * Impulse response at an off-centre receiver, driven by an off-centre source.
 * Both are off-centre so no symmetry leaves whole families of modes unexcited
 * or unheard.
 */
function impulseResponse(field: Field2D, dx: number, seconds: number): { ir: Float64Array; dt: number } {
  const dt = dx / (SOUND_SPEED * Math.SQRT2);
  const steps = Math.ceil(seconds / dt);
  const scratch = {
    pressure: new Float64Array(field.pressure.length),
    velocity: new Float64Array(field.pressure.length),
  };
  const source = Math.round(0.31 * field.ny) * field.nx + Math.round(0.27 * field.nx);
  const receiver = Math.round(0.68 * field.ny) * field.nx + Math.round(0.71 * field.nx);
  // Six cells per wavelength is where the boundary still delivers its
  // coefficient; driving past it would measure the grid, not the walls.
  const drive = pulse(240, dt, Math.min(500, SOUND_SPEED / (6 * dx)));
  const ir = new Float64Array(steps);
  for (let t = 0; t < steps; t++) {
    stepField(field, C2, 1, scratch);
    if (t < drive.length) field.pressure[source] += drive[t];
    ir[t] = field.pressure[receiver];
  }
  return { ir, dt };
}

/** Decay time from the Schroeder curve between two levels, extrapolated to 60 dB. */
function decayTime(ir: Float64Array, dt: number, from: number, to: number): number {
  const edc = new Float64Array(ir.length);
  let acc = 0;
  for (let i = ir.length - 1; i >= 0; i--) {
    acc += ir[i] * ir[i];
    edc[i] = acc;
  }
  const peak = edc[0];
  const db = (i: number) => 10 * Math.log10(edc[i] / peak);
  let start = -1;
  let end = -1;
  for (let i = 0; i < ir.length; i++) {
    if (start < 0 && db(i) <= from) start = i;
    if (db(i) <= to) {
      end = i;
      break;
    }
  }
  if (start < 0 || end < 0 || end <= start) return NaN;
  return -60 / ((db(end) - db(start)) / ((end - start) * dt));
}

/** Eyring in two dimensions: mean free path πS/P, not 4V/S. */
function eyring2D(area: number, perimeter: number, alpha: number): number {
  return (6 * ((Math.PI * area) / perimeter)) / (-SOUND_SPEED * Math.log10(1 - alpha));
}

/**
 * Diffuse-field absorption of a real impedance in two dimensions: the average
 * of `1 − |R(θ)|²` over a half-plane, weighted by `cos θ`.
 */
function diffuseAbsorption2D(xi: number): number {
  const n = 20000;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const theta = ((i + 0.5) / n) * (Math.PI / 2);
    const R = (xi * Math.cos(theta) - 1) / (xi * Math.cos(theta) + 1);
    total += (1 - R * R) * Math.cos(theta) * (Math.PI / 2 / n);
  }
  return total;
}


const WIDTH = 6;
const HEIGHT = 4;
const AREA = WIDTH * HEIGHT;
const PERIMETER = 2 * (WIDTH + HEIGHT);

describe('Issue #199: T60 against statistical room acoustics', () => {
  it.each([0.2, 0.3])('decays at Eyring for the material’s own α (%s), read as diffuse absorption (#221)', (alpha) => {
    const dx = 0.05;
    const field = shoebox(WIDTH, HEIGHT, dx, alpha);
    const { ir, dt } = impulseResponse(field, dx, 1.2 * eyring2D(AREA, PERIMETER, alpha));
    const t30 = decayTime(ir, dt, -5, -35);
    const t20 = decayTime(ir, dt, -5, -25);
    expect(Number.isFinite(t30)).toBe(true);
    expect(Number.isFinite(t20)).toBe(true);

    // The bracket of the wall actually built: its diffuse-field absorption is
    // the material's α by construction, so the diffuse end is Eyring at α;
    // its normal-incidence absorption is lower, so that end is longer.
    const xi = impedanceForRandomIncidenceAbsorption(alpha, 2);
    const lower = eyring2D(AREA, PERIMETER, diffuseAbsorption2D(xi));
    const upper = eyring2D(AREA, PERIMETER, 1 - ((xi - 1) / (xi + 1)) ** 2);
    expect(lower).toBeCloseTo(eyring2D(AREA, PERIMETER, alpha), 9);
    expect(lower).toBeLessThan(upper);

    for (const t of [t20, t30]) {
      // Measured 1.07–1.10 × Eyring at α: just above the diffuse end, where a
      // room this small with four walls and no scattering sits. Before #221
      // the same bracket was built around a softer wall, and the room decayed
      // faster than Eyring at the material's own coefficient allowed.
      expect([alpha, t, t > 0.95 * lower && t < 1.2 * lower]).toEqual([alpha, t, true]);
      expect([alpha, t, t < upper]).toEqual([alpha, t, true]);
    }
  });

  it('gives the same T60 on a coarser and a finer grid', () => {
    // This is the defect. With rigid walls and damping = 0.9999 the decay was
    // set by the step count, so halving the cell size halved T60 — a factor of
    // 1.6 between these two grids, against the 15% asked for here.
    const alpha = 0.3;
    const times = [0.08, 0.05].map((dx) => {
      const field = shoebox(WIDTH, HEIGHT, dx, alpha);
      const { ir, dt } = impulseResponse(field, dx, 1.2 * eyring2D(AREA, PERIMETER, alpha));
      return decayTime(ir, dt, -5, -35);
    });
    for (const t of times) expect(Number.isFinite(t)).toBe(true);
    const ratio = Math.max(...times) / Math.min(...times);
    expect([times, ratio < 1.15]).toEqual([times, true]);
  });

  it('decays faster with a more absorbing wall, and not at all with a rigid one', () => {
    const dx = 0.08;
    const seconds = 0.5;
    const energyAfter = (alpha: number) => {
      const field = shoebox(WIDTH, HEIGHT, dx, alpha);
      const { ir } = impulseResponse(field, dx, seconds);
      let late = 0;
      for (let i = Math.floor(ir.length * 0.8); i < ir.length; i++) late += ir[i] * ir[i];
      return late;
    };
    const rigid = energyAfter(0);
    const absorbing = energyAfter(0.3);
    const more = energyAfter(0.6);
    expect(absorbing).toBeLessThan(rigid / 10);
    expect(more).toBeLessThan(absorbing / 10);
  });

  it('keeps getting deader past the old 0.961 cap (#219)', () => {
    // Above α ≈ 0.9 the Eyring bracket above stops meaning anything: the energy
    // is gone within two or three bounces, the field never becomes diffuse, and
    // near α = 1 the bracket inverts. So this checks what the centred remainder
    // must do at room scale instead — every corner cell summing two walls'
    // remainders — which is to keep the late level falling as α rises. Before
    // #219, 0.961, 0.98 and 1 were one clamped wall and read identically.
    // The α here are normal-incidence, driving the boundary directly: read as
    // diffuse absorption (#221), no material reaches a matched wall.
    const dx = 0.08;
    const lateLevel = (alpha: number) => {
      const field = shoebox(WIDTH, HEIGHT, dx, alpha, ghostGainForImpedance(impedanceForAbsorption(alpha), C));
      const { ir, dt } = impulseResponse(field, dx, 0.13);
      const energy = (from: number, to: number) => {
        let e = 0;
        for (let i = Math.floor(from / dt); i < Math.floor(to / dt); i++) e += ir[i] * ir[i];
        return e;
      };
      return 10 * Math.log10(energy(0.1, 0.13) / energy(0, 0.03));
    };
    const levels = [0.9, 0.961, 0.98, 1].map(lateLevel);
    for (const level of levels) expect(Number.isFinite(level)).toBe(true);
    for (let k = 1; k < levels.length; k++) {
      expect([levels, levels[k] < levels[k - 1] - 3]).toEqual([levels, true]);
    }
    // Measured −62 dB at the old cap against −93 dB for a matched wall; 20 dB
    // of that is asked for, so this fails if the remainder stops reaching rooms.
    expect(levels[3]).toBeLessThan(levels[1] - 20);
  });

  describe('the velocity sponge is off, and stays off', () => {
    it('is not the decay mechanism any more', () => {
      expect(DEFAULT_DAMPING).toBe(1);
    });

    it('would impose a reverberation time set by the cell size', () => {
      // Closed form, because this is arithmetic and not physics: a sponge
      // multiplies by `damping` every step, and `dt = dx/(c·√2)` puts
      // `c·√2/dx` steps in a second. So the decay in dB/s — and with it the
      // T60 — goes as 1/dx. Halve the cell size to resolve the field better
      // and the room's reverberation time halves with it.
      const imposedT60 = (damping: number, dx: number) =>
        -60 / (20 * Math.log10(damping) * ((SOUND_SPEED * Math.SQRT2) / dx));
      const coarse = imposedT60(0.9999, 0.08);
      const fine = imposedT60(0.9999, 0.04);
      expect(coarse / fine).toBeCloseTo(2, 12);
      // And the magnitudes are the ones #199 tabulated: 5.6 s at the default
      // cell size of a 10 m room.
      expect(imposedT60(0.9999, 10 / 256)).toBeCloseTo(5.6, 1);
    });

    it('is conditionally unstable below 1, and the condition is the grid', () => {
      // Not just physically wrong — numerically wrong. The scheme runs at
      // C = 1/√2 exactly, where the grid's checkerboard mode sits on the unit
      // circle; a sponge on velocity pushes it outside. Whether that shows up
      // depends on how close the domain's discrete spectrum gets to Nyquist,
      // which is to say on how many cells there are. Measured on this room:
      // 0.999 decays at dx = 0.08 and diverges at 0.06, 0.04 and 0.03.
      const peak = (damping: number, dx: number, steps: number) => {
        const field = shoebox(WIDTH, HEIGHT, dx, 0);
        const scratch = {
          pressure: new Float64Array(field.pressure.length),
          velocity: new Float64Array(field.pressure.length),
        };
        field.pressure[Math.round(0.31 * field.ny) * field.nx + Math.round(0.27 * field.nx)] = 1;
        for (let t = 0; t < steps; t++) stepField(field, C2, damping, scratch);
        let worst = 0;
        for (const p of field.pressure) worst = Math.max(worst, Math.abs(p));
        return worst;
      };
      expect(peak(1, 0.06, 2500)).toBeLessThan(1);
      expect(peak(0.999, 0.06, 2500)).toBeGreaterThan(1e6);
    });
  });
});