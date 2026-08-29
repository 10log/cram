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
export declare function pressureReflectionCoefficient(α: number, θ: number): number;
/** Energy reflection R² ∈ [0, 1]. LTP / intensity paths use this. */
export declare function reflectionCoefficient(α: number, θ: number): number;
export default reflectionCoefficient;
