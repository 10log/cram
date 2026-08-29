/**
 * Heightmap / sourcemap rest state for the 0–255 water-demo encoding.
 *
 * Field rest (clear.frag, fillTexture, wall cells):
 *   pressure = 127.5, velocity = 0
 *
 * A Dirichlet source must write that same rest when it leaves a cell.
 * Writing pressure = 0 is a full-scale negative impulse (~ −127.5).
 *
 * Velocity on a hard source is not Source.velocity (a forward difference
 * of pressure). Keep the source cell at rest velocity so a move/remove
 * does not dump ~127 into the wave update.
 */
export declare const REST_PRESSURE = 127.5;
export declare const REST_VELOCITY = 0;
/** sourcemap.a == 0 → shader overwrites the cell from sourcemap.r/g. */
export declare const SOURCE_ALPHA = 0;
/** sourcemap.a != 0 → normal interior cell. */
export declare const FIELD_ALPHA = 1;
/**
 * Display units per unit of Source.value.
 * Amplitude 1 is ~6% of the 127.5 half-range, not half the display.
 */
export declare const PRESSURE_DISPLAY_SCALE = 8;
export declare function encodePressure(value: number): number;
export interface FieldPixel {
    pressure: number;
    velocity: number;
    alpha: number;
}
export declare function restFieldPixel(): FieldPixel;
export declare function dirichletSourcePixel(value: number): FieldPixel;
/** Same (pos, vel) as clear() / fillTexture / a never-driven cell. */
export declare function vacatedSourcePixel(): FieldPixel;
export declare function writeFieldPixel(pixels: {
    [i: number]: number;
}, index: number, pixel: FieldPixel): void;
