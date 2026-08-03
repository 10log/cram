export declare class Complex {
    real: number;
    imag: number;
    constructor(params: any);
    /**
     * Conjugates the complex number.
     */
    conjugate(): Complex;
    /**
     * Calculates the absolute value of the complex number;
     */
    absolute(): number;
    /**
     * Swaps the real part and the imaginary part.
     */
    swap(): Complex;
    /**
     * Adds a complex number.
     * @param c Complex number to add
     */
    add(c: Complex): Complex;
    /**
     * Subtracts a complex number.
     * @param c Complex number to subtract
     */
    subtract(c: Complex): Complex;
    /**
     * Multiplies a complex number.
     * @param c Complex number to multiply
     */
    multiply(c: Complex): Complex;
    /**
     * Divides a complex number.
     * @param c Complex number to devide by.
     */
    divide(c: Complex): Complex;
    /**
     * Converts the complex number to a string.
     * @param unit Imaginary unit ('i' or 'j').
     */
    toString(unit?: string): string;
    /**
     * Converts the complex number to an array ([real, imag] format).
     */
    toArray(): [number, number];
    /**
     * Copies the complex number object.
     */
    copy(): Complex;
}
export declare function makeComplexArray(arr: number[]): Complex[];
