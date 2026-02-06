/**
 * Compute the stable time step for the 2D FDTD wave equation.
 *
 * The 2D CFL condition requires C = c·dt/dx ≤ 1/√2.
 * Setting dt = dx / (c·√2) gives C = 1/√2 exactly (maximally stable).
 */
export function computeTimestep(cellSize: number, waveSpeed: number): number {
  return cellSize / (waveSpeed * Math.SQRT2);
}
