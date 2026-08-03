import { Complex } from '../complex';
import { WindowFunction } from '../window/window-functions';
export interface fftoptions {
    buffersize?: number;
    dim?: number;
    absolute?: boolean;
    window?: WindowFunction;
}
export declare function fft(values: number[] | Complex[] | Float32Array, opts?: fftoptions): Complex[][];
