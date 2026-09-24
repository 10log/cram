import { Axis, ActiveAxes } from './partition';
import { PmlPartition } from './pml-partition';
/** Normal-incidence pressure reflection magnitude for an absorption coefficient. */
export declare function reflectionMagnitude(alpha: number): number;
/** The inverse: absorbed energy fraction for a pressure reflection magnitude. */
export declare function absorptionFromReflection(r: number): number;
export interface WallCalibration {
    /** PML thickness in cells. */
    thickness: number;
    /** Grading exponent of the sigma profile. */
    gradingExponent: number;
    /** Courant number `c·dt/dx` the layer will run at. */
    courant: number;
}
/**
 * Measure the normal-incidence reflection of a PML slab, in 1D.
 *
 * A pulse starts in the middle of a rigid-walled partition and splits. The
 * right-going half reaches the slab, partially reflects, and returns past a
 * probe; the left-going half reflects off the rigid wall and arrives much later.
 * The geometry below keeps those two arrivals separated, with room for the
 * round trip through the slab itself — a thick, weakly-damped slab echoes late,
 * and a window that closes too early reports it as perfectly absorbing.
 *
 * `sigmaHat` is the peak damping in units of `c/dx`, so the result depends only
 * on the shape of the problem and not on the grid scale.
 */
export declare function measureNormalIncidenceReflection(sigmaHat: number, calibration?: WallCalibration): number;
export interface CalibrationCurve {
    calibration: WallCalibration;
    /** Damping samples in units of `c/dx`, ascending, on the falling branch. */
    sigmaHat: Float64Array;
    /** Measured reflection magnitude at each sample, descending. */
    reflection: Float64Array;
    /** Lowest reflection the layer can produce. */
    minReflection: number;
    /** Highest absorption coefficient the layer can realize. */
    maxAbsorption: number;
}
/**
 * Build (and memoize) the falling branch of the `|R|(σ̂)` curve.
 *
 * Walks damping upward until the reflection stops improving, which is where the
 * branch ends. Roughly a dozen 1D runs, once per distinct calibration.
 */
export declare function calibrationCurve(calibration?: WallCalibration): CalibrationCurve;
/** Discard memoized curves. Only useful in tests. */
export declare function clearCalibrationCache(): void;
/**
 * Damping (in units of `c/dx`) that produces a target reflection magnitude.
 *
 * Interpolates the falling branch linearly in `σ̂` against `log|R|`, which is
 * where the curve is closest to straight. Throws if the target is below what
 * the layer can reach — a silent clamp would hand back a wall quietly more
 * reflective than the material it is standing in for.
 */
export declare function dampingForReflection(targetR: number, calibration?: WallCalibration): number;
/** Damping (in units of `c/dx`) that realizes an absorption coefficient. */
export declare function dampingForAbsorption(alpha: number, calibration?: WallCalibration): number;
/**
 * Build a PML slab that terminates one face of a partition box with a surface of
 * the given absorption coefficient.
 */
export declare function createWall(options: {
    /** The box being terminated, in global cell coordinates. */
    box: {
        x: number;
        y: number;
        z: number;
        w: number;
        h: number;
        d: number;
    };
    axis: Axis;
    /** Which face — the box's high edge on `axis`, or its low edge. */
    high: boolean;
    alpha: number;
    dx: number;
    c: number;
    dt: number;
    thickness?: number;
    gradingExponent?: number;
    /** The grid's axes — see `PartitionParams.activeAxes`. Defaults to the slab's own. */
    activeAxes?: ActiveAxes;
}): PmlPartition;
