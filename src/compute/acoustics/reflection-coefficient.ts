/**
 * Calcualtes the *reflection coefficient* **R**
 * of a surface with *absorption coefficient* **α**
 * at an *angle* **θ**
 *
 * @export
 * @param {number} α absorption coefficient **α ∈ [0,1]**
 * @param {number} θ angle of incidence **θ ∈ [0,π/2]**
 * @returns {number} R reflection coefficient **R ∈ [0,1]**
 */

/** Signed pressure R. Hard wall (α = 0) → R = −1 in this locally-reacting model. */
export function pressureReflectionCoefficient(α: number, θ: number): number {
  const rootOneMinusAlpha = Math.sqrt(Math.max(0, 1 - α));
  const ξo = (1 - rootOneMinusAlpha) / (1 + rootOneMinusAlpha);
  const cosθ = Math.abs(Math.cos(θ));
  const ξo_cosθ = ξo * cosθ;
  return (ξo_cosθ - 1) / (ξo_cosθ + 1);
}

/** Energy reflection R² ∈ [0, 1]. LTP / intensity paths use this. */
export function reflectionCoefficient(α: number, θ: number) {
  const R = pressureReflectionCoefficient(α, θ);
  return R * R;
}

export default reflectionCoefficient;


