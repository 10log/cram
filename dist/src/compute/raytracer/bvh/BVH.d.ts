import { BVHVector3 } from './BVHVector3';
import { BVHNode } from './BVHNode';
export declare class BVH {
    rootNode: BVHNode;
    bboxArray: Float32Array;
    trianglesArray: Float32Array;
    constructor(rootNode: BVHNode, boundingBoxArray: Float32Array, triangleArray: Float32Array);
    intersectRay(rayOrigin: any, rayDirection: any, backfaceCulling?: boolean): any[];
    static calcTValues(minVal: number, maxVal: number, rayOriginCoord: number, invdir: number): number[];
    static intersectNodeBox(rayOrigin: BVHVector3, invRayDirection: BVHVector3, node: BVHNode): boolean;
    static intersectRayTriangle(a: BVHVector3, b: BVHVector3, c: BVHVector3, rayOrigin: BVHVector3, rayDirection: BVHVector3, backfaceCulling: boolean): BVHVector3 | null;
}
