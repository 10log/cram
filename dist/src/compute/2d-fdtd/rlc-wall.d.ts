import { RlcBranch } from '../acoustics/rlc-admittance';
/** One material's branches, discretised for a time step. */
export interface RlcCoefficients {
    count: number;
    /** `1/(2Ď + E + ½Ḟ)` per branch. */
    b: Float64Array;
    /** `b·(2Ď − E − ½Ḟ)` per branch. */
    bd: Float64Array;
    /** `b·Ď` per branch. */
    bDh: Float64Array;
    /** `b·Ḟ` per branch. */
    bFh: Float64Array;
    /** `Σ b`. */
    beta: number;
    /** `Ď`, `E`, `Ḟ` per branch, for the energy. */
    Dh: Float64Array;
    E: Float64Array;
    Fh: Float64Array;
}
/**
 * Discretise a material's branches for time step `dt` (seconds). Refuses
 * a negative or non-finite coefficient, or a branch with all three at zero:
 * those are not passive branches, and the energy argument needs them to be.
 */
export declare function discretizeRlc(branches: readonly RlcBranch[], dt: number): RlcCoefficients;
/**
 * RLC walls on a {@link Field2D}. A wall cell whose `wallMaterial` is ≥ 0 is
 * an RLC wall of that material, and its `channel` gain is ignored. Branch
 * state is per air cell, `branches` slots each.
 */
export interface RlcFieldState {
    materials: RlcCoefficients[];
    /** Per cell: RLC material index of a wall cell, −1 otherwise. */
    wallMaterial: Int32Array;
    /** Branch slots per cell: the most any material has. */
    branches: number;
    /** `y^{n+½}` per cell and branch, after a step. */
    velocity: Float64Array;
    /** `g^{n+½}` per cell and branch, after a step. */
    integral: Float64Array;
}
export declare function createRlcFieldState(size: number, materials: RlcCoefficients[]): RlcFieldState;
/**
 * Branch-state textures on the GPU (#222): two branches each, so up to
 * `2·RLC_TEXTURES` branches per material. The fitter gives one per octave
 * band, and the material database has eight.
 */
export declare const RLC_TEXTURES = 4;
export declare const RLC_MAX_BRANCHES: number;
/**
 * The RLC materials a solver's walls use, each once. It hands out the index a
 * wall writes into the wallmap, and packs the coefficient texture the shaders
 * read.
 */
export declare class RlcMaterialTable {
    private readonly entries;
    /** Index of a material, adding it the first time it is seen. */
    indexFor(branches: readonly RlcBranch[]): number;
    get size(): number;
    /** Materials in index order, discretised for `dt`: the CPU mirror's `materials`. */
    coefficients(dt: number): RlcCoefficients[];
    /**
     * RGBA texels `(b, bd, bDh, bFh)`, `RLC_MAX_BRANCHES` wide and one row per
     * material (at least one row, so the texture is never empty). Unused
     * branch slots are zero, which the shaders read as no branch.
     */
    texels(dt: number): Float32Array;
}
/** The wallmap's blue channel for a wall: its RLC material index plus one, or 0 for none. */
export declare function rlcWallmapChannel(material: number | null | undefined): number;
