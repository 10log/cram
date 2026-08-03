export type IntervalFunctionArgs = {
    time: number;
    count: number;
};
export declare function repeatWhile(fn: (args: IntervalFunctionArgs) => boolean, frequency: number): number;
