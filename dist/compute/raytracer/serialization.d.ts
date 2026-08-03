import { KVP } from '../../common/key-value-pair';
import { RayPath } from './types';
declare function pathsToLinearBufferV1(paths: KVP<RayPath[]>): Float32Array;
declare function linearBufferToPathsV1(linearBuffer: Float32Array): KVP<RayPath[]>;
export declare function pathsToLinearBuffer(paths: KVP<RayPath[]>): Float32Array;
export declare function linearBufferToPaths(linearBuffer: Float32Array): KVP<RayPath[]>;
export { pathsToLinearBufferV1, linearBufferToPathsV1 };
