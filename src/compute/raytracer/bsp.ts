import { Surface } from '../../objects/surface';
// import { splitPolygonByPlane } from './split-polygon';

import { math, geometry, } from '../csg';

// import {PolygonTreeNode} from './trees/polygon-tree-node';
// import {PolygonTreeNode} from './trees/polygon-tree-node';
import {Tree} from './trees/tree';




const plane = math.plane;
const poly3 = geometry.poly3;


export class BSP {
  tree!: Tree;
  constructor() {
    
  }
  construct(surfaces: Surface[]) {
    // const tree = new Node()
    debugger;
    this.tree = new Tree(surfaces.map((x) => x.polygon));
  }
  getPointDistances(p1: { plane: { signedDistanceToPoint: (pos: unknown) => number } }, p2: { vertices: { pos: unknown }[] }) {
    const distances = p2.vertices
      .map((v: { pos: unknown }) => {
        return p1.plane.signedDistanceToPoint(v.pos);
      })
      .filter((x: number) => x);
    return {
      distances,
      willIntersect: !distances.reduce((a: boolean, b: number, i: number, arr: number[]) => a && Math.sign(b) === Math.sign(arr[0]), true)
    }
  }
}

