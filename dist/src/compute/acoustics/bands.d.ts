/**
 * @description Returns the nominal octave band frequencies between a given range (inclusive)
 * @function Octave
 * @param {number} [start] start frequency
 * @param {number} [end] end frequency
 */
export declare function Octave(start: number, end: number): number[];
/**
 * @description Returns the nominal third octave band frequencies between a given range (inclusive)
 * @function ThirdOctave
 * @param {number} [start] start frequency
 * @param {number} [end] end frequency
 */
export declare function ThirdOctave(start?: number, end?: number): number[];
/**
 * @description Returns the lower band limit of a frequency band
 * @function Flower
 * @param {number} k inverse fraction (i.e. third = 3, sixth = 6, etc.)
 * @param {number | number[]} fc center frequency
 */
export declare function Flower(k: number, fc: number | number[]): typeof fc;
/**
 * @description Returns the upper band limit of a frequency band
 * @function Fupper
 * @param {number} k inverse fraction (i.e. third = 3, sixth = 6, etc.)
 * @param {number | number[]} fc center frequency
 */
export declare function Fupper(k: number, fc: number | number[]): typeof fc;
