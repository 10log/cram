type Destructor = () => void;
type Watcher<T> = (value: T, previousValue: T) => void;
export declare class Observable<T = any> {
    private v;
    constructor(v: T);
    private watchers;
    get value(): T;
    set value(value: T);
    watch(callback: Watcher<T>): Destructor;
    toJSON(): string;
    toString(): string;
}
export default function observe<T = any>(value: T, watchers?: Watcher<T>[] | Watcher<T>): Observable<T>;
export {};
