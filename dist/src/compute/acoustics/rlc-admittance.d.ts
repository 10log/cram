import { Dimensions } from './random-incidence';
/** One series-RLC branch of a normalised admittance. */
export interface RlcBranch {
    /** Normalised inductance (mass), seconds. */
    D: number;
    /** Normalised resistance, dimensionless. */
    E: number;
    /** Normalised elastance (spring), 1/seconds. */
    F: number;
}
/** A complex number as `[re, im]`. */
export type Complex = [number, number];
/** Specific admittance `Y(ω)` of a set of branches, at frequency `f` in Hz. */
export declare function branchAdmittance(branches: readonly RlcBranch[], f: number): Complex;
/** Specific impedance `ζ = 1/Y`, or `null` where the admittance is zero (rigid). */
export declare function branchImpedance(branches: readonly RlcBranch[], f: number): Complex | null;
/**
 * Diffuse-field absorption of a locally-reacting surface of complex specific
 * impedance `ζ`, in a 2D or 3D field. This is the complex generalisation of
 * `randomIncidenceAbsorption` in `random-incidence.ts`, and agrees with it for
 * real `ζ`.
 *
 * `1 − |R(θ)|² = 4·Re(ζ)·cosθ / |ζ·cosθ + 1|²`, averaged over a hemisphere
 * weighted by `2·sinθ·cosθ` (3D) or a half-plane weighted by `cosθ` (2D).
 */
export declare function complexRandomIncidenceAbsorption(zeta: Complex, dims: Dimensions): number;
/** Diffuse-field absorption of a set of branches at frequency `f`. Rigid is 0. */
export declare function branchAbsorption(branches: readonly RlcBranch[], f: number, dims: Dimensions): number;
/**
 * A model's absorption over the octave band centred on `fc`: the mean of
 * {@link branchAbsorption} at {@link BAND_SAMPLES} log-spaced frequencies
 * from `fc/√2` to `fc·√2`. That is what an octave-band filter of a decay
 * sees, near enough.
 */
export declare function bandAbsorption(branches: readonly RlcBranch[], fc: number, dims: Dimensions): number;
/** PFFDTD's resonant branch: peak admittance `Ŷ` at `f0`, half-power bandwidth `ω₀/√2`. */
export declare function resonantBranch(peakAdmittance: number, f0: number, relativeBandwidth?: number): RlcBranch;
/**
 * A shelving branch: flat admittance `Ŷ` on one side of a corner, rolling
 * off on the other. `'low'` is a mass and a resistance (`F = 0`), flat below
 * `fc`. `'high'` is a spring and a resistance (`D = 0`), flat above `fc`. The
 * fitter puts these at the two outermost bands, where a resonant branch
 * would leave the outer half of its band unsupported.
 */
export declare function shelfBranch(peakAdmittance: number, fc: number, side: 'low' | 'high'): RlcBranch;
export interface RlcFit {
    /** One branch per band with a non-zero target, in band order. */
    branches: RlcBranch[];
    /** Band centres, as given. */
    bands: number[];
    /** The target per band, after clamping to what a locally-reacting wall can do. */
    target: number[];
    /** The fitted model's {@link bandAbsorption} per band. */
    fitted: number[];
    /** Largest `|fitted − target|` over the bands. */
    maxError: number;
    iterations: number;
}
export interface FitOptions {
    dims: Dimensions;
    /** Each branch's half-power bandwidth over its centre frequency. PFFDTD's is 1/√2. */
    relativeBandwidth?: number;
    /** Stop once every band is within this of its target. */
    tolerance?: number;
    maxIterations?: number;
}
/**
 * Fit branches to octave-band random-incidence absorption (#222).
 *
 * `absorption[i]` is the Sabine coefficient of the band centred on
 * `bands[i]` Hz. Coefficients above the locally-reacting limit
 * (`maxRandomIncidenceAbsorption`) are fitted to the limit. A band at zero
 * gets no branch, so a fully rigid material has none and is the rigid wall.
 *
 * Gauss–Seidel over the bands. Each band's `Ŷ` is solved in one dimension
 * with the others held, and the sweeps repeat until every band is within
 * `tolerance`. A band's absorption rises with its own `Ŷ` to a peak and then
 * falls, and both sides can reach the same value. The solve takes the
 * **stiff** side, as every inversion in this repository does:
 *
 * 1. Golden-section search for the `Ŷ` that maximises the band's absorption.
 * 2. If the target is at or above that maximum, which chamber data at the
 *    locally-reacting limit often is, the band takes the maximum.
 * 3. Otherwise, bisect below it, where absorption is increasing.
 *
 * A fixed-point update on `Ŷ` was tried first. It walks past the peak when
 * neighbouring branches overlap, and there it runs away to zero absorption.
 */
export declare function fitRlcToOctaveBands(bands: readonly number[], absorption: readonly number[], options: FitOptions): RlcFit;
