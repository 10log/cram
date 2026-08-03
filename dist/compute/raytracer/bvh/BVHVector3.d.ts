export declare class BVHVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    copy(v: BVHVector3): this;
    setFromArray(array: Float32Array, firstElementPos: number): void;
    setFromArrayNoOffset(array: number[]): void;
    setFromArgs(a: number, b: number, c: number): void;
    add(v: BVHVector3): this;
    multiplyScalar(scalar: number): this;
    subVectors(a: BVHVector3, b: BVHVector3): this;
    dot(v: BVHVector3): number;
    cross(v: BVHVector3): this;
    crossVectors(a: BVHVector3, b: BVHVector3): this;
    clone(): BVHVector3;
    static fromAny(potentialVector: any): BVHVector3;
}
