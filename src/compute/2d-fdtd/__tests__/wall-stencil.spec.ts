/**
 * Issue #111: FDTD walls are rigid (Neumann). Opposite-neighbor sampling
 * is neither Dirichlet nor rigid and leaks / inverts through the wall.
 */
import {
  rigidNeighborPressure,
  stepInteriorCell,
  stepStrip,
} from "../wall-stencil";

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

describe("Issue #111: production wiring", () => {
  const fs = require("fs");
  const path = require("path");
  const shader = fs.readFileSync(path.resolve(__dirname, "../shaders/height-map.frag"), "utf8");
  const index = fs.readFileSync(path.resolve(__dirname, "../index.ts"), "utf8");

  test("opposite-neighbor sampling is gone from height-map.frag", () => {
    expect(shader).not.toMatch(/u_pos = texture2D\(\s*heightmap,\s*uv - ud_offset/);
    expect(shader).not.toMatch(/d_pos = texture2D\(\s*heightmap,\s*uv \+ ud_offset/);
    expect(shader).not.toMatch(/u_wall == 0 \? d\.r/);
    expect(shader).toMatch(/u_pos = pos/);
    expect(shader).toMatch(/d_pos = pos/);
    expect(shader).toMatch(/r_pos = pos/);
    expect(shader).toMatch(/l_pos = pos/);
  });

  test("index.ts documents walls as rigid and damping as not absorption", () => {
    expect(index).toMatch(/perfectly rigid|Neumann/);
    expect(index).toMatch(/not air absorption|numerical sponge/);
  });
});
