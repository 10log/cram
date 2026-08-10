/**
 * Sketch input tests.
 *
 * Most of the subtlety is in how the snapping rules interact — ortho constrains
 * relative to the previous point, grid snap rounds, and close-loop has to beat
 * both or the outline never quite shuts.
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SNAP,
  addPoint,
  canClose,
  closeDraft,
  draftIssues,
  draftPerimeter,
  emptyDraft,
  moveCursor,
  previewPath,
  snap,
  toFloorplanParams,
  undoLastPoint,
  type SketchDraft,
  type SnapSettings,
} from '../sketch-input';
import type { Point2 } from '../floorplan';

const NO_SNAP: SnapSettings = { gridSize: 0, ortho: false, closeDistance: 0.5 };
const GRID: SnapSettings = { gridSize: 0.25, ortho: false, closeDistance: 0.5 };
const ORTHO: SnapSettings = { gridSize: 0, ortho: true, closeDistance: 0.5 };

const p = (x: number, y: number): Point2 => ({ x, y });

/** Draft with the given points already committed. */
function draftOf(points: Point2[], closed = false): SketchDraft {
  return { points, cursor: null, closed };
}

const SQUARE = [p(0, 0), p(4, 0), p(4, 4), p(0, 4)];

describe('emptyDraft', () => {
  it('starts empty and open', () => {
    expect(emptyDraft()).toEqual({ points: [], cursor: null, closed: false });
  });
});

describe('snap', () => {
  describe('grid', () => {
    it('rounds to the nearest grid multiple', () => {
      expect(snap(p(1.1, 2.4), emptyDraft(), GRID).point).toEqual(p(1, 2.5));
    });

    it('leaves points alone when the grid is disabled', () => {
      expect(snap(p(1.1, 2.4), emptyDraft(), NO_SNAP).point).toEqual(p(1.1, 2.4));
    });

    it('handles negative coordinates', () => {
      expect(snap(p(-1.1, -2.4), emptyDraft(), GRID).point).toEqual(p(-1, -2.5));
    });
  });

  describe('ortho', () => {
    it('does nothing without a previous point', () => {
      expect(snap(p(3, 7), emptyDraft(), ORTHO).point).toEqual(p(3, 7));
    });

    it('locks to horizontal when x has moved further', () => {
      const draft = draftOf([p(0, 0)]);
      expect(snap(p(5, 1), draft, ORTHO).point).toEqual(p(5, 0));
    });

    it('locks to vertical when y has moved further', () => {
      const draft = draftOf([p(0, 0)]);
      expect(snap(p(1, 5), draft, ORTHO).point).toEqual(p(0, 5));
    });

    it('constrains relative to the most recent point, not the first', () => {
      const draft = draftOf([p(0, 0), p(4, 0)]);
      expect(snap(p(4.2, 3), draft, ORTHO).point).toEqual(p(4, 3));
    });

    it('combines with grid snapping', () => {
      const draft = draftOf([p(0, 0)]);
      const both: SnapSettings = { gridSize: 0.5, ortho: true, closeDistance: 0.5 };
      expect(snap(p(3.3, 0.4), draft, both).point).toEqual(p(3.5, 0));
    });
  });

  describe('close-loop', () => {
    it('snaps exactly onto the first point when near it', () => {
      const draft = draftOf(SQUARE);
      const result = snap(p(0.2, 0.1), draft, GRID);
      expect(result.closesLoop).toBe(true);
      expect(result.point).toEqual(p(0, 0));
    });

    it('does not trigger with fewer than three points', () => {
      const draft = draftOf([p(0, 0), p(4, 0)]);
      expect(snap(p(0.1, 0.1), draft, GRID).closesLoop).toBe(false);
    });

    it('does not trigger far from the start', () => {
      expect(snap(p(2, 2), draftOf(SQUARE), GRID).closesLoop).toBe(false);
    });

    it('beats ortho, which would otherwise pull the point off the start', () => {
      // From (0,4) an ortho constraint would lock x to 0 or y to 4; the start
      // is at (0,0), so only an exact override actually closes the shape.
      const draft = draftOf(SQUARE);
      const result = snap(p(0.3, 0.3), draft, { ...ORTHO, closeDistance: 0.5 });
      expect(result.closesLoop).toBe(true);
      expect(result.point).toEqual(p(0, 0));
    });

    it('beats grid snap, which could round away from the start', () => {
      const draft = draftOf([p(0.1, 0.1), p(4, 0), p(4, 4)]);
      const result = snap(p(0.2, 0.2), draft, GRID);
      expect(result.point).toEqual(p(0.1, 0.1));
    });

    it('respects the configured tolerance', () => {
      const draft = draftOf(SQUARE);
      const tight: SnapSettings = { ...GRID, closeDistance: 0.05 };
      expect(snap(p(0.2, 0.2), draft, tight).closesLoop).toBe(false);
    });

    it('never triggers on an already closed draft', () => {
      expect(snap(p(0, 0), draftOf(SQUARE, true), GRID).closesLoop).toBe(false);
    });
  });
});

describe('addPoint', () => {
  it('commits a snapped point', () => {
    const draft = addPoint(emptyDraft(), p(1.1, 2.4), GRID);
    expect(draft.points).toEqual([p(1, 2.5)]);
  });

  it('accumulates points in click order', () => {
    let draft = emptyDraft();
    for (const point of SQUARE) draft = addPoint(draft, point, NO_SNAP);
    expect(draft.points).toEqual(SQUARE);
  });

  it('ignores a click that repeats the previous point', () => {
    const draft = addPoint(draftOf([p(2, 2)]), p(2, 2), NO_SNAP);
    expect(draft.points).toHaveLength(1);
  });

  it('ignores a near-repeat that grid snap collapses onto the previous point', () => {
    const draft = addPoint(draftOf([p(2, 2)]), p(2.02, 2.02), GRID);
    expect(draft.points).toHaveLength(1);
  });

  it('allows revisiting an earlier point that is not the previous one', () => {
    const draft = addPoint(draftOf([p(0, 0), p(4, 0)]), p(0, 0), NO_SNAP);
    expect(draft.points).toHaveLength(3);
  });

  it('closes the outline when the click lands on the start', () => {
    const draft = addPoint(draftOf(SQUARE), p(0.1, 0.1), GRID);
    expect(draft.closed).toBe(true);
    expect(draft.points).toHaveLength(4);
  });

  it('does nothing once closed', () => {
    const closed = draftOf(SQUARE, true);
    expect(addPoint(closed, p(9, 9), NO_SNAP)).toBe(closed);
  });

  it('does not mutate the input draft', () => {
    const draft = draftOf([p(0, 0)]);
    const snapshot = JSON.stringify(draft);
    addPoint(draft, p(4, 0), NO_SNAP);
    expect(JSON.stringify(draft)).toBe(snapshot);
  });
});

describe('moveCursor', () => {
  it('stores the snapped cursor', () => {
    expect(moveCursor(emptyDraft(), p(1.1, 2.4), GRID).cursor).toEqual(p(1, 2.5));
  });

  it('clears the cursor when the pointer leaves the plane', () => {
    const draft = moveCursor(draftOf([p(0, 0)]), null, GRID);
    expect(draft.cursor).toBeNull();
  });

  it('applies the ortho constraint to the preview', () => {
    expect(moveCursor(draftOf([p(0, 0)]), p(5, 1), ORTHO).cursor).toEqual(p(5, 0));
  });

  it('is inert once closed', () => {
    const closed = draftOf(SQUARE, true);
    expect(moveCursor(closed, p(9, 9), GRID)).toBe(closed);
  });
});

describe('closeDraft / canClose', () => {
  it.each([0, 1, 2])('cannot close with %i points', (n) => {
    expect(canClose(draftOf(SQUARE.slice(0, n)))).toBe(false);
  });

  it('can close with three points', () => {
    expect(canClose(draftOf(SQUARE.slice(0, 3)))).toBe(true);
  });

  it('cannot close twice', () => {
    expect(canClose(draftOf(SQUARE, true))).toBe(false);
  });

  it('clears the cursor when closing', () => {
    const draft = closeDraft({ points: SQUARE, cursor: p(1, 1), closed: false });
    expect(draft).toMatchObject({ closed: true, cursor: null });
  });

  it('is a no-op with too few points', () => {
    const draft = draftOf([p(0, 0), p(1, 0)]);
    expect(closeDraft(draft)).toBe(draft);
  });
});

describe('undoLastPoint', () => {
  it('removes the last point', () => {
    expect(undoLastPoint(draftOf(SQUARE)).points).toEqual(SQUARE.slice(0, 3));
  });

  it('reopens a closed outline without dropping a point', () => {
    // Closing commits no point of its own, so undoing it must not remove one.
    const draft = undoLastPoint(draftOf(SQUARE, true));
    expect(draft.closed).toBe(false);
    expect(draft.points).toHaveLength(4);
  });

  it('is a no-op on an empty draft', () => {
    const draft = emptyDraft();
    expect(undoLastPoint(draft)).toBe(draft);
  });

  it('unwinds an entire outline', () => {
    let draft = draftOf(SQUARE, true);
    for (let i = 0; i < 5; i++) draft = undoLastPoint(draft);
    expect(draft.points).toEqual([]);
    expect(draft.closed).toBe(false);
  });
});

describe('previewPath', () => {
  it('is empty with nothing drawn and no cursor', () => {
    expect(previewPath(emptyDraft())).toEqual([]);
  });

  it('is just the cursor before the first click', () => {
    expect(previewPath({ points: [], cursor: p(1, 1), closed: false })).toEqual([p(1, 1)]);
  });

  it('rubber-bands from the committed points to the cursor', () => {
    expect(previewPath({ points: [p(0, 0), p(4, 0)], cursor: p(4, 3), closed: false })).toEqual([
      p(0, 0),
      p(4, 0),
      p(4, 3),
    ]);
  });

  it('omits the rubber band when the pointer is off the plane', () => {
    expect(previewPath(draftOf([p(0, 0), p(4, 0)]))).toEqual([p(0, 0), p(4, 0)]);
  });

  it('returns to the start once closed', () => {
    const path = previewPath(draftOf(SQUARE, true));
    expect(path).toHaveLength(5);
    expect(path[4]).toEqual(path[0]);
  });

  it('copies the closing point rather than aliasing the first', () => {
    const path = previewPath(draftOf(SQUARE, true));
    expect(path[4]).not.toBe(path[0]);
  });
});

describe('draftPerimeter', () => {
  it('measures an open outline', () => {
    expect(draftPerimeter(draftOf([p(0, 0), p(3, 0), p(3, 4)]))).toBeCloseTo(7);
  });

  it('includes the closing segment once closed', () => {
    expect(draftPerimeter(draftOf([p(0, 0), p(3, 0), p(3, 4)], true))).toBeCloseTo(12);
  });

  it('is zero for an empty draft', () => {
    expect(draftPerimeter(emptyDraft())).toBe(0);
  });
});

describe('toFloorplanParams', () => {
  it('produces params from a closed draft', () => {
    expect(toFloorplanParams(draftOf(SQUARE, true), 2.5)).toEqual({
      points: SQUARE,
      height: 2.5,
      baseZ: 0,
    });
  });

  it('honours an explicit baseZ', () => {
    expect(toFloorplanParams(draftOf(SQUARE, true), 2.5, 10)?.baseZ).toBe(10);
  });

  it('returns null while the outline is open', () => {
    expect(toFloorplanParams(draftOf(SQUARE), 2.5)).toBeNull();
  });

  it('returns null with too few points', () => {
    expect(toFloorplanParams(draftOf(SQUARE.slice(0, 2), true), 2.5)).toBeNull();
  });

  it('copies the points, so later edits do not reach back into the draft', () => {
    const draft = draftOf(SQUARE, true);
    const params = toFloorplanParams(draft, 2.5)!;
    params.points[0].x = 99;
    expect(draft.points[0].x).toBe(0);
  });
});

describe('draftIssues', () => {
  it('reports nothing while the outline is still open', () => {
    expect(draftIssues(draftOf(SQUARE), 2.5)).toEqual([]);
  });

  it('reports nothing for a valid closed outline', () => {
    expect(draftIssues(draftOf(SQUARE, true), 2.5)).toEqual([]);
  });

  it('surfaces a self-intersection for live feedback', () => {
    const bowtie = [p(0, 0), p(5, 4), p(5, 0), p(0, 3)];
    expect(draftIssues(draftOf(bowtie, true), 2.5).map((i) => i.code)).toContain(
      'self-intersecting'
    );
  });

  it('surfaces an invalid height', () => {
    expect(draftIssues(draftOf(SQUARE, true), 0).map((i) => i.code)).toContain('invalid-height');
  });
});

describe('drawing a room end to end', () => {
  it('clicks out a square, closes it, and yields usable params', () => {
    let draft = emptyDraft();
    draft = moveCursor(draft, p(0.05, 0.05), GRID);
    for (const point of SQUARE) draft = addPoint(draft, point, GRID);
    draft = addPoint(draft, p(0.1, -0.1), GRID); // click back on the start

    expect(draft.closed).toBe(true);
    expect(toFloorplanParams(draft, 3)).toEqual({ points: SQUARE, height: 3, baseZ: 0 });
    expect(draftIssues(draft, 3)).toEqual([]);
  });

  it('draws an L-shape with ortho engaged', () => {
    const clicks = [p(0, 0), p(4.1, 0.2), p(4.05, 2.1), p(2.1, 2.05), p(1.9, 4.1), p(0.1, 4.05)];
    const settings: SnapSettings = { gridSize: 0.5, ortho: true, closeDistance: 0.5 };

    let draft = emptyDraft();
    for (const click of clicks) draft = addPoint(draft, click, settings);
    draft = closeDraft(draft);

    expect(draft.points).toEqual([
      p(0, 0),
      p(4, 0),
      p(4, 2),
      p(2, 2),
      p(2, 4),
      p(0, 4),
    ]);
    expect(draftIssues(draft, 2.5)).toEqual([]);
  });

  it('uses sensible defaults', () => {
    expect(DEFAULT_SNAP).toEqual({ gridSize: 0.25, ortho: false, closeDistance: 0.5 });
  });
});
