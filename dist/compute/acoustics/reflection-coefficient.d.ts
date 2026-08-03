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
export declare function reflectionCoefficient(α: number, θ: number): number;
export default reflectionCoefficient;
