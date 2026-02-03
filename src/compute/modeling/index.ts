//@ts-nocheck
/**
 * CSG module using @jscad/modeling v2
 * This is a compatibility layer that provides the same API as the old @jscad/csg
 * based implementation, but uses the modern ES modules from @jscad/modeling.
 */

// Re-export everything from the V2 compatibility layer
export * from './v2';

// Re-export BSP tree classes and split functions
export {
  Tree,
  PolygonTreeNode,
  Node,
  splitPolygonByPlane,
  splitLineSegmentByPlane,
} from './bsp';

// Split module for backwards compatibility
import { splitPolygonByPlane, splitLineSegmentByPlane } from './bsp';
export const split = {
  polygonByPlane: splitPolygonByPlane,
  lineSegmentByPlane: splitLineSegmentByPlane,
};

// BSP module for backwards compatibility
import { Tree, PolygonTreeNode, Node } from './bsp';
export const bsp = {
  Tree,
  PolygonTreeNode,
  Node,
};

// Default export for backwards compatibility
import * as v2 from './v2';
export default {
  ...v2,
  split,
  bsp,
  Tree,
  PolygonTreeNode,
  Node,
  splitPolygonByPlane,
  splitLineSegmentByPlane,
};
