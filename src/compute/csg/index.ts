//@ts-nocheck
/**
 * CSG module - now using @jscad/modeling v2
 *
 * This file re-exports from the new modeling module which uses @jscad/modeling
 * instead of the old @jscad/csg. This solves the circular dependency issues
 * that caused TDZ errors when bundled with Vite/Rollup.
 */

import {
  connectors,
  geometry,
  math,
  primitives,
  text,
  booleans,
  expansions,
  extrusions,
  hulls,
  measurements,
  transforms,
  color as colorModule,
  utils,
  split,
  bsp,
  Tree,
  PolygonTreeNode,
  Node,
  splitPolygonByPlane,
  splitLineSegmentByPlane,
} from '../modeling';

// Backwards compatibility aliases
const color = colorModule;
const splitLineByPlane = splitLineSegmentByPlane;

export {
  connectors,
  geometry,
  math,
  primitives,
  text,
  booleans,
  expansions,
  extrusions,
  hulls,
  measurements,
  transforms,
  color,
  utils,
  splitLineByPlane,
  splitPolygonByPlane,
  Tree,
  PolygonTreeNode,
  Node
};

export default {
  connectors,
  geometry,
  math,
  primitives,
  text,
  booleans,
  expansions,
  extrusions,
  hulls,
  measurements,
  transforms,
  color,
  utils,
  splitLineByPlane,
  splitPolygonByPlane,
  Tree,
  PolygonTreeNode,
  Node
};
