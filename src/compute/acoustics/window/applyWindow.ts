import WindowFunctions from './window-functions';
import { Complex } from '../complex';

type WindowFunctionName = keyof typeof WindowFunctions;

export const applyWindow = (window: WindowFunctionName) => (arr: number[]) => {
  if (WindowFunctions[window]) {
    return WindowFunctions[window](arr.length).map(
      (x: number, i: number) => arr[i] * x
    );
  } else throw new Error(`'${window}' does not exist`);
};

export const applyWindowComplex = (window: WindowFunctionName) => (arr: Complex[]) => {
  if (WindowFunctions[window]) {
    return WindowFunctions[window](arr.length).map(
      (x: number, i: number) =>
        new Complex({ real: arr[i].real * x, imag: arr[i].imag })
    );
  } else throw new Error(`'${window}' does not exist`);
};
