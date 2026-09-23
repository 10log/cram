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
 * Along-normal offset for a ray leaving a patch, in metres.
 *
 * A barycentric sample sits exactly **on** the triangle plane, so a ray leaving
 * it starts coplanar with its own surface, and the other triangles of the same
 * wall sit at distance ~0 from that origin. Issue #120 read that as a leak and
 * #207 repeated it; **measurement refuted it.** `localToWorld` maps every
 * sampled direction into the patch normal's hemisphere, so a ray cannot turn
 * back into its own plane and a coplanar sibling receives exactly 0 either way
 * — with this offset and without it. The measured T30 and its Eyring ratio do
 * not move.
 *
 * It is kept as a guard for the geometry where the hazard is real: a sample
 * near a shared edge with a *non*-coplanar neighbour, which genuinely does sit
 * at ~0 distance and is not protected by the hemisphere argument. A guard, not
 * a fix — see `physics.spec.ts` for the measurement.
 *
 * 1e-4 m: far above the float noise on a room-scale coordinate, far below any
 * geometric feature a room model has.
 */
export declare const RAY_ORIGIN_EPSILON = 0.0001;
/**
 * Slack in the gather's occlusion test, in metres.
 *
 * A hit counts as blocking only if it is meaningfully nearer than the receiver.
 * This was 1 cm, which #120 called out as a fudge standing in for the missing
 * origin offset — and it could not do that job anyway, since a sibling triangle
 * registers at ~0 distance and 0 < dist − 0.01 for any receiver beyond a
 * centimetre, so the patch read as occluded. With the origin lifted off the
 * plane the slack only has to cover float noise.
 */
export declare const OCCLUSION_EPSILON = 0.0001;
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
