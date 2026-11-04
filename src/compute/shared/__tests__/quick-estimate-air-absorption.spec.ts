/**
 * The shared RT60 quick estimate applies air absorption along the ray, as the
 * full ray tracer does.
 *
 * It computed `airAttenuation(frequencies, temperature)` and never used it, so
 * the estimate's high bands ran long in any room big enough for air to matter.
 * And once air *is* applied, the top band reaches -60 dB first — which used to
 * end the ray for every band, leaving the rest at `rt60s[f] = 0`.
 *
 * The two arms below trace the same rays (seeded `Math.random`) through the
 * same room; the only difference is `airAttenuation` returning zeros in one.
 */

import * as THREE from "three";
import { airAttenuation, soundSpeed } from "../../acoustics";
import { quickEstimateStep } from "../quick-estimate";

// `vi.mock` factories are hoisted above module initialization, so anything they
// close over has to be hoisted with them.
const air = vi.hoisted(() => ({ off: false }));

vi.mock("../../acoustics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../acoustics")>();
  return {
    ...actual,
    airAttenuation: (...args: Parameters<typeof actual.airAttenuation>) =>
      air.off ? args[0].map(() => 0) : actual.airAttenuation(...args),
  };
});

// Large enough that air dominates at 8 kHz: mean free path ~11 m, and ~62
// reflections at R = 0.8 to reach -60 dB, so ~680 m of air per ray.
const ROOM = { lx: 30, ly: 20, lz: 10 } as const;
const REFLECTION = 0.8;
const FREQUENCIES = [125, 8000];
const TEMPERATURE = 20;
const RAYS = 200;

/**
 * One wall. Duck-typed rather than a real `Surface`, as in
 * `quick-estimate-normal.spec.ts`. The reflection is the same at every angle
 * and frequency, so any difference between the bands is the air.
 */
function wall(corners: THREE.Vector3[]): THREE.Object3D {
  const [a, b, c, d] = corners;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([a, b, c, a, c, d].flatMap((p) => [p.x, p.y, p.z]), 3),
  );
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  const group = new THREE.Group() as THREE.Group & Record<string, unknown>;
  group.add(mesh);
  group.kind = "surface";
  group.reflectionFunction = () => REFLECTION;
  group.numHits = 0;
  group.updateMatrixWorld(true);
  return group;
}

function buildRoom(): THREE.Object3D[] {
  const { lx, ly, lz } = ROOM;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  return [
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, 0, lz), V(0, 0, lz)]),
    wall([V(0, ly, 0), V(lx, ly, 0), V(lx, ly, lz), V(0, ly, lz)]),
    wall([V(0, 0, 0), V(0, ly, 0), V(0, ly, lz), V(0, 0, lz)]),
    wall([V(lx, 0, 0), V(lx, ly, 0), V(lx, ly, lz), V(lx, 0, lz)]),
    wall([V(0, 0, 0), V(lx, 0, 0), V(lx, ly, 0), V(0, ly, 0)]),
    wall([V(0, 0, lz), V(lx, 0, lz), V(lx, ly, lz), V(0, ly, lz)]),
  ];
}

/** mulberry32 — a small seeded PRNG, so both arms shoot the same directions. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Per-ray RT60s, one row per ray, one column per band. */
function trace(airOff: boolean): number[][] {
  air.off = airOff;
  const random = vi.spyOn(Math, "random").mockImplementation(seeded(0x5eed));
  try {
    const objects = buildRoom();
    const raycaster = new THREE.Raycaster();
    const source = new THREE.Vector3(ROOM.lx * 0.28, ROOM.ly * 0.55, ROOM.lz * 0.34);
    const rows: number[][] = [];
    for (let i = 0; i < RAYS; i++) {
      rows.push(quickEstimateStep(raycaster, objects, source, 1, FREQUENCIES, TEMPERATURE).rt60s);
    }
    return rows;
  } finally {
    random.mockRestore();
    air.off = false;
  }
}

const median = (xs: number[]) => [...xs].sort((x, y) => x - y)[xs.length >> 1];

describe("shared quick estimate applies air absorption", () => {
  let withAir: number[][];
  let withoutAir: number[][];

  beforeAll(() => {
    withAir = trace(false);
    withoutAir = trace(true);
  });

  /** Ray-by-ray ratio of the air arm to the air-free arm, for band `f`. */
  const ratios = (f: number) =>
    withAir
      .map((row, i) => [row[f], withoutAir[i][f]])
      .filter(([a, b]) => a > 0 && b > 0)
      .map(([a, b]) => a / b);

  it("reports every band, not just the first to reach -60 dB", () => {
    // With air on, 8 kHz finishes first on every ray. Stopping there left
    // 125 Hz at zero, so the low-band estimate came from nothing.
    for (const arm of [withAir, withoutAir]) {
      const complete = arm.filter((row) => row.every((t) => t > 0)).length;
      expect(complete).toBeGreaterThan(RAYS * 0.8);
    }
  });

  it("shortens the high band and barely touches the low band", () => {
    const low = median(ratios(0));
    const high = median(ratios(1));
    // 125 Hz: 0.0005 dB/m against ~0.09 dB/m of wall loss — under 1 %.
    expect(low).toBeGreaterThan(0.98);
    expect(low).toBeLessThanOrEqual(1);
    // 8 kHz: 0.13 dB/m more than doubles the decay rate.
    expect(high).toBeLessThan(0.6);
  });

  it("converts dB/m to intensity as 10^(-α·r/10), as the full solve does", () => {
    // A ray that needs distance d0 to lose 60 dB at the walls alone loses it
    // in d0 / (1 + α·d0/60) once air takes α dB/m on top. Reading α as an
    // amplitude figure (20 log) would halve its effect: ~0.58 here, not ~0.41.
    const alpha = airAttenuation([8000], TEMPERATURE)[0];
    const relative = withAir
      .map((row, i) => [row[1], withoutAir[i][1]])
      .filter(([a, b]) => a > 0 && b > 0)
      .map(([a, b]) => {
        const d0 = b * soundSpeed(TEMPERATURE);
        return a / b / (1 / (1 + (alpha * d0) / 60));
      });
    const m = median(relative);
    expect(m).toBeGreaterThan(0.9);
    expect(m).toBeLessThan(1.1);
  });
});
