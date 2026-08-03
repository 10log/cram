export declare function transform(real: Array<number> | Float32Array, imag: Array<number> | Float32Array): void;
export declare function inverseTransform(real: Array<number> | Float32Array, imag: Array<number> | Float32Array): void;
export declare function transformRadix2(real: Array<number> | Float32Array, imag: Array<number> | Float32Array): void;
export declare function transformBluestein(real: Array<number> | Float32Array, imag: Array<number> | Float32Array): void;
export declare function convolveReal(x: Array<number> | Float32Array, y: Array<number> | Float32Array, out: Array<number> | Float32Array): void;
export declare function convolveComplex(xreal: Array<number> | Float32Array, ximag: Array<number> | Float32Array, yreal: Array<number> | Float32Array, yimag: Array<number> | Float32Array, outreal: Array<number> | Float32Array, outimag: Array<number> | Float32Array): void;
export declare function newArrayOfZeros(n: number): Array<number>;
