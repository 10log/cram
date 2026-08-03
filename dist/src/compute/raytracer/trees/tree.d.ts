import { Node } from './node';
import { PolygonTreeNode } from './polygon-tree-node';
export declare class Tree {
    polygonTree: PolygonTreeNode;
    rootnode: Node;
    constructor(polygons: any[]);
    invert(): void;
    clipTo(tree: Tree, alsoRemovecoplanarFront: boolean): void;
    allPolygons(): any[];
    addPolygons(polygons: any[]): void;
    clear(): void;
    toString(): string;
}
export default Tree;
