import { default as PolygonTreeNode } from './polygon-tree-node';
export declare class Node {
    plane: Float32Array;
    front: Node;
    back: Node;
    parent: Node | undefined;
    polygontreenodes: PolygonTreeNode[];
    constructor(parent?: Node);
    invert(): void;
    clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront: boolean): void;
    clipTo({ rootnode }: {
        rootnode: Node;
    }, alsoRemovecoplanarFront: boolean): void;
    addPolygonTreeNodes(newpolygontreenodes: PolygonTreeNode[]): void;
}
export default Node;
