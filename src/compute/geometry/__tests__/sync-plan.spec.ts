/**
 * Face reconciliation tests.
 *
 * The behaviour that matters: a face id present before and after an edit lands
 * in `updated`, never in `removed` + `added`. That distinction is what keeps a
 * Surface — and the acoustic material assigned to it — alive across edits.
 */

import { describe, it, expect } from 'vitest';
import { planFaceSync } from '../sync-plan';
import { floorplanToMesh, type Point2 } from '../floorplan';

const SHOEBOX: Point2[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

const ids = (points: Point2[], height = 2.5) =>
  floorplanToMesh({ points, height }).faces.map((f) => f.id);

describe('planFaceSync', () => {
  it('treats everything as added when nothing exists yet', () => {
    const plan = planFaceSync([], ['floor', 'ceiling', 'wall-0']);
    expect(plan).toEqual({
      updated: [],
      added: ['floor', 'ceiling', 'wall-0'],
      removed: [],
    });
  });

  it('treats everything as removed when the mesh has no faces', () => {
    const plan = planFaceSync(['floor', 'wall-0'], []);
    expect(plan).toEqual({ updated: [], added: [], removed: ['floor', 'wall-0'] });
  });

  it('classifies a mixed change', () => {
    const plan = planFaceSync(['floor', 'wall-0', 'wall-1'], ['floor', 'wall-0', 'wall-2']);
    expect(plan).toEqual({
      updated: ['floor', 'wall-0'],
      added: ['wall-2'],
      removed: ['wall-1'],
    });
  });

  it('follows incoming order for updated and added', () => {
    const plan = planFaceSync(['b', 'a'], ['a', 'x', 'b', 'y']);
    expect(plan.updated).toEqual(['a', 'b']);
    expect(plan.added).toEqual(['x', 'y']);
  });

  it('follows existing order for removed', () => {
    expect(planFaceSync(['z', 'y', 'x'], []).removed).toEqual(['z', 'y', 'x']);
  });

  it('collapses duplicate ids on either side', () => {
    const plan = planFaceSync(['a', 'a'], ['a', 'a', 'b', 'b']);
    expect(plan).toEqual({ updated: ['a'], added: ['b'], removed: [] });
  });

  it('accepts any iterable, including a Map keys view', () => {
    const existing = new Map([['floor', 1], ['wall-0', 2]]);
    expect(planFaceSync(existing.keys(), ['floor']).removed).toEqual(['wall-0']);
  });

  describe('against real meshes', () => {
    it('updates every face when only the height changes', () => {
      // The material-preservation hook: nothing is torn down for a height edit.
      const plan = planFaceSync(ids(SHOEBOX, 2.5), ids(SHOEBOX, 4));
      expect(plan.added).toEqual([]);
      expect(plan.removed).toEqual([]);
      expect(plan.updated).toHaveLength(6);
    });

    it('adds one wall when the outline gains a point', () => {
      const pentagon = [...SHOEBOX, { x: -1, y: 1.5 }];
      const plan = planFaceSync(ids(SHOEBOX), ids(pentagon));
      expect(plan.added).toEqual(['wall-4']);
      expect(plan.removed).toEqual([]);
      expect(plan.updated).toHaveLength(6);
    });

    it('removes one wall when the outline loses a point', () => {
      const triangle = SHOEBOX.slice(0, 3);
      const plan = planFaceSync(ids(SHOEBOX), ids(triangle));
      expect(plan.removed).toEqual(['wall-3']);
      expect(plan.added).toEqual([]);
    });

    it('never reports the same id as both added and removed', () => {
      const plan = planFaceSync(ids(SHOEBOX), ids([...SHOEBOX, { x: -1, y: 1.5 }]));
      expect(plan.added.filter((id) => plan.removed.includes(id))).toEqual([]);
    });
  });
});
