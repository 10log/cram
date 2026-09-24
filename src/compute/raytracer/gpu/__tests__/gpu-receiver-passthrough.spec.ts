/**
 * Issue #242: GPU rays pass through receivers, as CPU rays do since #234.
 * The kernel records every crossing in the chain, interleaved with the wall
 * bounces, and the host splits them into arrivals.
 */
import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';
import { splitRayChain } from '../gpu-ray-tracer';
import type { Chain } from '../../types';

function hop(object: string, point: [number, number, number], bandEnergy: number[]): Chain {
  return {
    point,
    distance: 0,
    object,
    faceNormal: [0, 0, 0],
    faceIndex: -1,
    faceMaterialIndex: -1,
    angle: 0,
    energy: bandEnergy.reduce((a, b) => a + b, 0) / bandEnergy.length,
    bandEnergy,
  };
}

describe('Issue #242: splitRayChain', () => {
  // Source at the origin; receiver A at x=3, wall at x=10, receiver B on the
  // way back at x=6, then a second wall at x=0 (y offset).
  const chain = [
    hop('recA', [2.5, 0, 0], [1, 0.5]),
    hop('wall1', [10, 0, 0], [0.9, 0.4]),
    hop('recB', [6.5, 0, 0], [0.8, 0.3]),
    hop('wall2', [0, 1, 0], [0.5, 0.1]),
  ];
  const isReceiver = [true, false, true, false];
  const result = splitRayChain(chain, isReceiver, [0, 0, 0], [0.4, 0.05], 1.2, 0.3);

  it('makes one arrival per receiver crossing, in order', () => {
    expect(result.arrivals.map((a) => a.chain[a.chain.length - 1].object)).toEqual(['recA', 'recB']);
    for (const a of result.arrivals) {
      expect(a.intersectedReceiver).toBe(true);
      expect(a.initialPhi).toBe(1.2);
      expect(a.initialTheta).toBe(0.3);
    }
  });

  it('gives each arrival the walls before it and the energy that reached the receiver', () => {
    const [a, b] = result.arrivals;
    expect(a.chain.map((h) => h.object)).toEqual(['recA']);
    expect(b.chain.map((h) => h.object)).toEqual(['wall1', 'recB']);
    expect(a.bandEnergy).toEqual([1, 0.5]);
    expect(b.bandEnergy).toEqual([0.8, 0.3]);
    expect(b.energy).toBeCloseTo(0.55, 12);
  });

  it('points each arrival back along the segment it came in on', () => {
    // From the origin toward +x: arrives from −x.
    expect(result.arrivals[0].arrivalDirection).toEqual([-1, 0, 0]);
    // From the wall at x=10 back toward −x: arrives from +x.
    expect(result.arrivals[1].arrivalDirection).toEqual([1, 0, 0]);
  });

  it("keeps the ray's own path to its walls, with its final energy", () => {
    expect(result.path).not.toBeNull();
    expect(result.path!.intersectedReceiver).toBe(false);
    expect(result.path!.chain.map((h) => h.object)).toEqual(['wall1', 'wall2']);
    expect(result.path!.bandEnergy).toEqual([0.4, 0.05]);
    expect(result.path!.arrivalDirection).toBeUndefined();
  });

  it('has no path for a ray that crossed a receiver and left the model', () => {
    const escaped = splitRayChain([hop('recA', [2.5, 0, 0], [1])], [true], [0, 0, 0], [1], 0, 0);
    expect(escaped.path).toBeNull();
    expect(escaped.arrivals).toHaveLength(1);
  });

  it('has neither for a ray that hit nothing', () => {
    expect(splitRayChain([], [], [0, 0, 0], [1], 0, 0)).toEqual({ path: null, arrivals: [] });
  });
});

describe('Issue #242: the kernel and host agree', () => {
  const read = (name: string) => fs.readFileSync(path.resolve(__dirname, name), 'utf8');
  const wgsl = read('../ray-trace.wgsl');
  const host = read('../gpu-ray-tracer.ts');
  const index = read('../../index.ts');

  it('sizes the chain at twice the bounces, on both sides', () => {
    expect(wgsl).toContain('const CHAIN_SLOTS: u32 = 128u;');
    expect(wgsl).toContain('let chainBase = rayIdx * CHAIN_SLOTS;');
    expect(host).toContain('const CHAIN_SLOTS = 128;');
    expect(host).toContain('const chainBase = r * CHAIN_SLOTS;');
    expect(host).not.toMatch(/\* MAX_BOUNCES \* CHAIN_ENTRY_BYTES/);
  });

  it('records receiver crossings without ending the ray or spending its energy', () => {
    const loop = wgsl.slice(wgsl.indexOf('for (var bounce'), wgsl.indexOf('// Surface hit'));
    // The only breaks before the wall: no more receivers, escape, full chain.
    expect(loop.match(/break;/g)).toHaveLength(3);
    expect(loop).toContain('if (!found) { break; }');
    expect(loop).toContain('if (!triHit.hit) { break; }');
    expect(loop).toContain('if (chainLen >= CHAIN_SLOTS) { break; }');
    expect(loop).not.toMatch(/bandEnergy\[b\]\s*\*=/);
  });

  it('hands every arrival to the solver', () => {
    expect(index).toContain('this._handleTracedPath(path ?? undefined, position, sourceId, arrivals);');
    expect(index).not.toContain('path.intersectedReceiver ? [path] : []');
  });
});
