//@ts-nocheck
/**
 * BSP Tree implementation for @jscad/modeling v2
 * Used for raytracing and spatial partitioning
 */

import { math, geometry } from './v2';

const { plane, vec3 } = math;
const { poly3 } = geometry;

// Epsilon constant for floating point comparisons
const EPS = 1e-5;

/**
 * Split a line segment by a plane
 * Robust splitting, even if the line is parallel to the plane
 * @return {vec3} a new point at the intersection
 */
export const splitLineSegmentByPlane = (planeVal: number[], p1: number[], p2: number[]): number[] => {
  const direction = vec3.subtract(vec3.create(), p2, p1);
  let lambda = (planeVal[3] - vec3.dot(planeVal, p1)) / vec3.dot(planeVal, direction);
  if (Number.isNaN(lambda)) lambda = 0;
  if (lambda > 1) lambda = 1;
  if (lambda < 0) lambda = 0;

  const result = vec3.create();
  vec3.scale(result, direction, lambda);
  vec3.add(result, result, p1);
  return result;
};

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
export const splitPolygonByPlane = (splane: number[], polygon: any) => {
  const result = {
    type: 0,
    front: null as any,
    back: null as any,
  };

  // Get vertices from polygon (V2 format)
  const vertices = polygon.vertices || poly3.toVertices(polygon);
  const numvertices = vertices.length;

  // Get the polygon's plane
  const polygonPlane = polygon.plane || (vertices.length >= 3
    ? plane.fromPoints(plane.create(), vertices[0], vertices[1], vertices[2])
    : plane.create());

  if (plane.equals(polygonPlane, splane)) {
    result.type = 0;
  } else {
    let hasfront = false;
    let hasback = false;
    const vertexIsBack: boolean[] = [];
    const MINEPS = -EPS;

    for (let i = 0; i < numvertices; i++) {
      const t = vec3.dot(splane, vertices[i]) - splane[3];
      const isback = t < 0;
      vertexIsBack.push(isback);
      if (t > EPS) hasfront = true;
      if (t < MINEPS) hasback = true;
    }

    if (!hasfront && !hasback) {
      // all points coplanar
      const t = vec3.dot(splane, polygonPlane);
      result.type = t >= 0 ? 0 : 1;
    } else if (!hasback) {
      result.type = 2;
    } else if (!hasfront) {
      result.type = 3;
    } else {
      // spanning
      result.type = 4;
      const frontvertices: number[][] = [];
      const backvertices: number[][] = [];
      let isback = vertexIsBack[0];

      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        const vertex = vertices[vertexindex];
        let nextvertexindex = vertexindex + 1;
        if (nextvertexindex >= numvertices) nextvertexindex = 0;
        const nextisback = vertexIsBack[nextvertexindex];

        if (isback === nextisback) {
          // line segment is on one side of the plane
          if (isback) {
            backvertices.push(vertex);
          } else {
            frontvertices.push(vertex);
          }
        } else {
          // line segment intersects plane
          const point = vertex;
          const nextpoint = vertices[nextvertexindex];
          const intersectionpoint = splitLineSegmentByPlane(splane, point, nextpoint);

          if (isback) {
            backvertices.push(vertex);
            backvertices.push(intersectionpoint);
            frontvertices.push(intersectionpoint);
          } else {
            frontvertices.push(vertex);
            frontvertices.push(intersectionpoint);
            backvertices.push(intersectionpoint);
          }
        }
        isback = nextisback;
      }

      // Remove duplicate vertices
      const EPS_SQUARED = EPS * EPS;

      if (backvertices.length >= 3) {
        let prevvertex = backvertices[backvertices.length - 1];
        for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
          const vertex = backvertices[vertexindex];
          if (vec3.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
            backvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }

      if (frontvertices.length >= 3) {
        let prevvertex = frontvertices[frontvertices.length - 1];
        for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
          const vertex = frontvertices[vertexindex];
          if (vec3.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
            frontvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }

      if (frontvertices.length >= 3) {
        result.front = createPolygonFromPointsAndPlane(frontvertices, polygonPlane);
      }
      if (backvertices.length >= 3) {
        result.back = createPolygonFromPointsAndPlane(backvertices, polygonPlane);
      }
    }
  }
  return result;
};

/**
 * Create a polygon from vertices and a plane (V2 compatible)
 */
function createPolygonFromPointsAndPlane(vertices: number[][], planeVal: number[]) {
  return {
    vertices: vertices,
    plane: planeVal
  };
}

/**
 * Measure bounding sphere of a polygon
 */
function measureBoundingSphere(polygon: any): [number[], number] {
  const vertices = polygon.vertices || poly3.toVertices(polygon);
  if (vertices.length === 0) {
    return [[0, 0, 0], 0];
  }

  // Calculate center
  const center = [0, 0, 0];
  for (const v of vertices) {
    center[0] += v[0];
    center[1] += v[1];
    center[2] += v[2];
  }
  center[0] /= vertices.length;
  center[1] /= vertices.length;
  center[2] /= vertices.length;

  // Calculate radius
  let maxDistSq = 0;
  for (const v of vertices) {
    const dx = v[0] - center[0];
    const dy = v[1] - center[1];
    const dz = v[2] - center[2];
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq > maxDistSq) maxDistSq = distSq;
  }

  return [center, Math.sqrt(maxDistSq)];
}

/**
 * Flip a polygon (reverse vertices)
 */
function flipPolygon(polygon: any) {
  const vertices = polygon.vertices || poly3.toVertices(polygon);
  const flippedVertices = vertices.slice().reverse();
  const flippedPlane = polygon.plane ? plane.flip(plane.create(), polygon.plane) : null;
  return {
    vertices: flippedVertices,
    plane: flippedPlane
  };
}

// =============================================================================
// PolygonTreeNode Class
// =============================================================================

/**
 * PolygonTreeNode manages hierarchical splits of polygons
 * At the top is a root node which doesn't hold a polygon, only child PolygonTreeNodes
 * Below that are zero or more 'top' nodes; each holds a polygon.
 */
export class PolygonTreeNode {
  parent: PolygonTreeNode | null = null;
  children: PolygonTreeNode[] = [];
  polygon: any = null;
  removed: boolean = false;

  constructor() {}

  /**
   * Fill the tree with polygons. Should be called on the root node only.
   */
  addPolygons(polygons: any[]) {
    if (!this.isRootNode()) {
      throw new Error('Assertion failed: can only add polygons to root node');
    }
    for (const polygon of polygons) {
      this.addChild(polygon);
    }
  }

  /**
   * Remove a node from the tree
   */
  remove() {
    if (!this.removed) {
      this.removed = true;

      // Remove from parent's children list
      if (this.parent) {
        const i = this.parent.children.indexOf(this);
        if (i >= 0) {
          this.parent.children.splice(i, 1);
        }
        // Invalidate parent's polygon and all ancestors
        this.parent.recursivelyInvalidatePolygon();
      }
    }
  }

  isRemoved(): boolean {
    return this.removed;
  }

  isRootNode(): boolean {
    return !this.parent;
  }

  /**
   * Invert all polygons in the tree. Call on the root node.
   */
  invert() {
    if (!this.isRootNode()) {
      throw new Error('Assertion failed: can only invert from root node');
    }
    this.invertSub();
  }

  getPolygon(): any {
    if (!this.polygon) {
      throw new Error('Assertion failed: node has no polygon');
    }
    return this.polygon;
  }

  /**
   * Get all polygons from the tree
   */
  getPolygons(result: any[]) {
    const queue: PolygonTreeNode[][] = [[this]];

    for (let i = 0; i < queue.length; ++i) {
      const children = queue[i];
      for (const node of children) {
        if (node.polygon) {
          // The polygon hasn't been broken yet
          result.push(node.polygon);
        } else if (node.children.length > 0) {
          // Our polygon has been split, gather from children
          queue.push(node.children);
        }
      }
    }
  }

  /**
   * Split the node by a plane
   */
  splitByPlane(
    planeVal: number[],
    coplanarfrontnodes: PolygonTreeNode[],
    coplanarbacknodes: PolygonTreeNode[],
    frontnodes: PolygonTreeNode[],
    backnodes: PolygonTreeNode[]
  ) {
    if (this.children.length > 0) {
      const queue: PolygonTreeNode[][] = [this.children];

      for (let i = 0; i < queue.length; i++) {
        const nodes = queue[i];
        for (const node of nodes) {
          if (node.children.length > 0) {
            queue.push(node.children);
          } else {
            node._splitByPlane(planeVal, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
          }
        }
      }
    } else {
      this._splitByPlane(planeVal, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
    }
  }

  /**
   * Internal split implementation for nodes with no children
   */
  _splitByPlane(
    splane: number[],
    coplanarfrontnodes: PolygonTreeNode[],
    coplanarbacknodes: PolygonTreeNode[],
    frontnodes: PolygonTreeNode[],
    backnodes: PolygonTreeNode[]
  ) {
    const polygon = this.polygon;
    if (polygon) {
      const [spherecenter, radius] = measureBoundingSphere(polygon);
      const sphereradius = radius + EPS;
      const d = vec3.dot(splane, spherecenter) - splane[3];

      if (d > sphereradius) {
        frontnodes.push(this);
      } else if (d < -sphereradius) {
        backnodes.push(this);
      } else {
        const splitresult = splitPolygonByPlane(splane, polygon);

        switch (splitresult.type) {
          case 0: // coplanar front
            coplanarfrontnodes.push(this);
            break;
          case 1: // coplanar back
            coplanarbacknodes.push(this);
            break;
          case 2: // front
            frontnodes.push(this);
            break;
          case 3: // back
            backnodes.push(this);
            break;
          case 4: // spanning
            if (splitresult.front) {
              const frontnode = this.addChild(splitresult.front);
              frontnodes.push(frontnode);
            }
            if (splitresult.back) {
              const backnode = this.addChild(splitresult.back);
              backnodes.push(backnode);
            }
            break;
        }
      }
    }
  }

  /**
   * Add a child node with a polygon
   */
  addChild(polygon: any): PolygonTreeNode {
    const newchild = new PolygonTreeNode();
    newchild.parent = this;
    newchild.polygon = polygon;
    this.children.push(newchild);
    return newchild;
  }

  /**
   * Internal recursive invert
   */
  private invertSub() {
    const queue: PolygonTreeNode[][] = [[this]];

    for (let i = 0; i < queue.length; i++) {
      const children = queue[i];
      for (const node of children) {
        if (node.polygon) {
          node.polygon = flipPolygon(node.polygon);
        }
        if (node.children.length > 0) {
          queue.push(node.children);
        }
      }
    }
  }

  /**
   * Invalidate polygon up the tree
   */
  private recursivelyInvalidatePolygon() {
    let node: PolygonTreeNode | null = this;
    while (node && node.polygon) {
      node.polygon = null;
      node = node.parent;
    }
  }

  /**
   * Clear the tree
   */
  clear() {
    const queue: PolygonTreeNode[][] = [[this]];

    for (let i = 0; i < queue.length; ++i) {
      const children = queue[i];
      for (const node of children) {
        node.polygon = null;
        node.parent = null;
        if (node.children.length > 0) {
          queue.push(node.children);
        }
        node.children = [];
      }
    }
  }
}

// =============================================================================
// Node Class (BSP Tree Node)
// =============================================================================

/**
 * Node holds a node in a BSP tree.
 * A BSP tree is built from a collection of polygons by picking a polygon to split along.
 */
export class Node {
  plane: number[] | null = null;
  front: Node | null = null;
  back: Node | null = null;
  polygontreenodes: PolygonTreeNode[] = [];
  parent: Node | null;

  constructor(parent: Node | null) {
    this.parent = parent;
  }

  /**
   * Convert solid space to empty space and vice versa
   */
  invert() {
    const queue: Node[] = [this];

    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (node.plane) {
        node.plane = plane.flip(plane.create(), node.plane);
      }
      if (node.front) queue.push(node.front);
      if (node.back) queue.push(node.back);

      // Swap front and back
      const temp = node.front;
      node.front = node.back;
      node.back = temp;
    }
  }

  /**
   * Clip polygon tree nodes to this plane
   */
  clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront: boolean) {
    let current: { node: Node; polygontreenodes: PolygonTreeNode[] } | undefined = {
      node: this,
      polygontreenodes
    };
    const stack: { node: Node; polygontreenodes: PolygonTreeNode[] }[] = [];

    do {
      const node = current.node;
      const ptns = current.polygontreenodes;

      if (node.plane) {
        const backnodes: PolygonTreeNode[] = [];
        const frontnodes: PolygonTreeNode[] = [];
        const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes;

        for (const ptn of ptns) {
          if (!ptn.isRemoved()) {
            ptn.splitByPlane(node.plane, coplanarfrontnodes, backnodes, frontnodes, backnodes);
          }
        }

        if (node.front && frontnodes.length > 0) {
          stack.push({ node: node.front, polygontreenodes: frontnodes });
        }

        if (node.back && backnodes.length > 0) {
          stack.push({ node: node.back, polygontreenodes: backnodes });
        } else {
          // Nothing behind this plane - delete the nodes
          for (const bn of backnodes) {
            bn.remove();
          }
        }
      }
      current = stack.pop();
    } while (current !== undefined);
  }

  /**
   * Remove all polygons in this BSP tree that are inside the other BSP tree
   */
  clipTo(tree: Tree, alsoRemovecoplanarFront: boolean) {
    let node: Node | undefined = this;
    const stack: Node[] = [];

    do {
      if (node.polygontreenodes.length > 0) {
        tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
      }
      if (node.front) stack.push(node.front);
      if (node.back) stack.push(node.back);
      node = stack.pop();
    } while (node !== undefined);
  }

  /**
   * Add polygon tree nodes to this BSP tree
   */
  addPolygonTreeNodes(newpolygontreenodes: PolygonTreeNode[]) {
    let current: { node: Node; polygontreenodes: PolygonTreeNode[] } | undefined = {
      node: this,
      polygontreenodes: newpolygontreenodes
    };
    const stack: { node: Node; polygontreenodes: PolygonTreeNode[] }[] = [];

    do {
      const node = current.node;
      const polygontreenodes = current.polygontreenodes;

      if (polygontreenodes.length === 0) {
        current = stack.pop();
        continue;
      }

      if (!node.plane) {
        // Pick a plane from the middle polygon
        const index = Math.floor(polygontreenodes.length / 2);
        const polygon = polygontreenodes[index].getPolygon();
        node.plane = polygon.plane || plane.fromPoints(
          plane.create(),
          polygon.vertices[0],
          polygon.vertices[1],
          polygon.vertices[2]
        );
      }

      const frontnodes: PolygonTreeNode[] = [];
      const backnodes: PolygonTreeNode[] = [];

      for (const ptn of polygontreenodes) {
        ptn.splitByPlane(node.plane, node.polygontreenodes, backnodes, frontnodes, backnodes);
      }

      if (frontnodes.length > 0) {
        if (!node.front) node.front = new Node(node);
        stack.push({ node: node.front, polygontreenodes: frontnodes });
      }
      if (backnodes.length > 0) {
        if (!node.back) node.back = new Node(node);
        stack.push({ node: node.back, polygontreenodes: backnodes });
      }

      current = stack.pop();
    } while (current !== undefined);
  }

  /**
   * Get parent plane normals up to maxdepth
   */
  getParentPlaneNormals(normals: number[][], maxdepth: number) {
    if (maxdepth > 0 && this.parent && this.parent.plane) {
      normals.push([this.parent.plane[0], this.parent.plane[1], this.parent.plane[2]]);
      this.parent.getParentPlaneNormals(normals, maxdepth - 1);
    }
  }
}

// =============================================================================
// Tree Class (BSP Tree Root)
// =============================================================================

/**
 * Tree is the root of a BSP tree.
 * This separate class holds the PolygonTreeNode root.
 */
export class Tree {
  polygonTree: PolygonTreeNode;
  rootnode: Node;

  constructor(polygons?: any[]) {
    this.polygonTree = new PolygonTreeNode();
    this.rootnode = new Node(null);
    if (polygons) {
      this.addPolygons(polygons);
    }
  }

  /**
   * Invert the tree
   */
  invert() {
    this.polygonTree.invert();
    this.rootnode.invert();
  }

  /**
   * Remove all polygons inside the other tree
   */
  clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean) {
    this.rootnode.clipTo(tree, !!alsoRemovecoplanarFront);
  }

  /**
   * Get all polygons from the tree
   */
  allPolygons(): any[] {
    const result: any[] = [];
    this.polygonTree.getPolygons(result);
    return result;
  }

  /**
   * Add polygons to the tree
   */
  addPolygons(polygons: any[]) {
    const polygontreenodes: PolygonTreeNode[] = new Array(polygons.length);
    for (let i = 0; i < polygons.length; i++) {
      polygontreenodes[i] = this.polygonTree.addChild(polygons[i]);
    }
    this.rootnode.addPolygonTreeNodes(polygontreenodes);
  }
}

// Default export for backwards compatibility
export default {
  Tree,
  PolygonTreeNode,
  Node,
  splitPolygonByPlane,
  splitLineSegmentByPlane,
};
