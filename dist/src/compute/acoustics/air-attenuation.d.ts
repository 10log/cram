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
