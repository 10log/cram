export declare function interpolateLog(x1: number, y1: number, x2: number, y2: number, xi: number): number;
export declare function interpolateLinear(x1: number, y1: number, x2: number, y2: number, xi: number): number;
export type InterpolationTableOptions = {
    xScale?: 'linear' | 'log';
    yScale?: 'linear' | 'log';
};
export declare function scatteringFunction(coef: number): (f: number) => number;
export default scatteringFunction;
