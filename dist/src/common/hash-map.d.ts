export declare class HashMap<T extends object> {
    private map;
    constructor(values?: T[]);
    get: (key: string) => T | undefined;
    keys: () => MapIterator<string>;
    values: () => MapIterator<T>;
    entries: () => MapIterator<[string, T]>;
    forEach: (callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any) => void;
    add(value: T): void;
    clear(): void;
    delete(value: T): void;
    has(value: T): void;
    get size(): number;
}
export default HashMap;
