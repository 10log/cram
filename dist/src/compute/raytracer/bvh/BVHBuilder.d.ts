import { BVH } from './BVH';
declare global {
    interface XYZ {
        0: number;
        1: number;
        2: number;
    }
    interface Vector {
        x: number;
        y: number;
        z: number;
    }
    type Evaluator = () => number;
    type Work = () => void;
    type WorkProgress = {
        nodesSplit: number;
    };
    type WorkProgressCallback = (progressObj: WorkProgress) => void;
    type BVHProgress = {
        nodesSplit: number;
        trianglesLeafed: number;
    };
    type AsyncifyParams = {
        ms?: number;
        steps?: number;
    };
}
export declare function BVHBuilder(triangles: unknown | Vector[][] | number[] | Float32Array, maxTrianglesPerNode?: number): BVH;
export declare function BVHBuilderAsync(triangles: unknown | Vector[][] | number[] | Float32Array, maxTrianglesPerNode?: number, asyncParams?: AsyncifyParams, progressCallback?: (obj: BVHProgress) => void): Promise<BVH>;
