// @ts-nocheck
/**
 * Polygon splitting utilities for raytracing
 * Updated to use @jscad/modeling v2 instead of @jscad/csg
 */

import { math, geometry } from '../csg';
import { equalWithinTolerenceFactory } from '../../common/equal-within-range';

const { vec3, plane } = math;
const { poly3 } = geometry;

// Epsilon for floating point comparisons
const EPS = 1e-5;

const vector3sAreEqual = equalWithinTolerenceFactory(["x", "y", "z"])(EPS);
const planeWsAreEqual = equalWithinTolerenceFactory(["w"])(EPS);

// V2 uses array format for planes [nx, ny, nz, w]
const planesAreEqual = (plane1: number[], plane2: number[]) => {
  // Handle both V1 object format and V2 array format
  const p1 = Array.isArray(plane1) ? plane1 : [plane1.normal?.x || 0, plane1.normal?.y || 0, plane1.normal?.z || 0, plane1.w || 0];
  const p2 = Array.isArray(plane2) ? plane2 : [plane2.normal?.x || 0, plane2.normal?.y || 0, plane2.normal?.z || 0, plane2.w || 0];

  return Math.abs(p1[0] - p2[0]) < EPS &&
         Math.abs(p1[1] - p2[1]) < EPS &&
         Math.abs(p1[2] - p2[2]) < EPS &&
         Math.abs(p1[3] - p2[3]) < EPS;
};

export const splitLineSegmentByPlane = (splane: number[], p1: number[], p2: number[]): number[] => {
  const direction = vec3.subtract(vec3.create(), p2, p1);
  let lambda = (splane[3] - vec3.dot(splane, p1)) / vec3.dot(splane, direction);
  if (Number.isNaN(lambda)) lambda = 0;
  if (lambda > 1) lambda = 1;
  if (lambda < 0) lambda = 0;

  const result = vec3.create();
  vec3.scale(result, direction, lambda);
  vec3.add(result, result, p1);
  return result;
};

export const SPLIT_POLYGON_RESULT_TYPE = {
  COPLANAR_FRONT: "COPLANAR_FRONT",
  COPLANAR_BACK: "COPLANAR_BACK",
  FRONT: "FRONT",
  BACK: "BACK",
  SPANNING: "SPANNING",
  NULL: "NULL"
} as const;

// .type:
//   COPLANAR_FRONT: coplanar-front
//   COPLANAR_BACK: coplanar-back
//   FRONT: front
//   BACK: back
//   SPANNING: spanning
// In case the polygon is spanning, returns:
// .front: a Polygon of the front part
// .back: a Polygon of the back part

/**
 * Split a polygon by a plane
 * @param splane split plane [nx, ny, nz, w]
 * @param polygon polygon to split (V2 format with vertices array)
 */
export const splitPolygonByPlane = (splane: number[], polygon: any) => {
  let result = {
    type: "NULL" as keyof typeof SPLIT_POLYGON_RESULT_TYPE,
    front: null as any,
    back: null as any,
  };

  // Get vertices from polygon (V2 format)
  const vertices = polygon.vertices || poly3.toVertices(polygon);
  const numvertices = vertices.length;

  // Get or calculate polygon plane
  const polygonPlane = polygon.plane || (vertices.length >= 3
    ? plane.fromPoints(plane.create(), vertices[0], vertices[1], vertices[2])
    : plane.create());

  if (planesAreEqual(polygonPlane, splane)) {
    result.type = "COPLANAR_FRONT";
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
      result.type = t >= 0 ? "COPLANAR_FRONT" : "COPLANAR_BACK";
    } else if (!hasback) {
      result.type = "FRONT";
    } else if (!hasfront) {
      result.type = "BACK";
    } else {
      // spanning
      result.type = "SPANNING";
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
        result.front = {
          vertices: frontvertices,
          plane: polygonPlane
        };
      }
      if (backvertices.length >= 3) {
        result.back = {
          vertices: backvertices,
          plane: polygonPlane
        };
      }
    }
  }
  return result;
};
