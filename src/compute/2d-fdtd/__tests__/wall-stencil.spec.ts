/**
 * Issue #111: FDTD walls are rigid (Neumann). Opposite-neighbor sampling
 * is neither Dirichlet nor rigid and leaks / inverts through the wall.
 */
import {
  createField2D,
  rigidNeighborPressure,
  stepField,
  stepInteriorCell,
  stepStrip,
  wallGhostPressure,
} from "../wall-stencil";
import {
  MAX_GHOST_GAIN,
  ghostGainForAbsorption,
  wallChannelForGhostGain,
} from "../impedance";

const C2 = 0.5; // CFL 1/√2
const DAMPING = 1;

describe("Issue #111: rigid wall stencil", () => {
  test("a wall neighbor contributes the cell's own pressure, not the opposite cell", () => {
    expect(rigidNeighborPressure(10, 99, true)).toBe(10);
    expect(rigidNeighborPressure(10, 99, false)).toBe(99);
  });

  test("wall cells stay at rest", () => {
    const next = stepInteriorCell(
      { pressure: 40, velocity: 12, isWall: true },
      {
        u: { pressure: 1, velocity: 0, isWall: false },
        d: { pressure: 2, velocity: 0, isWall: false },
        r: { pressure: 3, velocity: 0, isWall: false },
        l: { pressure: 4, velocity: 0, isWall: false },
      },
      C2,
      DAMPING,
      0,
    );
    expect(next.pressure).toBe(0);
    expect(next.velocity).toBe(0);
  });

  test("pulse against a closed wall: far side stays ~0, reflection keeps polarity", () => {
    const n = 41;
    const wallIndex = 20;
    const wall = Array.from({ length: n }, (_, i) => i === wallIndex);
    let pressure = new Array(n).fill(0);
    let velocity = new Array(n).fill(0);
    pressure[8] = 1;

    for (let t = 0; t < 80; t++) {
      const next = stepStrip(pressure, velocity, wall, C2, DAMPING);
      pressure = next.pressure;
      velocity = next.velocity;
    }

    const left = pressure.slice(0, wallIndex);
    const right = pressure.slice(wallIndex + 1);
    const leftEnergy = left.reduce((s, p) => s + p * p, 0);
    const rightEnergy = right.reduce((s, p) => s + p * p, 0);
    expect(leftEnergy).toBeGreaterThan(0.1);
    expect(rightEnergy).toBeLessThan(1e-6 * leftEnergy);
    expect(Math.max(...left)).toBeGreaterThan(0);
  });
});

describe("Issue #199: the field stepper is the single-cell stencil, tiled", () => {
  /**
   * `stepField` inlines the neighbour lookup for speed — the decay tests run it
   * tens of thousands of times over tens of thousands of cells. That makes it a
   * second spelling of the same rule, so pin the two together: any drift in the
   * channel encoding or in the ghost breaks this.
   */
  test("matches stepInteriorCell cell by cell on a field with mixed walls", () => {
    const nx = 11;
    const ny = 9;
    const field = createField2D(nx, ny);
    // The last two are past MAX_GHOST_GAIN, so the centred loss (#219) is
    // pinned too, including on corner cells that sum two of them.
    const gammas = [
      0,
      0.2,
      0.5,
      ghostGainForAbsorption(0.7, Math.SQRT1_2),
      ghostGainForAbsorption(1, Math.SQRT1_2),
      1.2,
    ];
    let state = 12345;
    const random = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000 - 0.5;
    };
    for (let i = 0; i < nx * ny; i++) {
      field.pressure[i] = random();
      field.velocity[i] = random();
    }
    // A wall ring, an interior island, and a differently-absorbing patch, so
    // cells with one, two and no wall neighbours are all covered.
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const edge = i === 0 || j === 0 || i === nx - 1 || j === ny - 1;
        if (edge) {
          field.channel[j * nx + i] = wallChannelForGhostGain(gammas[(i + j) % gammas.length]);
        }
      }
    }
    field.channel[4 * nx + 5] = wallChannelForGhostGain(0.3);
    // Staircase weights (#220) on every wall cell, different per axis, so a
    // face read across the wrong axis would show up here.
    for (let k = 0; k < nx * ny; k++) {
      if (!(field.channel[k] > 0)) {
        field.weightX[k] = 0.25 + 0.5 * (random() + 0.5);
        field.weightY[k] = 0.1 + 0.8 * (random() + 0.5);
      }
    }

    const before = {
      pressure: Float64Array.from(field.pressure),
      velocity: Float64Array.from(field.velocity),
      channel: field.channel,
    };
    const cell = (i: number, j: number) => {
      const idx = j * nx + i;
      const channel = before.channel[idx];
      return {
        pressure: before.pressure[idx],
        velocity: before.velocity[idx],
        isWall: !(channel > 0),
        ghostGain: channel > 0 ? 0 : -channel,
        weightX: field.weightX[idx],
        weightY: field.weightY[idx],
      };
    };

    // At the production split point, and with the split switched off — the
    // setting the γ = 1 bound test runs at, so the two paths cannot drift
    // apart there either.
    for (const maxGhostGain of [MAX_GHOST_GAIN, Infinity]) {
      field.pressure.set(before.pressure);
      field.velocity.set(before.velocity);
      stepField(field, 0.5, 1, {
        pressure: new Float64Array(nx * ny),
        velocity: new Float64Array(nx * ny),
      }, maxGhostGain);

      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const expected = stepInteriorCell(
            cell(i, j),
            {
              l: cell(i > 0 ? i - 1 : i, j),
              r: cell(i < nx - 1 ? i + 1 : i, j),
              d: cell(i, j > 0 ? j - 1 : j),
              u: cell(i, j < ny - 1 ? j + 1 : j),
            },
            0.5,
            1,
            0,
            maxGhostGain,
          );
          // To rounding, not to the bit: stepInteriorCell is the shader's
          // `4c²·(¼(u+d+r+l) − p)`, stepField the inlined `c²·(Σ − 4p)`, and
          // the two orders of operations may differ in the last place (#221
          // changed the gains and they did). Any real drift — a wrong axis, a
          // missing split — is many orders larger.
          const at = [maxGhostGain, i, j];
          const close = (a: number, b: number) => Math.abs(a - b) <= 1e-14 * Math.max(1, Math.abs(b));
          expect([...at, close(field.pressure[j * nx + i], expected.pressure)]).toEqual([...at, true]);
          expect([...at, close(field.velocity[j * nx + i], expected.velocity)]).toEqual([...at, true]);
        }
      }
    }
  });

  test("a rigid wall is still exactly the #111 Neumann ghost", () => {
    // Not 'close to': gain 0 makes the ghost the cell's own pressure, which is
    // the same floating-point value the old code returned.
    for (const [p, v] of [[1.5, -0.25], [0, 0], [-7, 3]]) {
      expect(wallGhostPressure(p, v, 0)).toBe(rigidNeighborPressure(p, 99, true));
      expect(wallGhostPressure(p, v, 0)).toBe(p);
    }
    expect(ghostGainForAbsorption(0, Math.SQRT1_2)).toBe(0);
    expect(wallChannelForGhostGain(0)).toBe(0);
  });
});

describe("Issue #111: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const shader = fs.readFileSync(path.resolve(__dirname, "../shaders/height-map.frag"), "utf8");
  const index = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("opposite-neighbor sampling is gone from height-map.frag", () => {
    expect(shader).not.toMatch(/u_pos = texture2D\(\s*heightmap,\s*uv - ud_offset/);
    expect(shader).not.toMatch(/d_pos = texture2D\(\s*heightmap,\s*uv \+ ud_offset/);
    expect(shader).not.toMatch(/u_wall == 0 \? d\.r/);
    // The ghost is `pos + wall * vel`, which is `pos` for a rigid wall (#199
    // made the gain a coefficient; #111's Neumann case is gain 0).
    expect(shader).toMatch(/u_pos = pos/);
    expect(shader).toMatch(/d_pos = pos/);
    expect(shader).toMatch(/r_pos = pos/);
    expect(shader).toMatch(/l_pos = pos/);
  });

  test("index.ts documents damping as a numerical control, not absorption", () => {
    expect(index).toMatch(/not air absorption|numerical sponge|Numerical sponge/);
    // Walls are no longer unconditionally rigid: #199 reads Surface.absorption.
    expect(index).toMatch(/wallChannelFor\(/);
    expect(index).toMatch(/absorptionFunction/);
  });
});
