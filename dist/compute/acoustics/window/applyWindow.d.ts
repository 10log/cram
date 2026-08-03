import { default as WindowFunctions } from './window-functions';
import { Complex } from '../complex';
type WindowFunctionName = keyof typeof WindowFunctions;
export declare const applyWindow: (window: WindowFunctionName) => (arr: number[]) => number[];
export declare const applyWindowComplex: (window: WindowFunctionName) => (arr: Complex[]) => Complex[];
export {};
