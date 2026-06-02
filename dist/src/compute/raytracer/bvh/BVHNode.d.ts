export declare class BVHNode {
    extentsMin: XYZ;
    extentsMax: XYZ;
    startIndex: number;
    endIndex: number;
    level: number;
    node0: BVHNode | null;
    node1: BVHNode | null;
    constructor(extentsMin: XYZ, extentsMax: XYZ, startIndex: number, endIndex: number, level: number);
    static fromObj({ extentsMin, extentsMax, startIndex, endIndex, level, node0, node1 }: any): BVHNode;
    elementCount(): number;
    centerX(): number;
    centerY(): number;
    centerZ(): number;
    clearShapes(): void;
    get children(): (BVHNode | null)[];
}
