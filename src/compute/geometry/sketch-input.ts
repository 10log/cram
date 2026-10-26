/**
 * Sketch input — the state of a floorplan being drawn.
 *
 * All the decisions a drawing tool makes live here: where a click lands once
 * snapping is applied, whether it closes the loop, what the rubber-band preview
 * should look like, and when the outline is ready to extrude. The tool in
 * render/floorplan-tool.ts is left with pointer plumbing and three.js objects.
 *
 * Splitting it this way means the fiddly parts — ortho constraint interacting
 * with grid snap, close-loop tolerance, undo — are testable without a canvas,
 * a camera, or a DOM event.
 *
 * Coordinates are ground-plane XY in world units (CRAM is Z-up).
 *
 * Pure module — no THREE, no DOM. See room-mesh.ts.
 */

import { validateFloorplan, type FloorplanIssue, type FloorplanParams, type Point2 } from './floorplan';

export interface SketchDraft {
  /** Committed outline points, in click order. */
  points: Point2[];
  /** Snapped cursor position for the rubber-band segment, if the pointer is over the plane. */
  cursor: Point2 | null;
  /** True once the outline has been closed back to its first point. */
  closed: boolean;
}

export interface SnapSettings {
  /** Grid spacing in world units. 0 disables grid snapping. */
  gridSize: number;
  /** Constrain each segment to horizontal or vertical from the previous point. */
  ortho: boolean;
  /** How near the first point a click must land to close the loop, in world units. */
  closeDistance: number;
}

export const DEFAULT_SNAP: SnapSettings = {
  gridSize: 0.25,
  ortho: false,
  closeDistance: 0.5,
};

export interface SnapResult {
  point: Point2;
  /** The point landed on the outline's start and would close it. */
  closesLoop: boolean;
}

const EPS = 1e-9;

export function emptyDraft(): SketchDraft {
  return { points: [], cursor: null, closed: false };
}

/**
 * Rebuild a draft from an existing outline — used when the panel adopts a room
 * that was drawn in an earlier session. Copies the points, so editing the draft
 * cannot reach back into the mesh it came from.
 */
export function draftFromPoints(points: Point2[]): SketchDraft {
  return {
    points: points.map((p) => ({ x: p.x, y: p.y })),
    cursor: null,
    closed: points.length >= 3,
  };
}

function samePoint(a: Point2, b: Point2): boolean {
  return Math.abs(a.x - b.x) < EPS && Math.abs(a.y - b.y) < EPS;
}

function distance(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function snapToGrid(p: Point2, gridSize: number): Point2 {
  if (!(gridSize > 0)) return p;
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize,
  };
}

/** Constrain to whichever axis the pointer has travelled further along. */
function constrainOrtho(p: Point2, from: Point2): Point2 {
  const dx = Math.abs(p.x - from.x);
  const dy = Math.abs(p.y - from.y);
  return dx >= dy ? { x: p.x, y: from.y } : { x: from.x, y: p.y };
}

/** Whether the outline has enough points to be closed. */
export function canClose(draft: SketchDraft): boolean {
  return !draft.closed && draft.points.length >= 3;
}

/**
 * Resolve a raw ground-plane position into the point that would actually be used.
 *
 * Close-loop is tested against the *raw* position and wins outright: it is an
 * exact target the user is aiming at, and letting grid snap run first could
 * nudge the point off the start and leave the outline stubbornly open.
 */
export function snap(
  raw: Point2,
  draft: SketchDraft,
  settings: SnapSettings = DEFAULT_SNAP
): SnapResult {
  if (canClose(draft) && distance(raw, draft.points[0]) <= settings.closeDistance) {
    return { point: { ...draft.points[0] }, closesLoop: true };
  }

  const previous = draft.points[draft.points.length - 1];
  const constrained = settings.ortho && previous ? constrainOrtho(raw, previous) : raw;

  return { point: snapToGrid(constrained, settings.gridSize), closesLoop: false };
}

/** Update the rubber-band cursor. Pass null when the pointer leaves the plane. */
export function moveCursor(
  draft: SketchDraft,
  raw: Point2 | null,
  settings: SnapSettings = DEFAULT_SNAP
): SketchDraft {
  if (draft.closed) return draft;
  if (raw === null) return { ...draft, cursor: null };
  return { ...draft, cursor: snap(raw, draft, settings).point };
}

/**
 * Commit a point.
 *
 * Ignored when the draft is already closed, or when the click repeats the
 * previous point — a double click should not produce a zero-length wall that
 * validation would later reject.
 */
export function addPoint(
  draft: SketchDraft,
  raw: Point2,
  settings: SnapSettings = DEFAULT_SNAP
): SketchDraft {
  if (draft.closed) return draft;

  const { point, closesLoop } = snap(raw, draft, settings);
  if (closesLoop) return closeDraft(draft);

  const previous = draft.points[draft.points.length - 1];
  if (previous && samePoint(previous, point)) return draft;

  return { ...draft, points: [...draft.points, point], cursor: point };
}

/** Close the outline. No-op unless there are at least three points. */
export function closeDraft(draft: SketchDraft): SketchDraft {
  if (!canClose(draft)) return draft;
  return { ...draft, closed: true, cursor: null };
}

/**
 * Step backwards: reopen a closed outline, otherwise drop the last point.
 *
 * Closing adds no point of its own, so undoing it should not remove one either.
 */
export function undoLastPoint(draft: SketchDraft): SketchDraft {
  if (draft.closed) return { ...draft, closed: false };
  if (draft.points.length === 0) return draft;
  return { ...draft, points: draft.points.slice(0, -1) };
}

/**
 * The polyline to draw, including the rubber-band segment to the cursor and,
 * once closed, the segment back to the start.
 */
export function previewPath(draft: SketchDraft): Point2[] {
  if (draft.points.length === 0) return draft.cursor ? [draft.cursor] : [];
  if (draft.closed) return [...draft.points, { ...draft.points[0] }];
  return draft.cursor ? [...draft.points, draft.cursor] : [...draft.points];
}

/** Total length of the committed outline, closing segment included once closed. */
export function draftPerimeter(draft: SketchDraft): number {
  const path = draft.closed ? [...draft.points, draft.points[0]] : draft.points;
  let total = 0;
  for (let i = 1; i < path.length; i++) total += distance(path[i - 1], path[i]);
  return total;
}

/**
 * Turn a closed draft into extrudable parameters.
 *
 * @returns null while the outline is still open — the caller has nothing to
 *          build yet, which is not an error worth throwing over.
 */
export function toFloorplanParams(
  draft: SketchDraft,
  height: number,
  baseZ = 0
): FloorplanParams | null {
  if (!draft.closed || draft.points.length < 3) return null;
  return { points: draft.points.map((p) => ({ ...p })), height, baseZ };
}

/**
 * Problems that would stop the draft extruding, for live feedback while drawing.
 * An open outline reports nothing: it is incomplete, not wrong.
 */
export function draftIssues(draft: SketchDraft, height: number): FloorplanIssue[] {
  const params = toFloorplanParams(draft, height);
  return params ? validateFloorplan(params) : [];
}
