import { Vector3 } from 'three';
import { BRDF } from './brdf';
import { DirectionalResponse } from './directional-response';
import { Response } from './response';
import { PatchSet } from './patch';
export interface ShootingContext {
    patchSet: PatchSet;
    unshotEnergy: DirectionalResponse[];
    totalEnergy: DirectionalResponse[];
    brdf: BRDF;
    /** Per-patch absorption at the current frequency */
    absorptions: number[];
    /** Per-patch scattering at the current frequency */
    scatterings: number[];
    /** Air absorption coefficient in Nepers/m at the current frequency */
    airAbsNepers: number;
    /** Speed of sound in m/s */
    speedOfSound: number;
    /** Internal sample rate for time discretization */
    sampleRate: number;
    /** Number of rays per shooting iteration */
    raysPerShoot: number;
}
/**
 * Incoming Lambert factor at a hit: max(0, n · −d) for a ray traveling
 * along `rayDir`. Grazing and back-facing patches receive no flux (#120).
 */
export declare function incomingLambert(normal: Vector3, rayDir: Vector3): number;
/**
 * Select the patch with the most unshot energy.
 */
export declare function selectShootingPatch(unshotEnergy: DirectionalResponse[]): number;
/**
 * Compute total unshot energy across all patches.
 */
export declare function totalUnshotEnergy(unshotEnergy: DirectionalResponse[]): number;
/**
 * Shoot energy from a single patch to all visible patches via ray tracing.
 */
export declare function shootFromPatch(ctx: ShootingContext, patchIdx: number): void;
/**
 * Inject source emission into visible patches.
 */
export declare function injectSourceEnergy(sourcePosition: Vector3, initialEnergy: number, ctx: ShootingContext, nRays?: number, rayWeight?: (dir: Vector3) => number): void;
/**
 * Gather energy at a receiver position from all visible patches.
 * Returns a single time-domain response buffer (the impulse response).
 */
export declare function gatherAtReceiver(receiverPosition: Vector3, ctx: ShootingContext): Response;
