/**
 *
 * @param {number[]} frequency  frequency in Hz
 * @param {number} temperature temperature in °C (20°C)
 * @param {number} humidity relative humidity in % (40%)
 * @param {number} pressure atmospheric pressure in Pa (101325 Pa)
 * @returns {number[]} db per m attenuation
 * @see http://en.wikibooks.org/wiki/Engineering_Acoustics/Outdoor_Sound_Propagation
 */
export declare function airAttenuation(frequency: number[], temperature?: number, humidity?: number, pressure?: number): number[];
/**
 * `airAttenuation` is dB/m of SPL (20 log₁₀). Intensity / energy uses
 * 10 log₁₀, so the energy factor over distance r is 10^(-α_dB · r / 10).
 */
export declare function airAttenuationEnergy(airAbsDbPerMeter: number, distance: number): number;
/** Nepers/m for energy so that exp(-n · r) = airAttenuationEnergy(α_dB, r). */
export declare function airAbsDbToEnergyNepers(airAbsDbPerMeter: number): number;
/**
 * Nepers/m for **pressure amplitude**, so that `exp(-n · r)` is the amplitude
 * factor over distance `r` — half the energy figure above.
 *
 * Wave solvers carry pressure, not energy, so they need this one. Using the
 * energy nepers on a pressure field attenuates twice as fast in dB as the
 * standard says, which reads as a plausible but short reverberation time.
 */
export declare function airAbsDbToPressureNepers(airAbsDbPerMeter: number): number;
