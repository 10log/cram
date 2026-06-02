export declare function normalize<T extends ArrayLike<number> & {
    [index: number]: number;
}>(arr: T): T;
