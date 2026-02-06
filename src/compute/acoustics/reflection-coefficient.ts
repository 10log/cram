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

export function reflectionCoefficient(α: number, θ: number) {
  const rootOneMinusAlpha = Math.sqrt(1 - α);
  const ξo = (1 - rootOneMinusAlpha) / (1 + rootOneMinusAlpha);
  const cosθ = Math.abs(Math.cos(θ));
  const ξo_cosθ = ξo * cosθ;
  const R = (ξo_cosθ - 1) / (ξo_cosθ + 1);
  return R**2;
}

export default reflectionCoefficient;


