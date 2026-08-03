import { ArrayLike } from './array-like';
export interface LinearRegressionResult {
    m: number;
    b: number;
    fx: (x: number) => number;
    fy: (y: number) => number;
}
export declare function linearRegression(xs: ArrayLike, ys: ArrayLike): LinearRegressionResult;
export default linearRegression;
