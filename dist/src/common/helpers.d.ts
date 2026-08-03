export type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
export type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
export type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;
export declare function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T>;
export declare function difference<T>(set1: Set<T>, set2: Set<T>): Set<T>;
export declare function union<T>(set1: Set<T>, set2: Set<T>): Set<T>;
export declare const getIndex: (i: string | number) => (x: any) => any;
export declare const ascending: <T extends number | string>(a: T, b: T) => 1 | -1;
export declare const descending: <T extends number | string>(a: T, b: T) => 1 | -1;
export declare const via: (i: string | number) => (fn: Function) => (...args: any[][]) => any;
export declare const applyAt: (i: number) => (fn: Function) => <T>(x: T[]) => any;
export declare const match: (expr: string | RegExp) => (str: string) => RegExpMatchArray | null;
export declare const swap: (a: number, b: number) => <T>(arr: T[]) => T[];
export declare const add: (a: number, b: number) => number;
export declare const subtract: (a: number, b: number) => number;
export declare const multiply: (a: number, b: number) => number;
export declare const divide: (a: number, b: number) => number;
export declare const max: (a: number, b: number) => number;
export declare const min: (a: number, b: number) => number;
export declare const truthy: (x: any) => boolean;
export declare const falsey: (x: any) => boolean;
export declare const maps: {
    length: (x: any[]) => number;
    split: (x: string) => string[];
    splitBy: (expr: string | RegExp) => (x: string) => string[];
    join: (x: any[]) => string;
    joinWith: (str: string) => (x: string[] | number[]) => string;
};
export declare const toIndexed: <T>(x: T, i: number, a: T[]) => [number, T];
export declare const regularExpressions: {
    hexColor: RegExp;
    comma: RegExp;
    digit: RegExp;
    digits: RegExp;
};
export declare function splitEvery(arr: Array<any>, n: number): any;
export declare const multiMap: <T, U, R>(fn: (a: T, b: U) => R) => (a: T[], b: U[]) => R[];
export declare const addArray: (a: number[], b: number[]) => number[];
export declare const subtractArray: (a: number[], b: number[]) => number[];
export declare const multiplyArray: (a: number[], b: number[]) => number[];
export declare const toNumbers: <T extends string | number | boolean>(x: T[]) => number[];
export declare const between: (v: number, a: number, b: number) => boolean;
export declare const unique: (arr: Iterable<any>) => any[];
export declare const diff: (A: any[], B: any[]) => any[][];
export declare const transpose: <T>(array: T[][]) => T[][];
export declare const flipHor: <T>(array: T[][]) => T[][];
export declare const flipVer: <T>(array: T[][]) => T[][];
export declare const rotate: <T>(array: T[][]) => T[][];
export declare const derotate: <T>(array: T[][]) => T[][];
export declare const clamp: (a: number, b: number) => (v: number) => number;
/**
 * modulus operation. wraps a number like so:
 * @example
 * [0, 1, 2, 3, 4, 5].map(n => mod(n, 3))
 * // [0, 1, 2, 0, 1, 2]
 * ```
 *
 * @param n dividend
 * @param m divisor
 */
export declare const mod: (n: number, m: number) => number;
/**
 * reflected modulus operation. instead of wrapping it reflects like so:
 * @example
 * [0, 1, 2, 3, 4, 5].map(n => rmod(n, 3))
 * // [0, 1, 2, 2, 1, 0]
 * ```
 *
 * @param n dividend
 * @param m divisor
 */
export declare const rmod: (n: number, m: number) => number;
export declare const int: (x: number) => number;
export declare const isInteger: (number: unknown) => boolean;
export declare const at: (obj: any, path: string) => any;
export declare const reach: <T>(obj: T, path: Array<string | number>) => unknown;
export declare function derivative(arr: number[]): number[];
export declare const countIf: (condition: {
    (x: any): boolean;
    (arg0: any): any;
}) => (arr: string | any[]) => number;
export declare const makeObject: (fields: [string, any][]) => {};
export interface GraphNode<T> {
    value: T;
    children: Set<GraphNode<T>>;
    parents: Set<GraphNode<T>>;
}
export declare class GraphNode<T> implements GraphNode<T> {
    constructor(value: T);
    addChild(child: T | GraphNode<T>): Set<GraphNode<T>>;
}
export interface Range {
    [0]: number;
    [1]: number;
}
export declare class Range implements Range {
    constructor(min: number, max: number);
    get min(): number;
    set min(m: number);
    get max(): number;
    set max(m: number);
    get delta(): number;
    contains(val: number): boolean;
}
export declare class ClosedRange extends Range {
    contains(val: number): boolean;
}
export declare function getAdjacentIterator(n: number, range: [number, number]): Generator<number[], void, unknown>;
export declare function deepEqual(x: any, y: any): boolean;
export type FromEntries<T> = T extends [PropertyKey, infer V] ? {
    [X in T[0]]?: V;
} : never;
export type Entries<T> = T extends {
    [K in keyof T]: infer V;
} ? [keyof T, V] : never;
export declare const arrayFromAsyncGenerator: <T>(gen: AsyncIterableIterator<T>) => Promise<T[]>;
export declare function zipper<T>(data: Iterable<T>): IterableIterator<[T[], T, T[]]>;
export declare function map<T, U>(data: Iterable<T>, fn: (curr: T) => U): Iterable<U>;
export declare function mapObject<T extends object, U>(obj: T, fn: (val: T[keyof T], key: keyof T, obj: T) => U): U[];
export declare function filteredMapObject<T extends object, U>(obj: T, fn: (val: T[keyof T], key: keyof T, obj: T) => U): U[];
export declare function filterObjectToArray<T extends object>(obj: T, fn: (val: T[keyof T], key: keyof T, obj: T) => boolean): T[keyof T][];
export declare function mapAsync<T, U>(data: AsyncIterable<T>, fn: (curr: T) => Promise<U>): AsyncIterableIterator<U>;
export declare const reduce: <T, U>(data: Iterable<T>, seed: U, fn: (acc: U, curr: T) => U) => U;
export declare const reduceAsync: <T, U>(data: AsyncIterable<T>, seed: U, fn: (acc: U, curr: T) => Promise<U>) => Promise<U>;
export declare const charFrequency: (input: string) => {
    [k: string]: number;
};
export declare const memoize: <P extends any[], R, K extends P[number]>(fn: (...args: P) => R, key: (...args: P) => K) => ((...args: P) => R);
export declare const splitArr: <T>(array: T[], on: T) => [T[], T[]];
type Sliceable = {
    slice: (start?: number, end?: number) => any;
    length: number;
};
export declare const splitAt: <T extends Sliceable>(xs: T, i: number) => [ReturnType<T["slice"]>, ReturnType<T["slice"]>];
export declare const isDefined: <T>(x: T | undefined) => x is T;
export declare const countBy: <T>(data: Iterable<T>, fn: (x: T) => boolean) => number;
export declare const fromEntries: <T extends [PropertyKey, any]>(entries: Iterable<T>) => FromEntries<T>;
/**
 * Adds an item to a set if the set does not already has that item
 * @param set a set of items
 * @param item the item that will be added if it is unique
 */
export declare const addIfUnique: <T>(set: Set<T>) => (item: T) => false | Set<T>;
export type Values<T> = T extends unknown[] ? T[number] : T[keyof T];
export declare const pickProps: <T extends object, K extends keyof T>(props: K[], obj: T) => { [key in K]: T[key]; };
export declare const omit: <T extends object, K extends keyof T>(props: K[], obj: T) => { [key in K]: T[key]; };
export declare const ensureArray: <T>(value: T | T[]) => T[];
export declare const curry: <T extends (...args: unknown[]) => unknown>(func: T) => (this: unknown, ...args: unknown[]) => unknown;
export {};
