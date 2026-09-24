/**
 * Voxelization — Phase 2 of the ARD solver (docs/ard-solver-plan.md).
 *
 * ARD needs the room's **air region** as a grid of cells, because the
 * decomposition (Phase 3) packs boxes into it and the partitions (Phase 4)
 * live on it. The reference implementation has nothing to port here: it reads
 * a pre-baked `.rec` box list produced by an offline MATLAB step
 * (`Partition::readFromRecFile`), so this and Phase 3 are new code.
 *
 * Two passes:
 *
 * 1. **Rasterize** every surface triangle into the grid with an exact
 *    triangle-box overlap test, marking those cells solid and recording which
 *    surface each belongs to. That gives a shell, not a filled volume.
 * 2. **Flood fill** the air from a seed, 6-connected, through non-solid cells.
 *    Only the component reachable from the seed becomes air, which is what
 *    discards the exterior and any sealed void — a closet nobody opened is not
 *    part of the room's acoustic volume.
 *
 * ## Why not a BVH
 *
 * The plan called for a `three-mesh-bvh` box-vs-triangle query per candidate
 * cell. Scattering each triangle into the cells its own bounding box covers is
 * strictly better: the work is proportional to the surface area in cells — that
 * is, to the number of solid cells actually produced — rather than to the
 * volume of the grid times `log(triangles)`. It also needs no acceleration
 * structure and no dependency. The overlap test itself is exact either way.
 *
 * ## Leak detection
 *
 * The grid is padded by a cell on every side, so the exterior always touches
 * the rim. If the fill reaches the rim, either the seed was outside the room or
 * the surfaces do not close — a gap of even one cell lets the interior drain
 * into the exterior and the "air region" becomes the whole bounding box. That
 * is reported rather than thrown: the caller may still want the grid for
 * diagnosis, and a room that fails here needs geometry attention, not a retry.
 *
 * ## Staircasing
 *
 * Surfaces that are not axis-aligned become stair steps. That is intrinsic to
 * grid methods and a real accuracy limit, not something this implementation
 * chooses; it is the reason the plan keeps ARD to the low-frequency band.
 *
 * A face lying exactly on the boundary between two cells marks both of them
 * (#230), so on such faces the air region sits up to half a cell further in
 * than on a face that cuts through cells. Worth remembering when comparing
 * the air volume with the model's.
 */

/** Cell states. After `voxelize` only these two remain. */
export const enum Cell {
  Solid = 0,
  Air = 1,
}

export interface VoxelTriangle {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  cx: number;
  cy: number;
  cz: number;
  /** Index of the surface this triangle came from, for per-band absorption. */
  surfaceIndex: number;
}

export interface VoxelGrid {
  nx: number;
  ny: number;
  nz: number;
  /** Cell size in metres. */
  dx: number;
  /** World position of the centre of cell (0, 0, 0). */
  origin: { x: number; y: number; z: number };
  /** `Cell.Solid` or `Cell.Air`, length `nx*ny*nz`, first axis contiguous. */
  cells: Uint8Array;
  /** Parent surface index on solid boundary cells, -1 elsewhere. */
  surfaceOf: Int32Array;
  /**
   * Staircase face weights (#220), three per cell: for each axis, the largest
   * `|n_axis|` among the unit normals of the triangles overlapping the cell,
   * or -1 where no triangle did. See {@link faceWeight}.
   *
   * Optional because a grid built by hand, as the tests' shoeboxes are, is
   * axis-aligned and needs no correction — absent reads as weight 1.
   */
  faceWeightOf?: Float32Array;
  /**
   * True area in m² of each surface index's triangles, for the staircase
   * diagnostic (#220). Optional for the same reason as `faceWeightOf`.
   */
  surfaceArea?: Record<number, number>;
  airCount: number;
  solidCount: number;
  /**
   * True when the flood fill reached the padded rim: the surfaces do not close,
   * or the seed was outside the room. The air region is then meaningless.
   */
  leaked: boolean;
  /** Human-readable problems worth surfacing to the user. */
  warnings: string[];
}

export interface VoxelizeOptions {
  /** Cell size in metres. Usually `c / (cellsPerWavelength * fMax)`. */
  dx: number;
  /** A point known to be inside the room. Defaults to the vertex centroid. */
  seed?: { x: number; y: number; z: number };
  /** Empty cells of padding around the geometry. At least 1, for leak detection. */
  padCells?: number;
  /** Refuse grids larger than this many cells. */
  maxCells?: number;
}

/** `dx` for an upper frequency limit, at a given spatial sampling density. */
export function cellSizeFor(fMax: number, c = 343, cellsPerWavelength = 2.6): number {
  if (!(fMax > 0)) throw new Error(`fMax must be positive, got ${fMax}`);
  return c / (cellsPerWavelength * fMax);
}

const DEFAULT_MAX_CELLS = 64_000_000;

/**
 * Exact triangle/axis-aligned-box overlap, by the separating axis theorem
 * (Akenine-Möller). Thirteen axes: three box normals, the triangle normal, and
 * the nine edge × box-normal cross products. The triangle is passed already
 * translated so the box is centred on the origin.
 *
 * A conservative bounding-box test would be cheaper but thickens oblique walls
 * into a blob several cells deep, which changes the air volume and therefore
 * the modal frequencies.
 */
function triangleOverlapsBox(
  v0x: number, v0y: number, v0z: number,
  v1x: number, v1y: number, v1z: number,
  v2x: number, v2y: number, v2z: number,
  hx: number, hy: number, hz: number,
): boolean {
  // Box normals.
  if (Math.min(v0x, v1x, v2x) > hx || Math.max(v0x, v1x, v2x) < -hx) return false;
  if (Math.min(v0y, v1y, v2y) > hy || Math.max(v0y, v1y, v2y) < -hy) return false;
  if (Math.min(v0z, v1z, v2z) > hz || Math.max(v0z, v1z, v2z) < -hz) return false;

  const ex = [v1x - v0x, v2x - v1x, v0x - v2x];
  const ey = [v1y - v0y, v2y - v1y, v0y - v2y];
  const ez = [v1z - v0z, v2z - v1z, v0z - v2z];

  // Triangle normal, from the first two edges.
  const nx = ey[0] * ez[1] - ez[0] * ey[1];
  const ny = ez[0] * ex[1] - ex[0] * ez[1];
  const nz = ex[0] * ey[1] - ey[0] * ex[1];
  const planeRadius = hx * Math.abs(nx) + hy * Math.abs(ny) + hz * Math.abs(nz);
  if (Math.abs(nx * v0x + ny * v0y + nz * v0z) > planeRadius) return false;

  // Nine edge x basis axes.
  for (let e = 0; e < 3; e++) {
    const ax = ex[e];
    const ay = ey[e];
    const az = ez[e];

    // axis = edge x (1,0,0) = (0, az, -ay)
    let p0 = az * v0y - ay * v0z;
    let p1 = az * v1y - ay * v1z;
    let p2 = az * v2y - ay * v2z;
    let radius = hy * Math.abs(az) + hz * Math.abs(ay);
    if (Math.min(p0, p1, p2) > radius || Math.max(p0, p1, p2) < -radius) return false;

    // axis = edge x (0,1,0) = (-az, 0, ax)
    p0 = -az * v0x + ax * v0z;
    p1 = -az * v1x + ax * v1z;
    p2 = -az * v2x + ax * v2z;
    radius = hx * Math.abs(az) + hz * Math.abs(ax);
    if (Math.min(p0, p1, p2) > radius || Math.max(p0, p1, p2) < -radius) return false;

    // axis = edge x (0,0,1) = (ay, -ax, 0)
    p0 = ay * v0x - ax * v0y;
    p1 = ay * v1x - ax * v1y;
    p2 = ay * v2x - ax * v2y;
    radius = hx * Math.abs(ay) + hy * Math.abs(ax);
    if (Math.min(p0, p1, p2) > radius || Math.max(p0, p1, p2) < -radius) return false;
  }

  return true;
}

/**
 * Voxelize a set of world-space triangles into a room's air region.
 *
 * Pure: no `three`, no stores, no DOM. `voxelizeRoom` adapts a CRAM `Room` onto
 * it.
 */
export function voxelizeTriangles(
  triangles: readonly VoxelTriangle[],
  options: VoxelizeOptions,
): VoxelGrid {
  const { dx, seed, padCells = 1, maxCells = DEFAULT_MAX_CELLS } = options;
  const warnings: string[] = [];

  if (!(dx > 0)) throw new Error(`Cell size must be positive, got ${dx}`);
  if (!Number.isInteger(padCells) || padCells < 1) {
    throw new Error(`padCells must be an integer >= 1, got ${padCells}`);
  }
  if (triangles.length === 0) throw new Error('Cannot voxelize an empty surface set');

  // World bounds of the geometry, and the vertex centroid as a fallback seed.
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;
  for (const t of triangles) {
    minX = Math.min(minX, t.ax, t.bx, t.cx);
    minY = Math.min(minY, t.ay, t.by, t.cy);
    minZ = Math.min(minZ, t.az, t.bz, t.cz);
    maxX = Math.max(maxX, t.ax, t.bx, t.cx);
    maxY = Math.max(maxY, t.ay, t.by, t.cy);
    maxZ = Math.max(maxZ, t.az, t.bz, t.cz);
    sumX += t.ax + t.bx + t.cx;
    sumY += t.ay + t.by + t.cy;
    sumZ += t.az + t.bz + t.cz;
  }
  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
    throw new Error('Surface geometry has non-finite coordinates');
  }

  const nx = Math.ceil((maxX - minX) / dx) + 2 * padCells + 1;
  const ny = Math.ceil((maxY - minY) / dx) + 2 * padCells + 1;
  const nz = Math.ceil((maxZ - minZ) / dx) + 2 * padCells + 1;

  const total = nx * ny * nz;
  if (total > maxCells) {
    throw new Error(
      `Voxel grid would be ${nx}x${ny}x${nz} = ${total} cells, over the limit of ` +
        `${maxCells}. Raise dx (lower fMax) or raise maxCells.`,
    );
  }

  // Cell (i,j,k) is centred at origin + (i,j,k)*dx.
  const origin = {
    x: minX - padCells * dx,
    y: minY - padCells * dx,
    z: minZ - padCells * dx,
  };

  const cells = new Uint8Array(total);
  const surfaceOf = new Int32Array(total).fill(-1);
  const faceWeightOf = new Float32Array(3 * total).fill(-1);
  const surfaceArea: Record<number, number> = {};
  const strideY = nx;
  const strideZ = nx * ny;

  // --- Pass 1: rasterize the shell -------------------------------------------
  const h = dx / 2;
  // The overlap test's half-size, a hair over h. A face lying exactly on the
  // boundary between two cells is at distance h from both centres, and the
  // rounding in `origin + k·dx` can put it a last bit outside each, so neither
  // claims it and the fill leaks through a one-cell gap (#230). The slack is
  // far above that rounding and far below anything that changes a wall's
  // thickness; a face on a boundary now marks both cells.
  const hTest = h * (1 + 1e-7);
  for (const t of triangles) {
    // |n| per axis, for the staircase weights. A degenerate triangle has no
    // normal and contributes none, leaving its cells at weight 1 unless a
    // proper triangle also overlaps them.
    const ux = t.bx - t.ax, uy = t.by - t.ay, uz = t.bz - t.az;
    const vx = t.cx - t.ax, vy = t.cy - t.ay, vz = t.cz - t.az;
    const crossX = uy * vz - uz * vy;
    const crossY = uz * vx - ux * vz;
    const crossZ = ux * vy - uy * vx;
    const crossLength = Math.hypot(crossX, crossY, crossZ);
    const hasNormal = crossLength > 0;
    surfaceArea[t.surfaceIndex] = (surfaceArea[t.surfaceIndex] ?? 0) + crossLength / 2;
    const absN = hasNormal
      ? [Math.abs(crossX) / crossLength, Math.abs(crossY) / crossLength, Math.abs(crossZ) / crossLength]
      : [0, 0, 0];

    const tMinX = Math.min(t.ax, t.bx, t.cx);
    const tMinY = Math.min(t.ay, t.by, t.cy);
    const tMinZ = Math.min(t.az, t.bz, t.cz);
    const tMaxX = Math.max(t.ax, t.bx, t.cx);
    const tMaxY = Math.max(t.ay, t.by, t.cy);
    const tMaxZ = Math.max(t.az, t.bz, t.cz);

    // Cell range the triangle can possibly touch, widened by a half cell.
    const i0 = Math.max(0, Math.floor((tMinX - h - origin.x) / dx));
    const i1 = Math.min(nx - 1, Math.ceil((tMaxX + h - origin.x) / dx));
    const j0 = Math.max(0, Math.floor((tMinY - h - origin.y) / dx));
    const j1 = Math.min(ny - 1, Math.ceil((tMaxY + h - origin.y) / dx));
    const k0 = Math.max(0, Math.floor((tMinZ - h - origin.z) / dx));
    const k1 = Math.min(nz - 1, Math.ceil((tMaxZ + h - origin.z) / dx));

    for (let k = k0; k <= k1; k++) {
      const cz = origin.z + k * dx;
      for (let j = j0; j <= j1; j++) {
        const cy = origin.y + j * dx;
        const rowBase = nx * (j + ny * k);
        for (let i = i0; i <= i1; i++) {
          const cx = origin.x + i * dx;
          if (
            !triangleOverlapsBox(
              t.ax - cx, t.ay - cy, t.az - cz,
              t.bx - cx, t.by - cy, t.bz - cz,
              t.cx - cx, t.cy - cy, t.cz - cz,
              hTest, hTest, hTest,
            )
          ) {
            continue;
          }
          const idx = rowBase + i;
          cells[idx] = Cell.Solid;
          // First writer wins. Where two surfaces meet, the shared corner cell
          // is attributed to whichever triangle reached it first; Phase 6 may
          // want an area-weighted rule for per-band absorption at corners.
          if (surfaceOf[idx] < 0) surfaceOf[idx] = t.surfaceIndex;
          // The weight is per axis and takes the largest over every triangle
          // here, not the first writer's: where a wall meets the ceiling, the
          // face seen from below belongs to the ceiling whichever triangle
          // claimed the cell, and a first-writer normal would make it rigid.
          if (hasNormal) {
            for (let a = 0; a < 3; a++) {
              if (absN[a] > faceWeightOf[3 * idx + a]) faceWeightOf[3 * idx + a] = absN[a];
            }
          }
        }
      }
    }
  }

  // --- Pass 2: flood fill the air --------------------------------------------
  const vertexCount = triangles.length * 3;
  const seedPoint = seed ?? {
    x: sumX / vertexCount,
    y: sumY / vertexCount,
    z: sumZ / vertexCount,
  };
  const clamp = (v: number, hi: number) => Math.min(hi, Math.max(0, v));
  const si = clamp(Math.round((seedPoint.x - origin.x) / dx), nx - 1);
  const sj = clamp(Math.round((seedPoint.y - origin.y) / dx), ny - 1);
  const sk = clamp(Math.round((seedPoint.z - origin.z) / dx), nz - 1);
  const seedIdx = si + nx * (sj + ny * sk);

  const stack = new Int32Array(total);

  /**
   * Fill from one cell and report whether the result is sealed.
   *
   * `cells` carries nothing but the fill result — the shell lives in
   * `surfaceOf` — so clearing it is a complete reset between attempts.
   */
  const attemptFill = (from: number): { airCount: number; touchedRim: boolean } => {
    cells.fill(Cell.Solid);
    let top = 0;
    stack[top++] = from;
    cells[from] = Cell.Air;
    let airCount = 1;

    while (top > 0) {
      const idx = stack[--top];
      const i = idx % nx;
      const j = ((idx - i) / nx) % ny;
      const k = Math.floor(idx / strideZ);

      if (i > 0) push(idx - 1);
      if (i < nx - 1) push(idx + 1);
      if (j > 0) push(idx - strideY);
      if (j < ny - 1) push(idx + strideY);
      if (k > 0) push(idx - strideZ);
      if (k < nz - 1) push(idx + strideZ);
    }

    function push(n: number): void {
      if (cells[n] === Cell.Air || surfaceOf[n] >= 0) return;
      cells[n] = Cell.Air;
      airCount++;
      stack[top++] = n;
    }

    return { airCount, touchedRim: fillTouchesRim(cells, nx, ny, nz) };
  };

  let result: { airCount: number; touchedRim: boolean };

  if (surfaceOf[seedIdx] < 0) {
    // The seed landed in free space. Take its answer as given: if that fill
    // leaks, the geometry is open or the seed is outside, and relocating would
    // hide a real problem behind a different starting point.
    result = attemptFill(seedIdx);
  } else {
    // The seed landed on a wall cell. That is not exotic: `Math.round` maps any
    // world point within half a cell of a wall-cell centre onto it, so a source
    // mounted flush to a surface — or anywhere in the half-cell band inside it
    // — arrives here.
    //
    // Which free cell we relocate to has to be decided by whether the fill from
    // it stays sealed, not by scan order. Picking the first free cell found
    // walking k, then j, then i ascending biases hard toward the low-index
    // side, which for a wall on -x, -y or -z is the exterior: the fill then
    // floods the outside of a perfectly watertight room and `decompose`
    // refuses it.
    const candidates = relocationCandidates(surfaceOf, nx, ny, nz, si, sj, sk);
    if (candidates.length === 0) {
      throw new Error('No free cell found near the seed point; the grid is entirely solid');
    }

    let chosen: { airCount: number; touchedRim: boolean } | null = null;
    for (const candidate of candidates) {
      const attempt = attemptFill(candidate);
      if (!attempt.touchedRim) {
        chosen = attempt;
        break;
      }
      // Keep the first attempt so a genuinely open room still reports
      // something rather than the last candidate tried.
      if (chosen === null) chosen = attempt;
    }
    result = chosen!;
    if (result.touchedRim) {
      // Re-run so `cells` matches the result being reported.
      result = attemptFill(candidates[0]);
    }

    warnings.push(
      'The seed point landed on a wall cell; the fill started from the nearest enclosed ' +
        'free cell instead.',
    );
  }

  const airCount = result.airCount;
  const leaked = result.touchedRim;
  if (leaked) {
    warnings.push(
      'The air fill reached the edge of the padded grid. The room surfaces do not close, ' +
        'or the seed point is outside them. The air region covers the whole bounding box ' +
        'and is not usable.',
    );
  }

  return {
    nx,
    ny,
    nz,
    dx,
    origin,
    cells,
    surfaceOf,
    faceWeightOf,
    surfaceArea,
    airCount,
    solidCount: total - airCount,
    leaked,
    warnings,
  };
}

/**
 * Staircase weight `|n·e|` of the face a solid cell presents across `axis`
 * (#220).
 *
 * A surface that is not axis-aligned voxelizes into a staircase, and every
 * exposed cell face of it would otherwise absorb as though it were real
 * surface: `|nₓ| + |n_y| + |n_z|` times the true area, √3 at worst. Weighting
 * each face's admittance by the cosine between the surface and that face makes
 * the weighted area `Σ nₐ² = 1` per unit of surface, which is PFFDTD's
 * surface-area correction.
 *
 * 1 — uncorrected — for a grid without weights, a cell no triangle reached
 * (padding, or a face against the grid edge), or an index off the grid.
 */
export function faceWeight(grid: VoxelGrid, index: number, axis: 0 | 1 | 2): number {
  const weights = grid.faceWeightOf;
  if (!weights || index < 0 || 3 * index + axis >= weights.length) return 1;
  const w = weights[3 * index + axis];
  return w >= 0 ? w : 1;
}

/** Does the filled region touch the padded rim? */
function fillTouchesRim(cells: Uint8Array, nx: number, ny: number, nz: number): boolean {
  for (let k = 0; k < nz; k++) {
    const onZRim = k === 0 || k === nz - 1;
    for (let j = 0; j < ny; j++) {
      const onYRim = j === 0 || j === ny - 1;
      const rowBase = nx * (j + ny * k);
      if (onZRim || onYRim) {
        for (let i = 0; i < nx; i++) if (cells[rowBase + i] === Cell.Air) return true;
      } else if (cells[rowBase] === Cell.Air || cells[rowBase + nx - 1] === Cell.Air) {
        return true;
      }
    }
  }
  return false;
}

/** How many candidates a relocated seed will try before giving up. */
const MAX_RELOCATION_CANDIDATES = 12;

/**
 * Free cells near a seed that landed on a wall, best first.
 *
 * Ordered by Chebyshev radius, then — and this is the part that matters — by
 * distance to the centre of the grid rather than by scan order. The caller
 * still validates each by filling from it, so this ordering only decides how
 * quickly the right one is found, not whether it is correct.
 */
function relocationCandidates(
  surfaceOf: Int32Array,
  nx: number,
  ny: number,
  nz: number,
  si: number,
  sj: number,
  sk: number,
): number[] {
  const centreI = (nx - 1) / 2;
  const centreJ = (ny - 1) / 2;
  const centreK = (nz - 1) / 2;
  const found: number[] = [];
  const maxRadius = Math.max(nx, ny, nz);

  for (let r = 1; r < maxRadius && found.length < MAX_RELOCATION_CANDIDATES; r++) {
    const ring: Array<{ idx: number; toCentre: number }> = [];
    for (let k = Math.max(0, sk - r); k <= Math.min(nz - 1, sk + r); k++) {
      for (let j = Math.max(0, sj - r); j <= Math.min(ny - 1, sj + r); j++) {
        for (let i = Math.max(0, si - r); i <= Math.min(nx - 1, si + r); i++) {
          const onShell =
            Math.abs(i - si) === r || Math.abs(j - sj) === r || Math.abs(k - sk) === r;
          if (!onShell) continue;
          const idx = i + nx * (j + ny * k);
          if (surfaceOf[idx] >= 0) continue;
          const di = i - centreI;
          const dj = j - centreJ;
          const dk = k - centreK;
          ring.push({ idx, toCentre: di * di + dj * dj + dk * dk });
        }
      }
    }
    ring.sort((a, b) => a.toCentre - b.toCentre || a.idx - b.idx);
    for (const entry of ring) {
      found.push(entry.idx);
      if (found.length >= MAX_RELOCATION_CANDIDATES) break;
    }
  }

  return found;
}

/**
 * The nearest cell to `from` that `accept` allows, searched outward.
 *
 * Ordered by Chebyshev radius, then by true distance from `from` within a
 * radius. That differs on purpose from the *seed* relocation above, which
 * breaks ties toward the centre of the grid: a seed has to land somewhere in
 * the main volume and any interior cell will do, while a probe stands for a
 * microphone or a loudspeaker the user placed and should move as little as
 * possible.
 *
 * Returns `from` itself when it is already acceptable, and `null` when nothing
 * within `maxRadius` is. Callers that need to know how far it moved can compare
 * the result against what they passed in — the distance matters, because `dx`
 * is `c/(n·fMax)` and at 500 Hz that is 26 cm.
 */
export function nearestCell(
  grid: VoxelGrid,
  from: { i: number; j: number; k: number },
  accept: (index: number, i: number, j: number, k: number) => boolean,
  maxRadius = 8,
): { i: number; j: number; k: number } | null {
  const { nx, ny, nz } = grid;
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);

  const inside = (i: number, j: number, k: number) =>
    i >= 0 && j >= 0 && k >= 0 && i < nx && j < ny && k < nz;

  if (inside(from.i, from.j, from.k) && accept(at(from.i, from.j, from.k), from.i, from.j, from.k)) {
    return { ...from };
  }

  for (let r = 1; r <= maxRadius; r++) {
    const ring: Array<{ i: number; j: number; k: number; distance: number }> = [];
    for (let k = from.k - r; k <= from.k + r; k++) {
      for (let j = from.j - r; j <= from.j + r; j++) {
        for (let i = from.i - r; i <= from.i + r; i++) {
          const onShell =
            Math.abs(i - from.i) === r ||
            Math.abs(j - from.j) === r ||
            Math.abs(k - from.k) === r;
          if (!onShell || !inside(i, j, k)) continue;
          const index = at(i, j, k);
          if (!accept(index, i, j, k)) continue;
          const di = i - from.i;
          const dj = j - from.j;
          const dk = k - from.k;
          ring.push({ i, j, k, distance: di * di + dj * dj + dk * dk });
        }
      }
    }
    if (ring.length === 0) continue;
    ring.sort((a, b) => a.distance - b.distance || a.i - b.i || a.j - b.j || a.k - b.k);
    const { i, j, k } = ring[0];
    return { i, j, k };
  }

  return null;
}

/** Linear index of a cell, or -1 if outside the grid. */
export function cellIndex(grid: VoxelGrid, i: number, j: number, k: number): number {
  if (i < 0 || j < 0 || k < 0 || i >= grid.nx || j >= grid.ny || k >= grid.nz) return -1;
  return i + grid.nx * (j + grid.ny * k);
}

/** Grid cell containing a world point, or null if outside the grid. */
export function worldToCell(
  grid: VoxelGrid,
  p: { x: number; y: number; z: number },
): { i: number; j: number; k: number } | null {
  const i = Math.round((p.x - grid.origin.x) / grid.dx);
  const j = Math.round((p.y - grid.origin.y) / grid.dx);
  const k = Math.round((p.z - grid.origin.z) / grid.dx);
  if (i < 0 || j < 0 || k < 0 || i >= grid.nx || j >= grid.ny || k >= grid.nz) return null;
  return { i, j, k };
}

/** World position of a cell centre. */
export function cellToWorld(
  grid: VoxelGrid,
  i: number,
  j: number,
  k: number,
): { x: number; y: number; z: number } {
  return {
    x: grid.origin.x + i * grid.dx,
    y: grid.origin.y + j * grid.dx,
    z: grid.origin.z + k * grid.dx,
  };
}
