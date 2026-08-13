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
/** Worst error introduced by storing these coordinates as float32. */
export declare const worstFloat32Error: (positions: number[]) => number;
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
export declare const recenteringOffset: (positions: number[]) => [number, number, number] | null;
export declare const applyOffset: (positions: number[], offset: [number, number, number] | null) => number[];
/**
 * Parse a DXF document and flatten its polyface meshes into triangle vertices, recentred
 * if the file's coordinates outrun float32.
 *
 * Throws a descriptive Error for input that cannot be read: dxf-parser raises a bare
 * scanner error on any group code it doesn't recognise and returns null for input it
 * can't make sense of at all, neither of which says anything about the file.
 */
export declare function decodeDxf(data: string): DecodedDxf;
