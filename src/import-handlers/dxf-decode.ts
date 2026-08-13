import DxfParser from 'dxf-parser';
import type { Dxf } from './dxf';

/**
 * Parsing and geometry decoding for DXF, kept free of THREE, the stores, and the DOM so
 * it can run inside a worker as well as on the main thread. Everything that builds scene
 * objects lives in ./dxf.
 */

/** One polyface mesh, flattened to triangle vertices. */
export interface DecodedMesh {
  layer: string;
  positions: number[];
}

export interface DecodedDxf {
  meshes: DecodedMesh[];
  /** Displacement removed from the positions, to be carried on the Room transform. */
  offset: [number, number, number] | null;
}

/**
 * Largest positional error we are willing to bake into the geometry, in model units.
 * A millimetre is far below anything acoustically meaningful — the shortest wavelength
 * in the 8 kHz band is roughly 43 mm.
 */
const POSITION_TOLERANCE = 1e-3;

/** Worst error introduced by storing these coordinates as float32. */
export const worstFloat32Error = (positions: number[]) => {
  let worst = 0;
  for (const value of positions) {
    const error = Math.abs(Math.fround(value) - value);
    if (error > worst) worst = error;
  }
  return worst;
};

/**
 * Centre of the axis-aligned bounds, or null when float32 already represents the file
 * faithfully.
 *
 * Vertex positions reach WebGL as float32, which carries about seven significant digits.
 * DXF files drawn on a site grid — UTM, state plane — put coordinates in the millions,
 * where consecutive float32 values are half a metre apart, so distinct walls collapse
 * onto each other. Shifting the geometry to the origin and carrying the displacement on
 * the Room's transform keeps the detail, because Object3D.position is float64.
 */
export const recenteringOffset = (positions: number[]): [number, number, number] | null => {
  if (positions.length === 0) return null;
  if (worstFloat32Error(positions) <= POSITION_TOLERANCE) return null;

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let axis = 0; axis < 3; axis++) {
      const value = positions[i + axis];
      if (value < min[axis]) min[axis] = value;
      if (value > max[axis]) max[axis] = value;
    }
  }
  return [0, 1, 2].map((axis) => (min[axis] + max[axis]) / 2) as [number, number, number];
};

export const applyOffset = (positions: number[], offset: [number, number, number] | null) =>
  offset ? positions.map((value, i) => value - offset[i % 3]) : positions;

/** Entity types this importer turns into geometry. */
const SUPPORTED_ENTITIES = ["POLYLINE", "3DFACE"];

/**
 * dxf-parser pads 3DFACE vertex lists with an empty object, and drops coordinates it
 * cannot complete, so points have to be checked rather than trusted.
 */
const isCompletePoint = (point: { x?: number; y?: number; z?: number } | undefined) =>
  !!point &&
  Number.isFinite(point.x) &&
  Number.isFinite(point.y) &&
  Number.isFinite(point.z);

/**
 * Flatten indexed triangles into raw vertex positions.
 *
 * The reversal flips winding, which is the convention this importer has always used;
 * applying it to a concatenation of contiguous triples reverses each triple as well as
 * their order, so every triangle is flipped consistently.
 */
const flattenTriangles = (vertices: number[][], indices: number[][]) =>
  (indices.flat().reverse() as number[]).map(index => vertices[index]).flat() as number[];

/** Explain an import that produced nothing, naming what the file actually held. */
const describeUnsupportedContent = (parsed: Dxf) => {
  const present = [...new Set(parsed.entities.map(entity => entity.type))].filter(Boolean);

  if (present.length === 0) {
    return "This DXF file contains no entities to import.";
  }
  return (
    `No importable geometry found in this DXF file. It contains ${present.sort().join(", ")}, ` +
    `and this importer reads ${SUPPORTED_ENTITIES.join(" and ")} entities. ` +
    `Re-exporting the drawing as a 3D mesh usually resolves this.`
  );
};

/**
 * Parse a DXF document and flatten its meshes into triangle vertices, recentred if the
 * file's coordinates outrun float32.
 *
 * Throws a descriptive Error for input that cannot be read: dxf-parser raises a bare
 * scanner error on any group code it doesn't recognise and returns null for input it
 * can't make sense of at all, neither of which says anything about the file.
 */
export function decodeDxf(data: string): DecodedDxf {
  let parsedData: unknown;
  try {
    parsedData = new DxfParser().parseSync(data);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not parse DXF file: ${detail}`);
  }
  if (!parsedData) {
    throw new Error("Could not parse DXF file: the parser returned no data.");
  }

  const parsed = parsedData as Dxf;
  if (!Array.isArray(parsed.entities)) {
    throw new Error("Could not read DXF file: no ENTITIES section was found.");
  }

  // Decode every mesh before computing the offset: it has to be shared by all of them,
  // since a per-surface offset would collapse each onto its own origin and scatter the
  // model.
  const meshes: DecodedMesh[] = [];

  parsed.entities.filter(x => x.type === "POLYLINE").forEach(polyline => {
    const vertices = [] as number[][];
    const indices = [] as number[][];
    polyline.vertices.forEach(vertex => {
      if (vertex["faceA"]) {
        // Face indices are 1-based, and negative when the edge leading away from that
        // vertex is invisible — so take the magnitude before converting to 0-based.
        const [a, b, c, d] = [vertex.faceA, vertex.faceB, vertex.faceC, vertex.faceD]
          .map(index => (index ? Math.abs(index) - 1 : -1));
        indices.push([a, b, c]);
        // A polyface quad carries a fourth index (group code 74); triangles leave it
        // absent, zero, or repeating the third vertex. Without this the second half of
        // every quad was dropped, leaving a hole.
        if (d >= 0 && d !== c) {
          indices.push([a, c, d]);
        }
      } else {
        vertices.push([vertex.x, vertex.y, vertex.z!]);
      }
    });

    meshes.push({ layer: polyline.layer, positions: flattenTriangles(vertices, indices) });
  });

  // 3DFACE is how most CAD tools export a plain triangulated surface, and each entity is
  // a single face rather than a whole mesh — so they are merged per layer instead of
  // becoming one Surface each, which would leave a model of thousands of one-triangle
  // surfaces that no material could sensibly be assigned to.
  const facesByLayer = new Map<string, { vertices: number[][]; indices: number[][] }>();
  parsed.entities.filter(x => x.type === "3DFACE").forEach(face => {
    const corners = (face.vertices ?? []).filter(isCompletePoint);
    if (corners.length < 3) return;

    const layer = face.layer;
    if (!facesByLayer.has(layer)) facesByLayer.set(layer, { vertices: [], indices: [] });
    const target = facesByLayer.get(layer)!;

    const base = target.vertices.length;
    corners.forEach(corner => target.vertices.push([corner.x, corner.y, corner.z!]));
    target.indices.push([base, base + 1, base + 2]);
    if (corners.length >= 4) {
      target.indices.push([base, base + 2, base + 3]);
    }
  });

  facesByLayer.forEach(({ vertices, indices }, layer) => {
    meshes.push({ layer, positions: flattenTriangles(vertices, indices) });
  });

  if (meshes.length === 0) {
    throw new Error(describeUnsupportedContent(parsed));
  }

  const offset = recenteringOffset(meshes.flatMap(mesh => mesh.positions));

  return {
    meshes: meshes.map(({ layer, positions }) => ({
      layer,
      positions: applyOffset(positions, offset),
    })),
    offset,
  };
}
