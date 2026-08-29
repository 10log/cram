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

export const REST_PRESSURE = 127.5;
export const REST_VELOCITY = 0;

/** sourcemap.a == 0 → shader overwrites the cell from sourcemap.r/g. */
export const SOURCE_ALPHA = 0;
/** sourcemap.a != 0 → normal interior cell. */
export const FIELD_ALPHA = 1;

/**
 * Display units per unit of Source.value.
 * Amplitude 1 is ~6% of the 127.5 half-range, not half the display.
 */
export const PRESSURE_DISPLAY_SCALE = 8;

export function encodePressure(value: number): number {
  return REST_PRESSURE + value * PRESSURE_DISPLAY_SCALE;
}

export interface FieldPixel {
  pressure: number;
  velocity: number;
  alpha: number;
}

export function restFieldPixel(): FieldPixel {
  return { pressure: REST_PRESSURE, velocity: REST_VELOCITY, alpha: FIELD_ALPHA };
}

export function dirichletSourcePixel(value: number): FieldPixel {
  return {
    pressure: encodePressure(value),
    velocity: REST_VELOCITY,
    alpha: SOURCE_ALPHA,
  };
}

/** Same (pos, vel) as clear() / fillTexture / a never-driven cell. */
export function vacatedSourcePixel(): FieldPixel {
  return restFieldPixel();
}

export function writeFieldPixel(
  pixels: { [i: number]: number },
  index: number,
  pixel: FieldPixel,
) {
  pixels[index + 0] = pixel.pressure;
  pixels[index + 1] = pixel.velocity;
  pixels[index + 3] = pixel.alpha;
}
