export default class Timer {
    private t1;
    dt: number;
    time: number;
    progress: number;
    length: number;
    onFinish: (...args: unknown[]) => void;
    constructor(length: number, onFinish?: (...args: unknown[]) => void);
    start(): void;
    tick(): number;
}
