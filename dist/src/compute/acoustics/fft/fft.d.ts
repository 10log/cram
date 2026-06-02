import { Complex } from '../complex';
export type ArrayOfValues = Complex[] | Float32Array | Float64Array | Uint16Array | Uint32Array | Uint8Array | number[];
export declare class FFT {
    private w;
    private bitReversalTable;
    private previousArraySize;
    /**
     * Operates a 2D Cooley-Tukey FFT.
     * @param data
     * @param width
     * @param height
     */
    fft2d(data: Complex[][], width: number, height: number): Complex[][];
    /**
     * Operates a 2D Cooley-Tukey IFFT.
     * @param spectrum
     * @param width
     * @param height
     */
    ifft2d(spectrum: Complex[][], width: number, height: number): Complex[][];
    /**
     * Operates a 1D Cooley-Tukey FFT.
     * @param data
     * @param size
     */
    fft1d(data: Complex[], size: number): Complex[];
    /**
     * Operates a 1D Cooley-Tukey IFFT.
     * @param data
     * @param size
     */
    ifft1d(spectrum: Complex[], size: number): Complex[];
    /**
     * Calculates the power spectrum of the given 2D spectrum and finds the max value.
     * @param spectrum
     * @param width
     * @param height
     */
    power2d(spectrum: Complex[][], width: number, height: number): [number[][], number];
    /**
     * Calculates the power spectrum of the given 1D spectrum and finds the max value.
     * @param spectrum
     * @param size
     */
    power1d(spectrum: Complex[], size: number): [number[], number];
    /**
     * Sorts the given data array depending on the bit reversal table.
     * @param data Data array
     * @param size Array size
     */
    private sortData;
    /**
     * Calculates W factors.
     * @param size Array size (1D)
     */
    private calcFactors;
    /**
     * Creates a bit reversal table of the given array size `size`.
     * @param size Array size
     */
    private createBitReversalTable;
    /**
     * Operates bit reversal to a given number.
     * @param n Number to operate bit reversal
     * @param power Number of bits
     */
    private reverseBits;
    /**
     * Operates log2(n) to the given number `n`.
     * @param n number
     */
    private getExponent2;
    /**
     * Initializes a 2D array with the given size.
     * @param width Number of columns
     * @param height Number of rows
     */
    private init2DArray;
    /**
     * Exponential function.
     * @param arg Argument of e
     */
    private exponential;
    /**
     * Updates previous array size.
     * @param size New array size
     */
    private updateArraySize;
    /**
     * Transposes the given 2D data array.
     * @param data
     * @param width
     * @param height
     */
    private transpose;
    /**
     * Shifts coordinates.
     * @param x
     * @param y
     * @param width
     * @param height
     */
    shift(data: Complex[][], width: number, height: number): Complex[][];
}
