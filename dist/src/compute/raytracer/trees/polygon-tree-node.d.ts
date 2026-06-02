type poly = {
    vertices: Float32Array;
    plane: Float32Array;
};
export declare class PolygonTreeNode {
    polygontreenodes: PolygonTreeNode[];
    parent: PolygonTreeNode | null | undefined;
    children: PolygonTreeNode[];
    polygon: poly | null;
    plane: poly;
    front: typeof Node;
    back: typeof Node;
    removed: any;
    constructor(parent?: PolygonTreeNode);
    addPolygons(polygons: any[]): void;
    remove(): void;
    isRemoved(): any;
    isRootNode(): boolean;
    invert(): void;
    getPolygon(): poly;
    getPolygons(result: any[]): void;
    splitByPlane(plane: any, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    _splitByPlane(splane: any, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    addChild(polygon: any): PolygonTreeNode;
    invertSub(): void;
    recursivelyInvalidatePolygon(): void;
    clear(): void;
    toString(): string;
}
export default PolygonTreeNode;
