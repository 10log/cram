/**
 * Heightmap / sourcemap encoding for the 2D FDTD field.
 *
 * ## The field rests at zero (#224)
 *
 * Pressure and velocity rest at 0 in the simulation state (clear.frag,
 * fillTexture, wall cells). The water demo's 127.5 offset used to live in the
 * state. A rigid room's Laplacian has a constant null vector, so that offset
 * *was* the DC mode, and every float32 rounding at 127.5 (ULP ≈ 7.6e-6) went
 * into a mode with no restoring force: over 10⁶ steps the mean drifted by
 * more than 100 display units. The offset now lives only in the display,
 * where the render shaders centre on {@link DISPLAY_HALF_RANGE}.
 *
 * ## Sources are soft and differentiated (#224)
 *
 * A source cell is no longer overwritten (Dirichlet). A hard source
 * scattered every wave that reached its cell, and could inject DC. It now
 * adds a forcing to the cell's velocity, inside the update and before the
 * centred wall divide, the same place as the CPU mirror's `stepField`
 * `source`. The forcing is the *difference* of the source signal,
 * `SOURCE_FORCING_SCALE · (xⁿ − xⁿ⁻¹)`, which carries no DC. The room's
 * mean pressure then follows the running sum of the signal itself, not of
 * its running sum: a tone leaves it where it was, and a single pulse moves it
 * once and leaves it there. Forcing with the signal as it is would pump the
 * mean by the running sum of that, which is what a hard source's injected DC
 * amounted to. Only a signal whose own long-term mean is not zero (a
 * unipolar pulse *train*) still moves it steadily. Recordings integrate the
 * difference back out and cut below 10 Hz (`recording.ts`,
 * `integrateAndHighpass`).
 *
 * Moving or removing a source needs no rest-state bookkeeping: the vacated
 * cell simply stops being forced.
 */
export declare const REST_PRESSURE = 0;
export declare const REST_VELOCITY = 0;
/**
 * The display's half range. The render and read-out shaders used to subtract
 * it from the state; they now read the state as zero-centred and scale by it.
 */
export declare const DISPLAY_HALF_RANGE = 127.5;
/** Every cell's sourcemap alpha. There is no Dirichlet source any more (#224). */
export declare const FIELD_ALPHA = 1;
/**
 * Velocity forcing, in display units, per unit change in Source.value. (It
 * was PRESSURE_DISPLAY_SCALE when a hard source wrote a displayed pressure.)
 */
export declare const SOURCE_FORCING_SCALE = 8;
export interface FieldPixel {
    /** Additive velocity forcing for this cell (sourcemap.r). */
    forcing: number;
    alpha: number;
}
/** A cell with no source: no forcing. */
export declare function restFieldPixel(): FieldPixel;
/**
 * A soft source's cell this step, forced by the change in its signal,
 * `delta = xⁿ − xⁿ⁻¹` (Source.velocity).
 */
export declare function softSourcePixel(delta: number): FieldPixel;
/** A cell a source has left: simply unforced. */
export declare function vacatedSourcePixel(): FieldPixel;
/** Writes the forcing (r) and alpha (a); leaves g and the wall channel (b) alone. */
export declare function writeFieldPixel(pixels: {
    [i: number]: number;
}, index: number, pixel: FieldPixel): void;
