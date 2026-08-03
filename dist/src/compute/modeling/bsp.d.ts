/**
 * BSP Tree implementation for @jscad/modeling v2
 * Used for raytracing and spatial partitioning
 */
/**
 * Split a line segment by a plane
 * Robust splitting, even if the line is parallel to the plane
 * @return {vec3} a new point at the intersection
 */
export declare const splitLineSegmentByPlane: (planeVal: number[], p1: number[], p2: number[]) => number[];
/**
 * Split a polygon by a plane
 * Returns object:
 * .type:
 *   0: coplanar-front
 *   1: coplanar-back
 *   2: front
 *   3: back
 *   4: spanning
 * In case the polygon is spanning, also returns:
 * .front: a Polygon of the front part
 * .back: a Polygon of the back part
 */
export declare const splitPolygonByPlane: (splane: number[], polygon: any) => {
    type: number;
    front: any;
    back: any;
};
/**
 * PolygonTreeNode manages hierarchical splits of polygons
 * At the top is a root node which doesn't hold a polygon, only child PolygonTreeNodes
 * Below that are zero or more 'top' nodes; each holds a polygon.
 */
export declare class PolygonTreeNode {
    parent: PolygonTreeNode | null;
    children: PolygonTreeNode[];
    polygon: any;
    removed: boolean;
    constructor();
    /**
     * Fill the tree with polygons. Should be called on the root node only.
     */
    addPolygons(polygons: any[]): void;
    /**
     * Remove a node from the tree
     */
    remove(): void;
    isRemoved(): boolean;
    isRootNode(): boolean;
    /**
     * Invert all polygons in the tree. Call on the root node.
     */
    invert(): void;
    getPolygon(): any;
    /**
     * Get all polygons from the tree
     */
    getPolygons(result: any[]): void;
    /**
     * Split the node by a plane
     */
    splitByPlane(planeVal: number[], coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    /**
     * Internal split implementation for nodes with no children
     */
    _splitByPlane(splane: number[], coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    /**
     * Add a child node with a polygon
     */
    addChild(polygon: any): PolygonTreeNode;
    /**
     * Internal recursive invert
     */
    private invertSub;
    /**
     * Invalidate polygon up the tree
     */
    private recursivelyInvalidatePolygon;
    /**
     * Clear the tree
     */
    clear(): void;
}
/**
 * Node holds a node in a BSP tree.
 * A BSP tree is built from a collection of polygons by picking a polygon to split along.
 */
export declare class Node {
    plane: number[] | null;
    front: Node | null;
    back: Node | null;
    polygontreenodes: PolygonTreeNode[];
    parent: Node | null;
    constructor(parent: Node | null);
    /**
     * Convert solid space to empty space and vice versa
     */
    invert(): void;
    /**
     * Clip polygon tree nodes to this plane
     */
    clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront: boolean): void;
    /**
     * Remove all polygons in this BSP tree that are inside the other BSP tree
     */
    clipTo(tree: Tree, alsoRemovecoplanarFront: boolean): void;
    /**
     * Add polygon tree nodes to this BSP tree
     */
    addPolygonTreeNodes(newpolygontreenodes: PolygonTreeNode[]): void;
    /**
     * Get parent plane normals up to maxdepth
     */
    getParentPlaneNormals(normals: number[][], maxdepth: number): void;
}
/**
 * Tree is the root of a BSP tree.
 * This separate class holds the PolygonTreeNode root.
 */
export declare class Tree {
    polygonTree: PolygonTreeNode;
    rootnode: Node;
    constructor(polygons?: any[]);
    /**
     * Invert the tree
     */
    invert(): void;
    /**
     * Remove all polygons inside the other tree
     */
    clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean): void;
    /**
     * Get all polygons from the tree
     */
    allPolygons(): any[];
    /**
     * Add polygons to the tree
     */
    addPolygons(polygons: any[]): void;
}
declare const _default: {
    Tree: typeof Tree;
    PolygonTreeNode: typeof PolygonTreeNode;
    Node: typeof Node;
    splitPolygonByPlane: (splane: number[], polygon: any) => {
        type: number;
        front: any;
        back: any;
    };
    splitLineSegmentByPlane: (planeVal: number[], p1: number[], p2: number[]) => number[];
};
export default _default;
