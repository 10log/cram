var de = Object.defineProperty;
var fe = (t, s, e) => s in t ? de(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var x = (t, s, e) => fe(t, typeof s != "symbol" ? s + "" : s, e);
import { S as pe } from "./solver-z5p8Cank.mjs";
import * as P from "three";
import { MeshLine as me, MeshLineMaterial as ge } from "three.meshline";
import { v as z, n as ve, e as A, R as N, r as D, p as Pe, k, q as U, s as j, w as B, y as W, z as ye, L as K, I as Se, A as be, x as Z, F as Y, o as $, B as Ie, C as Re, D as xe, f as V } from "./index-KmIKz-wL.mjs";
import J from "chroma-js";
import { e as De, g as we } from "./ambisonics.es-Ci32Q6qr.mjs";
const u = {
  /**
   * Create a new Vector3
   */
  create(t, s, e) {
    return [t, s, e];
  },
  /**
   * Create a zero vector
   */
  zero() {
    return [0, 0, 0];
  },
  /**
   * Clone a vector
   */
  clone(t) {
    return [t[0], t[1], t[2]];
  },
  /**
   * Add two vectors
   */
  add(t, s) {
    return [t[0] + s[0], t[1] + s[1], t[2] + s[2]];
  },
  /**
   * Subtract vector b from vector a
   */
  subtract(t, s) {
    return [t[0] - s[0], t[1] - s[1], t[2] - s[2]];
  },
  /**
   * Scale a vector by a scalar
   */
  scale(t, s) {
    return [t[0] * s, t[1] * s, t[2] * s];
  },
  /**
   * Negate a vector
   */
  negate(t) {
    return [-t[0], -t[1], -t[2]];
  },
  /**
   * Dot product of two vectors
   */
  dot(t, s) {
    return t[0] * s[0] + t[1] * s[1] + t[2] * s[2];
  },
  /**
   * Cross product of two vectors (a × b)
   */
  cross(t, s) {
    return [
      t[1] * s[2] - t[2] * s[1],
      t[2] * s[0] - t[0] * s[2],
      t[0] * s[1] - t[1] * s[0]
    ];
  },
  /**
   * Squared length of a vector
   */
  lengthSquared(t) {
    return t[0] * t[0] + t[1] * t[1] + t[2] * t[2];
  },
  /**
   * Length (magnitude) of a vector
   */
  length(t) {
    return Math.sqrt(u.lengthSquared(t));
  },
  /**
   * Normalize a vector to unit length
   * Returns zero vector if input has zero length
   */
  normalize(t) {
    const s = u.length(t);
    return s < 1e-10 ? [0, 0, 0] : [t[0] / s, t[1] / s, t[2] / s];
  },
  /**
   * Linear interpolation between two vectors
   */
  lerp(t, s, e) {
    return [
      t[0] + e * (s[0] - t[0]),
      t[1] + e * (s[1] - t[1]),
      t[2] + e * (s[2] - t[2])
    ];
  },
  /**
   * Distance between two points
   */
  distance(t, s) {
    return u.length(u.subtract(t, s));
  },
  /**
   * Squared distance between two points (faster than distance)
   */
  distanceSquared(t, s) {
    return u.lengthSquared(u.subtract(t, s));
  },
  /**
   * Check if two vectors are approximately equal
   */
  equals(t, s, e = 1e-10) {
    return Math.abs(t[0] - s[0]) < e && Math.abs(t[1] - s[1]) < e && Math.abs(t[2] - s[2]) < e;
  },
  /**
   * Component-wise minimum
   */
  min(t, s) {
    return [
      Math.min(t[0], s[0]),
      Math.min(t[1], s[1]),
      Math.min(t[2], s[2])
    ];
  },
  /**
   * Component-wise maximum
   */
  max(t, s) {
    return [
      Math.max(t[0], s[0]),
      Math.max(t[1], s[1]),
      Math.max(t[2], s[2])
    ];
  },
  /**
   * Reflect vector v across a plane with given normal
   * v' = v - 2(v·n)n
   */
  reflect(t, s) {
    const e = 2 * u.dot(t, s);
    return u.subtract(t, u.scale(s, e));
  },
  /**
   * Project vector a onto vector b
   */
  project(t, s) {
    const e = u.lengthSquared(s);
    if (e < 1e-10)
      return [0, 0, 0];
    const o = u.dot(t, s) / e;
    return u.scale(s, o);
  },
  /**
   * Get the component of a perpendicular to b
   */
  reject(t, s) {
    return u.subtract(t, u.project(t, s));
  },
  /**
   * Convert to string for debugging
   */
  toString(t, s = 4) {
    return `[${t[0].toFixed(s)}, ${t[1].toFixed(s)}, ${t[2].toFixed(s)}]`;
  }
}, v = {
  /**
   * Create a plane from a normal vector and a point on the plane
   */
  fromNormalAndPoint(t, s) {
    const e = u.normalize(t), o = -u.dot(e, s);
    return { a: e[0], b: e[1], c: e[2], d: o };
  },
  /**
   * Create a plane from three non-collinear points
   * Uses counter-clockwise winding order: normal points toward viewer when
   * p1 → p2 → p3 appears counter-clockwise
   */
  fromPoints(t, s, e) {
    const o = u.subtract(s, t), n = u.subtract(e, t), r = u.normalize(u.cross(o, n));
    return v.fromNormalAndPoint(r, t);
  },
  /**
   * Create a plane directly from coefficients
   */
  create(t, s, e, o) {
    return { a: t, b: s, c: e, d: o };
  },
  /**
   * Get the normal vector of the plane
   */
  normal(t) {
    return [t.a, t.b, t.c];
  },
  /**
   * Signed distance from a point to the plane
   * Positive = point is in front (on normal side)
   * Negative = point is behind
   * Zero = point is on the plane
   */
  signedDistance(t, s) {
    return s.a * t[0] + s.b * t[1] + s.c * t[2] + s.d;
  },
  /**
   * Absolute distance from a point to the plane
   */
  distance(t, s) {
    return Math.abs(v.signedDistance(t, s));
  },
  /**
   * Classify a point relative to the plane
   */
  classifyPoint(t, s, e = 1e-6) {
    const o = v.signedDistance(t, s);
    return o > e ? "front" : o < -e ? "back" : "on";
  },
  /**
   * Check if a point is in front of the plane
   */
  isPointInFront(t, s, e = 1e-6) {
    return v.signedDistance(t, s) > e;
  },
  /**
   * Check if a point is behind the plane
   */
  isPointBehind(t, s, e = 1e-6) {
    return v.signedDistance(t, s) < -e;
  },
  /**
   * Check if a point is on the plane
   */
  isPointOn(t, s, e = 1e-6) {
    return Math.abs(v.signedDistance(t, s)) <= e;
  },
  /**
   * Mirror a point across the plane
   * p' = p - 2 * signedDistance(p) * normal
   */
  mirrorPoint(t, s) {
    const e = v.signedDistance(t, s), o = v.normal(s);
    return u.subtract(t, u.scale(o, 2 * e));
  },
  /**
   * Mirror a plane across another plane (for fail plane propagation)
   * This mirrors two points on the source plane and reconstructs.
   */
  mirrorPlane(t, s) {
    const e = v.normal(t);
    let o;
    Math.abs(e[2]) > 0.5 ? o = [0, 0, -t.d / t.c] : Math.abs(e[1]) > 0.5 ? o = [0, -t.d / t.b, 0] : o = [-t.d / t.a, 0, 0];
    const n = Math.abs(e[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], r = u.normalize(u.cross(e, n)), a = u.add(o, r), l = u.cross(e, r), i = u.add(o, l), c = v.mirrorPoint(o, s), h = v.mirrorPoint(a, s), d = v.mirrorPoint(i, s);
    return v.fromPoints(c, h, d);
  },
  /**
   * Flip the plane orientation (negate normal and d)
   */
  flip(t) {
    return { a: -t.a, b: -t.b, c: -t.c, d: -t.d };
  },
  /**
   * Ray-plane intersection
   *
   * Returns the t parameter along the ray where intersection occurs,
   * or null if the ray is parallel to the plane.
   *
   * Point of intersection = rayOrigin + t * rayDirection
   *
   * @param rayOrigin - Starting point of the ray
   * @param rayDirection - Direction of the ray (should be normalized for t to represent distance)
   * @param plane - The plane to intersect with
   */
  rayIntersection(t, s, e) {
    const o = v.normal(e), n = u.dot(o, s);
    return Math.abs(n) < 1e-10 ? null : -(u.dot(o, t) + e.d) / n;
  },
  /**
   * Get the point of intersection between a ray and plane
   */
  rayIntersectionPoint(t, s, e) {
    const o = v.rayIntersection(t, s, e);
    return o === null ? null : u.add(t, u.scale(s, o));
  },
  /**
   * Project a point onto the plane
   */
  projectPoint(t, s) {
    const e = v.signedDistance(t, s), o = v.normal(s);
    return u.subtract(t, u.scale(o, e));
  },
  /**
   * Check if two planes are approximately equal
   */
  equals(t, s, e = 1e-6) {
    const o = t.a * s.a + t.b * s.b + t.c * s.c;
    return Math.abs(o - 1) < e ? Math.abs(t.d - s.d) < e : Math.abs(o + 1) < e ? Math.abs(t.d + s.d) < e : !1;
  },
  /**
   * Convert to string for debugging
   */
  toString(t, s = 4) {
    return `Plane3D(${t.a.toFixed(s)}x + ${t.b.toFixed(s)}y + ${t.c.toFixed(s)}z + ${t.d.toFixed(s)} = 0)`;
  }
}, w = {
  /**
   * Create a polygon from vertices (computes plane automatically)
   * Vertices must be in counter-clockwise order when viewed from front
   */
  create(t, s) {
    if (t.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    const e = t.map((n) => u.clone(n)), o = v.fromPoints(e[0], e[1], e[2]);
    return { vertices: e, plane: o, materialId: s };
  },
  /**
   * Create a polygon with an explicit plane (for split polygons that may be degenerate)
   */
  createWithPlane(t, s, e) {
    if (t.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    return { vertices: t.map((n) => u.clone(n)), plane: s, materialId: e };
  },
  /**
   * Get the number of vertices
   */
  vertexCount(t) {
    return t.vertices.length;
  },
  /**
   * Compute the centroid (geometric center) of the polygon
   */
  centroid(t) {
    const s = [0, 0, 0];
    for (const o of t.vertices)
      s[0] += o[0], s[1] += o[1], s[2] += o[2];
    const e = t.vertices.length;
    return [s[0] / e, s[1] / e, s[2] / e];
  },
  /**
   * Compute the area of the polygon using cross product method
   */
  area(t) {
    if (t.vertices.length < 3)
      return 0;
    let s = [0, 0, 0];
    const e = t.vertices[0];
    for (let o = 1; o < t.vertices.length - 1; o++) {
      const n = t.vertices[o], r = t.vertices[o + 1], a = u.cross(u.subtract(n, e), u.subtract(r, e));
      s = u.add(s, a);
    }
    return 0.5 * u.length(s);
  },
  /**
   * Get the normal vector of the polygon (from the plane)
   */
  normal(t) {
    return v.normal(t.plane);
  },
  /**
   * Get edges as pairs of vertices [start, end]
   */
  edges(t) {
    const s = [];
    for (let e = 0; e < t.vertices.length; e++) {
      const o = (e + 1) % t.vertices.length;
      s.push([t.vertices[e], t.vertices[o]]);
    }
    return s;
  },
  /**
   * Classify the polygon relative to a plane
   */
  classify(t, s, e = 1e-6) {
    let o = 0, n = 0;
    for (const r of t.vertices) {
      const a = v.classifyPoint(r, s, e);
      a === "front" ? o++ : a === "back" && n++;
    }
    return o > 0 && n > 0 ? "spanning" : o > 0 ? "front" : n > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(t, s, e = 1e-6) {
    const o = v.normal(t.plane), n = t.vertices.length;
    for (let r = 0; r < n; r++) {
      const a = t.vertices[r], l = t.vertices[(r + 1) % n], i = u.subtract(l, a), c = u.subtract(s, a), h = u.cross(i, c);
      if (u.dot(h, o) < -e)
        return !1;
    }
    return !0;
  },
  /**
   * Ray-polygon intersection
   * Returns t parameter and intersection point, or null if no hit
   */
  rayIntersection(t, s, e) {
    const o = v.rayIntersection(t, s, e.plane);
    if (o === null || o < 0)
      return null;
    const n = u.add(t, u.scale(s, o));
    return w.containsPoint(e, n) ? { t: o, point: n } : null;
  },
  /**
   * Create a bounding box for the polygon
   */
  boundingBox(t) {
    const s = [1 / 0, 1 / 0, 1 / 0], e = [-1 / 0, -1 / 0, -1 / 0];
    for (const o of t.vertices)
      s[0] = Math.min(s[0], o[0]), s[1] = Math.min(s[1], o[1]), s[2] = Math.min(s[2], o[2]), e[0] = Math.max(e[0], o[0]), e[1] = Math.max(e[1], o[1]), e[2] = Math.max(e[2], o[2]);
    return { min: s, max: e };
  },
  /**
   * Check if polygon is degenerate (zero or near-zero area)
   */
  isDegenerate(t, s = 1e-10) {
    return t.vertices.length < 3 || w.area(t) < s;
  },
  /**
   * Flip the polygon winding (reverse vertex order and flip plane)
   */
  flip(t) {
    const s = [...t.vertices].reverse(), e = v.flip(t.plane);
    return {
      vertices: s,
      plane: e,
      materialId: t.materialId
    };
  },
  /**
   * Clone a polygon
   */
  clone(t) {
    return {
      vertices: t.vertices.map((s) => u.clone(s)),
      plane: { ...t.plane },
      materialId: t.materialId
    };
  },
  /**
   * Convert to string for debugging
   */
  toString(t) {
    const s = t.vertices.map((e) => u.toString(e, 2)).join(", ");
    return `Polygon3D(${t.vertices.length} vertices: [${s}])`;
  }
};
function Me(t, s, e = 1e-6) {
  const o = w.classify(t, s, e);
  if (o === "front" || o === "coplanar")
    return { front: t, back: null };
  if (o === "back")
    return { front: null, back: t };
  const n = [], r = [], a = t.vertices.length;
  for (let c = 0; c < a; c++) {
    const h = t.vertices[c], d = t.vertices[(c + 1) % a], f = v.signedDistance(h, s), p = v.signedDistance(d, s), m = f > e ? "front" : f < -e ? "back" : "on", g = p > e ? "front" : p < -e ? "back" : "on";
    if (m === "front" ? n.push(h) : (m === "back" || n.push(h), r.push(h)), m === "front" && g === "back" || m === "back" && g === "front") {
      const b = f / (f - p), I = u.lerp(h, d, b);
      n.push(I), r.push(I);
    }
  }
  const l = n.length >= 3 ? w.createWithPlane(n, t.plane, t.materialId) : null, i = r.length >= 3 ? w.createWithPlane(r, t.plane, t.materialId) : null;
  return { front: l, back: i };
}
function Te(t, s, e = 1e-6) {
  const o = t.vertices, n = [];
  if (o.length < 3)
    return null;
  for (let r = 0; r < o.length; r++) {
    const a = o[r], l = o[(r + 1) % o.length], i = v.signedDistance(a, s), c = v.signedDistance(l, s), h = i >= -e, d = c >= -e;
    if (h && n.push(a), h && !d || !h && d) {
      const f = i / (i - c), p = u.lerp(a, l, Math.max(0, Math.min(1, f)));
      n.push(p);
    }
  }
  return n.length < 3 ? null : w.createWithPlane(n, t.plane, t.materialId);
}
function Be(t, s, e = 1e-6) {
  let o = t;
  for (const n of s) {
    if (!o)
      return null;
    o = Te(o, n, e);
  }
  return o;
}
function Ae(t, s, e = 1e-6) {
  for (const o of s) {
    let n = !0;
    for (const r of t.vertices)
      if (v.signedDistance(r, o) >= -e) {
        n = !1;
        break;
      }
    if (n)
      return !0;
  }
  return !1;
}
function ke(t) {
  if (t.length === 0)
    return null;
  const s = t.map((e, o) => ({
    polygon: e,
    originalId: o
  }));
  return G(s);
}
function G(t) {
  if (t.length === 0)
    return null;
  const s = Fe(t), e = t[s], o = e.polygon.plane, n = [], r = [];
  for (let a = 0; a < t.length; a++) {
    if (a === s)
      continue;
    const l = t[a], { front: i, back: c } = Me(l.polygon, o);
    i && n.push({ polygon: i, originalId: l.originalId }), c && r.push({ polygon: c, originalId: l.originalId });
  }
  return {
    plane: o,
    polygon: e.polygon,
    polygonId: e.originalId,
    front: G(n),
    back: G(r)
  };
}
function Fe(t) {
  if (t.length <= 3)
    return 0;
  let s = 0, e = 1 / 0;
  const o = Math.min(t.length, 10), n = Math.max(1, Math.floor(t.length / o));
  for (let r = 0; r < t.length; r += n) {
    const a = t[r].polygon.plane;
    let l = 0, i = 0, c = 0;
    for (let d = 0; d < t.length; d++) {
      if (r === d)
        continue;
      const f = w.classify(t[d].polygon, a);
      f === "front" ? l++ : f === "back" ? i++ : f === "spanning" && (l++, i++, c++);
    }
    const h = c * 8 + Math.abs(l - i);
    h < e && (e = h, s = r);
  }
  return s;
}
function C(t, s, e, o = 0, n = 1 / 0, r = -1) {
  if (!e)
    return null;
  const a = v.signedDistance(t, e.plane), l = v.normal(e.plane), i = u.dot(l, s);
  let c, h;
  a >= 0 ? (c = e.front, h = e.back) : (c = e.back, h = e.front);
  let d = null;
  Math.abs(i) > 1e-10 && (d = -a / i);
  let f = null;
  if (d === null || d < o) {
    if (f = C(t, s, c, o, n, r), !f && e.polygonId !== r) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = C(t, s, h, o, n, r));
  } else if (d > n) {
    if (f = C(t, s, c, o, n, r), !f && e.polygonId !== r) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = C(t, s, h, o, n, r));
  } else {
    if (f = C(t, s, c, o, d, r), !f && e.polygonId !== r) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = C(t, s, h, d, n, r));
  }
  return f;
}
function O(t, s, e, o, n, r) {
  if (!e)
    return null;
  const a = v.signedDistance(t, e.plane), l = v.normal(e.plane), i = u.dot(l, s);
  let c, h;
  a >= 0 ? (c = e.front, h = e.back) : (c = e.back, h = e.front);
  let d = null;
  Math.abs(i) > 1e-10 && (d = -a / i);
  let f = null;
  if (d === null || d < o) {
    if (f = O(t, s, c, o, n, r), !f && !r.has(e.polygonId)) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = O(t, s, h, o, n, r));
  } else if (d > n) {
    if (f = O(t, s, c, o, n, r), !f && !r.has(e.polygonId)) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = O(t, s, h, o, n, r));
  } else {
    if (f = O(t, s, c, o, d, r), !f && !r.has(e.polygonId)) {
      const p = w.rayIntersection(t, s, e.polygon);
      p && p.t >= o && p.t <= n && (f = {
        t: p.t,
        point: p.point,
        polygonId: e.polygonId,
        polygon: e.polygon
      });
    }
    f || (f = O(t, s, h, d, n, r));
  }
  return f;
}
function ee(t, s) {
  const e = [], o = w.edges(s), n = w.centroid(s);
  for (const [a, l] of o) {
    let i = v.fromPoints(t, a, l);
    v.signedDistance(n, i) < 0 && (i = v.flip(i)), e.push(i);
  }
  let r = s.plane;
  return v.signedDistance(t, r) > 0 && (r = v.flip(r)), e.push(r), e;
}
function te(t, s) {
  return v.mirrorPoint(t, s.plane);
}
function se(t, s) {
  const e = w.centroid(t), o = u.subtract(s, e), n = v.normal(t.plane);
  return u.dot(n, o) > 0;
}
const $e = 1e-6;
function Oe(t, s, e) {
  const o = {
    id: -1,
    parent: null,
    virtualSource: u.clone(t),
    children: []
  };
  if (e >= 1)
    for (let r = 0; r < s.length; r++) {
      const a = s[r];
      if (!se(a, t))
        continue;
      const l = te(t, a), i = ee(l, a), c = {
        id: r,
        parent: o,
        virtualSource: l,
        aperture: w.clone(a),
        boundaryPlanes: i,
        children: []
      };
      o.children.push(c), e > 1 && oe(c, s, 2, e);
    }
  const n = [];
  return ne(o, n), {
    root: o,
    leafNodes: n,
    polygons: s,
    maxReflectionOrder: e
  };
}
function oe(t, s, e, o) {
  if (!(e > o) && !(!t.boundaryPlanes || !t.aperture))
    for (let n = 0; n < s.length; n++) {
      if (n === t.id)
        continue;
      const r = s[n];
      if (Ae(r, t.boundaryPlanes) || !se(r, t.virtualSource))
        continue;
      const a = Be(r, t.boundaryPlanes);
      if (!a || w.area(a) < $e)
        continue;
      const i = te(t.virtualSource, r), c = ee(i, a), h = {
        id: n,
        parent: t,
        virtualSource: i,
        aperture: a,
        boundaryPlanes: c,
        children: []
      };
      t.children.push(h), e < o && oe(h, s, e + 1, o);
    }
}
function ne(t, s) {
  t.children.length === 0 && t.id !== -1 && s.push(t);
  for (const e of t.children)
    ne(e, s);
}
function Ee(t) {
  re(t.root);
}
function re(t) {
  t.failPlane = void 0, t.failPlaneType = void 0;
  for (const s of t.children)
    re(s);
}
function Ce(t, s, e) {
  if (!s.aperture || !s.boundaryPlanes)
    return null;
  let n = e[s.id].plane;
  if (v.signedDistance(s.virtualSource, n) < 0 && (n = v.flip(n)), v.signedDistance(t, n) < 0)
    return {
      plane: n,
      type: "polygon",
      nodeDepth: Q(s)
    };
  const r = s.boundaryPlanes.length - 1;
  for (let a = 0; a < s.boundaryPlanes.length; a++) {
    const l = s.boundaryPlanes[a];
    if (v.signedDistance(t, l) < 0) {
      const i = a < r ? "edge" : "aperture";
      return {
        plane: l,
        type: i,
        nodeDepth: Q(s)
      };
    }
  }
  return null;
}
function Q(t) {
  let s = 0, e = t;
  for (; e && e.id !== -1; )
    s++, e = e.parent;
  return s;
}
function Le(t, s) {
  return v.signedDistance(t, s) < 0;
}
const ie = 16;
function _e(t, s = ie) {
  const e = [];
  for (let o = 0; o < t.length; o += s)
    e.push({
      id: e.length,
      nodes: t.slice(o, Math.min(o + s, t.length)),
      skipSphere: null
    });
  return e;
}
function ze(t, s) {
  return u.distance(t, s.center) < s.radius;
}
function Ve(t, s) {
  return s.skipSphere ? ze(t, s.skipSphere) ? "inside" : "outside" : "none";
}
function He(t, s) {
  let e = 1 / 0;
  for (const o of s) {
    if (!o.failPlane)
      return null;
    const n = Math.abs(v.signedDistance(t, o.failPlane));
    e = Math.min(e, n);
  }
  return e === 1 / 0 || e <= 1e-10 ? null : {
    center: u.clone(t),
    radius: e
  };
}
function X(t) {
  t.skipSphere = null;
}
function Ne(t) {
  for (const s of t.nodes)
    s.failPlane = void 0, s.failPlaneType = void 0;
}
class Ge {
  /**
   * Create a new 3D beam tracing solver
   *
   * @param polygons - Room geometry as an array of polygons
   * @param sourcePosition - Position of the sound source
   * @param config - Optional configuration
   */
  constructor(s, e, o = {}) {
    const n = o.maxReflectionOrder ?? 5, r = o.bucketSize ?? ie;
    this.polygons = s, this.sourcePosition = u.clone(e), this.bspRoot = ke(s), this.beamTree = Oe(e, s, n), this.buckets = _e(this.beamTree.leafNodes, r), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
  }
  /**
   * Get all valid reflection paths from source to listener
   *
   * @param listenerPos - Position of the listener
   * @returns Array of valid reflection paths
   */
  getPaths(s) {
    this.resetMetrics();
    const e = [], o = this.validateDirectPath(s);
    o && e.push(o);
    const n = this.findIntermediatePaths(s, this.beamTree.root);
    e.push(...n);
    for (const r of this.buckets) {
      const a = Ve(s, r);
      if (a === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      a === "outside" && (X(r), Ne(r)), this.metrics.bucketsChecked++;
      let l = !0, i = !0;
      for (const c of r.nodes) {
        if (c.failPlane && Le(s, c.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        c.failPlane && (c.failPlane = void 0, c.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const h = this.validatePath(s, c);
        h.valid && h.path ? (e.push(h.path), l = !1, i = !1) : c.failPlane || (i = !1);
      }
      l && i && r.nodes.length > 0 && (r.skipSphere = He(s, r.nodes), r.skipSphere && this.metrics.skipSphereCount++);
    }
    return this.metrics.validPathCount = e.length, e;
  }
  /**
   * Get all valid reflection paths with detailed information about each reflection.
   *
   * This method returns the same paths as getPaths() but with additional details:
   * - Angle of incidence and reflection at each surface
   * - Surface normal vectors
   * - Segment lengths and cumulative distances
   * - Grazing incidence detection
   *
   * @param listenerPos - Position of the listener
   * @returns Array of detailed reflection paths
   */
  getDetailedPaths(s) {
    return this.getPaths(s).map((o) => Ze(o, this.polygons));
  }
  /**
   * Validate the direct path from listener to source
   */
  validateDirectPath(s) {
    const e = u.subtract(this.sourcePosition, s), o = u.length(e), n = u.normalize(e);
    this.metrics.raycastCount++;
    const r = C(s, n, this.bspRoot, 0, o, -1);
    return r && r.t < o - 1e-6 ? null : [
      { position: u.clone(s), polygonId: null },
      { position: u.clone(this.sourcePosition), polygonId: null }
    ];
  }
  /**
   * Find paths through intermediate (non-leaf) nodes
   *
   * These are lower-order reflections that didn't spawn further children.
   */
  findIntermediatePaths(s, e) {
    const o = [];
    for (const n of e.children)
      n.children.length > 0 && o.push(...this.findIntermediatePaths(s, n));
    if (e.id !== -1 && e.aperture) {
      const n = this.traverseBeam(s, e);
      n && o.push(n);
    }
    return o;
  }
  /**
   * Traverse a beam from listener to source, building the reflection path
   */
  traverseBeam(s, e, o = !1) {
    const n = [
      { position: u.clone(s), polygonId: null }
    ], r = [];
    let a = e;
    for (; a && a.id !== -1; )
      r.unshift(a.id), a = a.parent;
    o && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${r.join(", ")}]`), console.log(`  Listener: [${s[0].toFixed(3)}, ${s[1].toFixed(3)}, ${s[2].toFixed(3)}]`), console.log(`  Virtual source: [${e.virtualSource[0].toFixed(3)}, ${e.virtualSource[1].toFixed(3)}, ${e.virtualSource[2].toFixed(3)}]`));
    let l = s, i = e;
    const c = /* @__PURE__ */ new Set();
    let h = 0;
    for (; i && i.id !== -1; ) {
      const d = this.polygons[i.id], f = i.virtualSource, p = u.normalize(u.subtract(f, l)), m = w.rayIntersection(l, p, d);
      if (!m)
        return o && console.log(`  [Segment ${h}] FAIL: No intersection with polygon ${i.id}`), null;
      o && (console.log(`  [Segment ${h}] Ray from [${l[0].toFixed(3)}, ${l[1].toFixed(3)}, ${l[2].toFixed(3)}]`), console.log(`    Direction: [${p[0].toFixed(3)}, ${p[1].toFixed(3)}, ${p[2].toFixed(3)}]`), console.log(`    Hit polygon ${i.id} at t=${m.t.toFixed(3)}, point=[${m.point[0].toFixed(3)}, ${m.point[1].toFixed(3)}, ${m.point[2].toFixed(3)}]`)), c.add(i.id), this.metrics.raycastCount++;
      const g = O(l, p, this.bspRoot, 1e-6, m.t - 1e-6, c);
      if (g)
        return o && (console.log(`    OCCLUDED by polygon ${g.polygonId} at t=${g.t.toFixed(3)}, point=[${g.point[0].toFixed(3)}, ${g.point[1].toFixed(3)}, ${g.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), n.push({
        position: u.clone(m.point),
        polygonId: i.id
      }), l = m.point, i = i.parent, h++;
    }
    if (i) {
      const d = u.normalize(u.subtract(i.virtualSource, l)), f = u.distance(i.virtualSource, l);
      if (o) {
        console.log(`  [Final segment] Ray from [${l[0].toFixed(3)}, ${l[1].toFixed(3)}, ${l[2].toFixed(3)}]`), console.log(`    To source: [${i.virtualSource[0].toFixed(3)}, ${i.virtualSource[1].toFixed(3)}, ${i.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${d[0].toFixed(3)}, ${d[1].toFixed(3)}, ${d[2].toFixed(3)}]`), console.log(`    Distance: ${f.toFixed(3)}`), console.log(`    tMin: ${1e-6}, tMax: ${(f - 1e-6).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
        const b = l, I = i.virtualSource;
        if (b[1] < 5.575 && I[1] > 5.575 || b[1] > 5.575 && I[1] < 5.575) {
          const R = (5.575 - b[1]) / (I[1] - b[1]), y = b[0] + R * (I[0] - b[0]), S = b[2] + R * (I[2] - b[2]);
          if (console.log(`    CROSSING y=5.575 at t=${R.toFixed(3)}, x=${y.toFixed(3)}, z=${S.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), y >= 6.215 && y <= 12.43 && S >= 0 && S <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const M of [3, 4]) {
              const T = this.polygons[M], F = w.rayIntersection(l, d, T);
              F ? console.log(`      Polygon ${M}: HIT at t=${F.t.toFixed(3)}, point=[${F.point[0].toFixed(3)}, ${F.point[1].toFixed(3)}, ${F.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${M}: NO HIT`), console.log(`        Vertices: ${T.vertices.map((E) => `[${E[0].toFixed(2)}, ${E[1].toFixed(2)}, ${E[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const p = 1e-6, m = f - 1e-6, g = O(l, d, this.bspRoot, p, m, c);
      if (g)
        return o && console.log(`    OCCLUDED by polygon ${g.polygonId} at t=${g.t.toFixed(3)}, point=[${g.point[0].toFixed(3)}, ${g.point[1].toFixed(3)}, ${g.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), n.push({
        position: u.clone(i.virtualSource),
        polygonId: null
      });
    }
    return n;
  }
  /**
   * Validate a path through a beam node
   */
  validatePath(s, e) {
    const o = this.traverseBeam(s, e);
    if (o)
      return { valid: !0, path: o };
    const n = Ce(s, e, this.polygons);
    return n && (e.failPlane = n.plane, e.failPlaneType = n.type), { valid: !1, path: null };
  }
  /**
   * Get performance metrics from the last getPaths() call
   */
  getMetrics() {
    return { ...this.metrics };
  }
  /**
   * Debug a specific beam path by polygon IDs
   * Logs detailed information about the path validation process
   */
  debugBeamPath(s, e) {
    console.log("=== DEBUG BEAM PATH ==="), console.log(`Listener: [${s[0].toFixed(3)}, ${s[1].toFixed(3)}, ${s[2].toFixed(3)}]`), console.log(`Polygon path: [${e.join(", ")}]`), console.log(`Source: [${this.sourcePosition[0].toFixed(3)}, ${this.sourcePosition[1].toFixed(3)}, ${this.sourcePosition[2].toFixed(3)}]`);
    const o = (a, l, i) => {
      if (i === l.length)
        return a;
      for (const c of a.children)
        if (c.id === l[i])
          return o(c, l, i + 1);
      return null;
    }, n = o(this.beamTree.root, e, 0);
    if (!n) {
      console.log("ERROR: Could not find beam node for this polygon path");
      return;
    }
    console.log(`Found beam node with virtual source: [${n.virtualSource[0].toFixed(3)}, ${n.virtualSource[1].toFixed(3)}, ${n.virtualSource[2].toFixed(3)}]`);
    const r = this.traverseBeam(s, n, !0);
    if (r) {
      console.log("PATH VALID - returned path:");
      for (let a = 0; a < r.length; a++) {
        const l = r[a];
        console.log(`  [${a}] pos=[${l.position[0].toFixed(3)}, ${l.position[1].toFixed(3)}, ${l.position[2].toFixed(3)}], polygonId=${l.polygonId}`);
      }
    } else
      console.log("PATH INVALID");
    console.log("=== END DEBUG ===");
  }
  /**
   * Clear all cached fail planes and skip spheres
   *
   * Call this if the room geometry changes.
   */
  clearCache() {
    Ee(this.beamTree);
    for (const s of this.buckets)
      X(s);
  }
  /**
   * Get the number of leaf nodes in the beam tree
   */
  getLeafNodeCount() {
    return this.beamTree.leafNodes.length;
  }
  /**
   * Get the maximum reflection order
   */
  getMaxReflectionOrder() {
    return this.beamTree.maxReflectionOrder;
  }
  /**
   * Get the source position
   */
  getSourcePosition() {
    return u.clone(this.sourcePosition);
  }
  /**
   * Get beam data for visualization
   * Returns beams organized by reflection order
   */
  getBeamsForVisualization(s) {
    const e = [], o = s ?? this.beamTree.maxReflectionOrder, n = (r, a, l) => {
      if (a > o)
        return;
      const i = r.id !== -1 ? [...l, r.id] : l;
      r.id !== -1 && r.aperture && e.push({
        virtualSource: u.clone(r.virtualSource),
        apertureVertices: r.aperture.vertices.map((c) => u.clone(c)),
        reflectionOrder: a,
        polygonId: r.id,
        polygonPath: i
      });
      for (const c of r.children)
        n(c, a + 1, i);
    };
    return n(this.beamTree.root, 0, []), e;
  }
  /**
   * Create empty metrics object
   */
  createEmptyMetrics() {
    return {
      totalLeafNodes: 0,
      bucketsTotal: 0,
      bucketsSkipped: 0,
      bucketsChecked: 0,
      failPlaneCacheHits: 0,
      failPlaneCacheMisses: 0,
      raycastCount: 0,
      skipSphereCount: 0,
      validPathCount: 0
    };
  }
  /**
   * Reset metrics for a new getPaths() call
   */
  resetMetrics() {
    const s = this.metrics.totalLeafNodes, e = this.metrics.bucketsTotal;
    this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = s, this.metrics.bucketsTotal = e;
  }
}
function ae(t) {
  let s = 0;
  for (let e = 1; e < t.length; e++)
    s += u.distance(t[e - 1].position, t[e].position);
  return s;
}
function qe(t, s = 343) {
  return ae(t) / s;
}
function Ue(t) {
  return t.filter((s) => s.polygonId !== null).length;
}
const je = 0.05;
function We(t, s) {
  const e = Math.abs(u.dot(u.negate(t), s)), o = Math.max(-1, Math.min(1, e));
  return Math.acos(o);
}
function Ke(t, s) {
  const e = v.normal(t.plane);
  return u.dot(s, e) > 0 ? u.negate(e) : u.clone(e);
}
function Ze(t, s) {
  var l;
  if (t.length < 2)
    throw new Error("Path must have at least 2 points (listener and source)");
  const e = u.clone(t[0].position), o = u.clone(t[t.length - 1].position), n = [], r = [];
  let a = 0;
  for (let i = 0; i < t.length - 1; i++) {
    const c = t[i].position, h = t[i + 1].position, d = u.distance(c, h);
    r.push({
      startPoint: u.clone(c),
      endPoint: u.clone(h),
      length: d,
      segmentIndex: i
    });
    const f = t[i + 1].polygonId;
    if (f !== null) {
      const p = s[f], m = t[i + 1].position, g = u.normalize(u.subtract(m, c)), b = (l = t[i + 2]) == null ? void 0 : l.position;
      let I;
      b ? I = u.normalize(u.subtract(b, m)) : I = u.reflect(g, v.normal(p.plane));
      const R = Ke(p, g), y = We(g, R), S = y;
      a += d;
      const M = Math.abs(y - Math.PI / 2) < je;
      n.push({
        polygon: p,
        polygonId: f,
        hitPoint: u.clone(m),
        incidenceAngle: y,
        reflectionAngle: S,
        incomingDirection: g,
        outgoingDirection: I,
        surfaceNormal: R,
        reflectionOrder: n.length + 1,
        cumulativeDistance: a,
        incomingSegmentLength: d,
        isGrazing: M
      });
    } else
      a += d;
  }
  return {
    listenerPosition: e,
    sourcePosition: o,
    totalPathLength: a,
    reflectionCount: n.length,
    reflections: n,
    segments: r,
    simplePath: t
  };
}
class Ye {
  constructor(s) {
    this.position = u.clone(s);
  }
}
class Qe {
  constructor(s, e, o) {
    this.source = e, this.solver = new Ge(s, e.position, o);
  }
  /**
   * Get all valid reflection paths to a listener
   */
  getPaths(s) {
    const e = Array.isArray(s) ? s : s.position;
    return this.solver.getPaths(e);
  }
  /**
   * Get all valid reflection paths with detailed information about each reflection.
   *
   * This method returns the same paths as getPaths() but with additional details:
   * - Angle of incidence and reflection at each surface
   * - Surface normal vectors
   * - Segment lengths and cumulative distances
   * - Grazing incidence detection
   *
   * @param listener - Listener position or Listener3D object
   * @returns Array of detailed reflection paths
   */
  getDetailedPaths(s) {
    const e = Array.isArray(s) ? s : s.position;
    return this.solver.getDetailedPaths(e);
  }
  /**
   * Get performance metrics from last getPaths() call
   */
  getMetrics() {
    return this.solver.getMetrics();
  }
  /**
   * Clear optimization caches
   */
  clearCache() {
    this.solver.clearCache();
  }
  /**
   * Get number of leaf nodes in beam tree
   */
  getLeafNodeCount() {
    return this.solver.getLeafNodeCount();
  }
  /**
   * Get maximum reflection order
   */
  getMaxReflectionOrder() {
    return this.solver.getMaxReflectionOrder();
  }
  /**
   * Get beam data for visualization
   */
  getBeamsForVisualization(s) {
    return this.solver.getBeamsForVisualization(s);
  }
  /**
   * Debug a specific beam path by polygon IDs
   * Logs detailed information about the path validation process
   */
  debugBeamPath(s, e) {
    const o = Array.isArray(s) ? s : s.position;
    this.solver.debugBeamPath(o, e);
  }
}
function Xe() {
  const t = new me();
  t.setPoints([]);
  const s = new ge({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new P.Mesh(t, s);
}
const Je = J.scale(["#ff8a0b", "#000080"]).mode("lch");
function L(t, s) {
  const e = s + 1, o = Je.colors(e), n = Math.min(t, e - 1), r = J(o[n]);
  return parseInt(r.hex().slice(1), 16);
}
const et = {
  name: "Beam Trace",
  uuid: "",
  roomID: "",
  sourceIDs: [],
  receiverIDs: [],
  maxReflectionOrder: 3,
  visualizationMode: "rays",
  showAllBeams: !1,
  visibleOrders: [0, 1, 2, 3],
  frequencies: [125, 250, 500, 1e3, 2e3, 4e3, 8e3],
  levelTimeProgression: "",
  impulseResponseResult: ""
};
class tt extends pe {
  constructor(e = {}) {
    super(e);
    x(this, "roomID");
    x(this, "sourceIDs");
    x(this, "receiverIDs");
    x(this, "maxReflectionOrder");
    x(this, "frequencies");
    x(this, "levelTimeProgression");
    x(this, "impulseResponseResult");
    x(this, "_visualizationMode");
    x(this, "_showAllBeams");
    x(this, "_visibleOrders");
    x(this, "_plotFrequency");
    x(this, "_plotOrders");
    // Internal beam-trace solver instance
    x(this, "btSolver", null);
    x(this, "polygons", []);
    x(this, "surfaceToPolygonIndex", /* @__PURE__ */ new Map());
    x(this, "polygonToSurface", /* @__PURE__ */ new Map());
    // Results
    x(this, "validPaths", []);
    x(this, "impulseResponse");
    x(this, "impulseResponsePlaying", !1);
    // Metrics
    x(this, "lastMetrics", null);
    // Group for virtual source meshes (replaces Points for reliable raycasting)
    x(this, "virtualSourcesGroup");
    // Map from virtual source mesh to beam data for click detection
    x(this, "virtualSourceMap", /* @__PURE__ */ new Map());
    // Currently selected virtual source mesh
    x(this, "selectedVirtualSource", null);
    // Click handler cleanup
    x(this, "clickHandler", null);
    x(this, "hoverHandler", null);
    // Selected path highlight (for LTP chart click interaction)
    x(this, "selectedPath");
    x(this, "selectedBeamsGroup");
    // Ambisonic impulse response storage
    x(this, "ambisonicImpulseResponse");
    x(this, "ambisonicOrder", 1);
    const o = { ...et, ...e };
    if (this.kind = "beam-trace", this.uuid = o.uuid || z(), this.name = o.name, this.roomID = o.roomID, this.sourceIDs = o.sourceIDs, this.receiverIDs = o.receiverIDs, this.maxReflectionOrder = o.maxReflectionOrder, this.frequencies = o.frequencies, this._visualizationMode = o.visualizationMode, this._showAllBeams = o.showAllBeams, this._visibleOrders = o.visibleOrders.length > 0 ? o.visibleOrders : Array.from({ length: o.maxReflectionOrder + 1 }, (n, r) => r), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: o.maxReflectionOrder + 1 }, (n, r) => r), this.levelTimeProgression = o.levelTimeProgression || z(), this.impulseResponseResult = o.impulseResponseResult || z(), !this.roomID) {
      const n = ve();
      n.length > 0 && (this.roomID = n[0].uuid);
    }
    A("ADD_RESULT", {
      kind: N.LevelTimeProgression,
      data: [],
      info: {
        initialSPL: [100],
        frequency: [this._plotFrequency],
        maxOrder: this.maxReflectionOrder
      },
      name: `LTP - ${this.name}`,
      uuid: this.levelTimeProgression,
      from: this.uuid
    }), A("ADD_RESULT", {
      kind: N.ImpulseResponse,
      data: [],
      info: {
        sampleRate: 44100,
        sourceName: "",
        receiverName: "",
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR - ${this.name}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    }), this.selectedPath = Xe(), D.markup.add(this.selectedPath), this.selectedBeamsGroup = new P.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", D.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new P.Group(), this.virtualSourcesGroup.name = "virtual-sources", D.markup.add(this.virtualSourcesGroup);
  }
  save() {
    return {
      ...Pe([
        "name",
        "kind",
        "uuid",
        "autoCalculate",
        "roomID",
        "sourceIDs",
        "receiverIDs",
        "maxReflectionOrder",
        "frequencies",
        "levelTimeProgression",
        "impulseResponseResult"
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (o, n) => n), this.frequencies = e.frequencies, this.levelTimeProgression = e.levelTimeProgression || z(), this.impulseResponseResult = e.impulseResponseResult || z(), this;
  }
  dispose() {
    this.clearVisualization(), this.removeClickHandler(), D.markup.remove(this.selectedPath), D.markup.remove(this.selectedBeamsGroup), D.markup.remove(this.virtualSourcesGroup), A("REMOVE_RESULT", this.levelTimeProgression), A("REMOVE_RESULT", this.impulseResponseResult);
  }
  setupClickHandler() {
    this.removeClickHandler();
    const e = D.renderer.domElement, o = (n) => {
      const r = e.getBoundingClientRect();
      return new P.Vector2(
        (n.clientX - r.left) / r.width * 2 - 1,
        -((n.clientY - r.top) / r.height) * 2 + 1
      );
    };
    this.hoverHandler = (n) => {
      if (this.virtualSourceMap.size === 0) {
        e.style.cursor = "default";
        return;
      }
      const r = o(n), a = new P.Raycaster();
      a.setFromCamera(r, D.camera);
      const l = Array.from(this.virtualSourceMap.keys());
      a.intersectObjects(l).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (n) => {
      if (n.button !== 0 || this.virtualSourceMap.size === 0) return;
      const r = o(n), a = new P.Raycaster();
      a.setFromCamera(r, D.camera);
      const l = Array.from(this.virtualSourceMap.keys()), i = a.intersectObjects(l);
      if (i.length > 0) {
        const c = i[0].object, h = this.virtualSourceMap.get(c);
        h && (this.selectedVirtualSource === c ? (this.selectedVirtualSource = null, this.clearSelectedBeams()) : (this.selectedVirtualSource = c, this.highlightVirtualSourcePath(h)));
      }
    }, e.addEventListener("click", this.clickHandler), e.addEventListener("mousemove", this.hoverHandler);
  }
  // Highlight the ray path from a clicked virtual source to the receiver
  // beam contains polygonPath which is the sequence of polygon IDs for reflections
  highlightVirtualSourcePath(e) {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const o = L(e.reflectionOrder, this.maxReflectionOrder), n = new P.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const r = k.getState().containers[this.receiverIDs[0]];
    if (!r) return;
    const a = r.position.clone(), l = new P.LineDashedMaterial({
      color: o,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), i = new P.BufferGeometry().setFromPoints([n, a]), c = new P.Line(i, l);
    c.computeLineDistances(), this.selectedBeamsGroup.add(c);
    const h = new P.SphereGeometry(0.18, 16, 16), d = new P.MeshBasicMaterial({
      color: o,
      transparent: !0,
      opacity: 0.4
    }), f = new P.Mesh(h, d);
    f.position.copy(n), this.selectedBeamsGroup.add(f);
    const p = e.polygonPath;
    if (!p || p.length === 0) return;
    const m = e.reflectionOrder;
    for (const g of this.validPaths) {
      const b = g.order;
      if (b !== m) continue;
      let I = !0;
      for (let R = 0; R < p.length; R++) {
        const y = b - R;
        if (g.polygonIds[y] !== p[R]) {
          I = !1;
          break;
        }
      }
      if (I) {
        const R = g.points, y = g.order;
        for (let S = 0; S < R.length - 1; S++) {
          const M = R[S], T = R[S + 1], F = M.distanceTo(T), E = new P.Vector3().addVectors(M, T).multiplyScalar(0.5), _ = y - S, le = _ === 0 ? 16777215 : L(_, this.maxReflectionOrder), ce = new P.CylinderGeometry(0.025, 0.025, F, 8), ue = new P.MeshBasicMaterial({ color: le }), H = new P.Mesh(ce, ue);
          H.position.copy(E);
          const he = new P.Vector3().subVectors(T, M).normalize(), q = new P.Quaternion();
          q.setFromUnitVectors(new P.Vector3(0, 1, 0), he), H.setRotationFromQuaternion(q), this.selectedBeamsGroup.add(H);
        }
        for (let S = 1; S < g.points.length - 1; S++) {
          const M = y - S + 1, T = L(M, this.maxReflectionOrder), F = new P.SphereGeometry(0.08, 12, 12), E = new P.MeshBasicMaterial({ color: T }), _ = new P.Mesh(F, E);
          _.position.copy(g.points[S]), this.selectedBeamsGroup.add(_);
        }
        D.needsToRender = !0;
        return;
      }
    }
    D.needsToRender = !0;
  }
  removeClickHandler() {
    const e = D.renderer.domElement;
    this.clickHandler && (e.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.hoverHandler && (e.removeEventListener("mousemove", this.hoverHandler), this.hoverHandler = null, e.style.cursor = "default");
  }
  // Convert room surfaces to beam-trace Polygon3D format
  extractPolygons() {
    const e = this.room;
    if (!e) return [];
    const o = [];
    return this.surfaceToPolygonIndex.clear(), this.polygonToSurface.clear(), e.allSurfaces.forEach((n) => {
      const r = this.surfaceToPolygons(n), a = o.length;
      r.forEach((l, i) => {
        this.polygonToSurface.set(a + i, n), o.push(l);
      }), this.surfaceToPolygonIndex.set(
        n.uuid,
        r.map((l, i) => a + i)
      );
    }), o;
  }
  // Convert a Surface to Polygon3D objects
  surfaceToPolygons(e) {
    const o = [], n = e.geometry, r = n.getAttribute("position");
    if (!r) return o;
    e.updateMatrixWorld(!0);
    const a = e.matrixWorld, l = n.getIndex(), i = r.array, c = (h, d, f) => {
      const p = new P.Vector3(
        i[h * 3],
        i[h * 3 + 1],
        i[h * 3 + 2]
      ).applyMatrix4(a), m = new P.Vector3(
        i[d * 3],
        i[d * 3 + 1],
        i[d * 3 + 2]
      ).applyMatrix4(a), g = new P.Vector3(
        i[f * 3],
        i[f * 3 + 1],
        i[f * 3 + 2]
      ).applyMatrix4(a), b = [
        [p.x, p.y, p.z],
        [m.x, m.y, m.z],
        [g.x, g.y, g.z]
      ], I = w.create(b);
      o.push(I);
    };
    if (l) {
      const h = l.array;
      for (let d = 0; d < h.length; d += 3)
        c(h[d], h[d + 1], h[d + 2]);
    } else {
      const h = r.count;
      for (let d = 0; d < h; d += 3)
        c(d, d + 1, d + 2);
    }
    return o;
  }
  // Build/rebuild the beam-trace solver
  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const e = k.getState().containers[this.sourceIDs[0]];
    if (!e) {
      console.warn("BeamTraceSolver: Source not found");
      return;
    }
    if (this.polygons = this.extractPolygons(), this.polygons.length === 0) {
      console.warn("BeamTraceSolver: No polygons extracted from room");
      return;
    }
    const o = [
      e.position.x,
      e.position.y,
      e.position.z
    ], n = new Ye(o);
    this.btSolver = new Qe(this.polygons, n, {
      maxReflectionOrder: this.maxReflectionOrder
    }), console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
  }
  // Calculate paths to all receivers
  calculate() {
    if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: Need at least one source and one receiver");
      return;
    }
    if (this.buildSolver(), !this.btSolver) {
      console.warn("BeamTraceSolver: Solver not built");
      return;
    }
    switch (this.validPaths = [], this.clearVisualization(), this.receiverIDs.forEach((e) => {
      const o = k.getState().containers[e];
      if (!o) return;
      const n = [
        o.position.x,
        o.position.y,
        o.position.z
      ], r = this.btSolver.getPaths(n);
      this.lastMetrics = this.btSolver.getMetrics(), r.forEach((a) => {
        const l = this.convertPath(a);
        this.validPaths.push(l);
      });
    }), this.validPaths.sort((e, o) => e.arrivalTime - o.arrivalTime), this._visualizationMode) {
      case "rays":
        this.drawPaths();
        break;
      case "beams":
        this.drawBeams();
        break;
      case "both":
        this.drawPaths(), this.drawBeams();
        break;
    }
    this.calculateLTP(343), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), D.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e) {
    const o = e.map((c) => new P.Vector3(c.position[0], c.position[1], c.position[2])), n = ae(e), r = qe(e), a = Ue(e), l = e.map((c) => c.polygonId);
    let i;
    return o.length >= 2 ? i = new P.Vector3().subVectors(o[0], o[1]).normalize().negate() : i = new P.Vector3(0, 0, 1), { points: o, order: a, length: n, arrivalTime: r, polygonIds: l, arrivalDirection: i };
  }
  // Calculate Level Time Progression result
  calculateLTP(e = 343) {
    if (this.validPaths.length === 0) return;
    const o = [...this.validPaths].sort((r, a) => r.arrivalTime - a.arrivalTime), n = { ...U.getState().results[this.levelTimeProgression] };
    n.data = [], n.info = {
      ...n.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };
    for (let r = 0; r < o.length; r++) {
      const a = o[r], l = this.calculateArrivalPressure(n.info.initialSPL, a), i = j(l);
      n.data.push({
        time: a.arrivalTime,
        pressure: i,
        arrival: r + 1,
        order: a.order,
        uuid: `${this.uuid}-path-${r}`
      });
    }
    A("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: n });
  }
  // Clear LTP data
  clearLevelTimeProgressionData() {
    const e = { ...U.getState().results[this.levelTimeProgression] };
    e.data = [], A("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  // Setter for plot frequency (recalculates LTP when changed)
  set plotFrequency(e) {
    this._plotFrequency = e, this.calculateLTP(343);
  }
  get plotFrequency() {
    return this._plotFrequency;
  }
  // Plot orders for LTP chart filtering (mirrors ImageSourceSolver API)
  get plotOrders() {
    return this._plotOrders;
  }
  set plotOrders(e) {
    this._plotOrders = e;
  }
  // Toggle ray path highlight when clicking on LTP chart bar
  // uuid format is `${this.uuid}-path-${index}` from calculateLTP
  toggleRayPathHighlight(e) {
    const o = e.match(/-path-(\d+)$/);
    if (!o) {
      console.warn("BeamTraceSolver: Invalid path UUID format:", e);
      return;
    }
    const n = parseInt(o[1], 10);
    this.highlightPathByIndex(n);
  }
  // Visualization methods
  clearVisualization() {
    D.markup.clearLines(), D.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
  }
  drawPaths() {
    this.validPaths.filter((n) => this._visibleOrders.includes(n.order)).forEach((n) => {
      const r = L(n.order, this.maxReflectionOrder), a = (r >> 16 & 255) / 255, l = (r >> 8 & 255) / 255, i = (r & 255) / 255, c = [a, l, i];
      for (let h = 0; h < n.points.length - 1; h++) {
        const d = n.points[h], f = n.points[h + 1];
        D.markup.addLine(
          [d.x, d.y, d.z],
          [f.x, f.y, f.z],
          c,
          c
        );
      }
    });
    const o = D.markup.getUsageStats();
    this.lastMetrics && (this.lastMetrics.bufferUsage = o), o.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${o.linesUsed}/${o.linesCapacity}. Reduce reflection order.`) : o.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${o.linesPercent.toFixed(1)}%`);
  }
  drawBeams() {
    if (!this.btSolver) return;
    this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
    const e = this.validPaths, o = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      const a = r.polygonIds.filter((l) => l !== null).join(",");
      a && o.set(a, r);
    }), this.btSolver.getBeamsForVisualization(this.maxReflectionOrder).forEach((r) => {
      if (!this._visibleOrders.includes(r.reflectionOrder))
        return;
      const a = this.beamHasValidPath(r, e);
      if (!a && !this._showAllBeams)
        return;
      const l = Math.max(0.05, 0.1 - r.reflectionOrder * 0.01), i = L(r.reflectionOrder, this.maxReflectionOrder);
      let c = i;
      if (!a) {
        const m = (i >> 16 & 255) * 0.4 + 76.8, g = (i >> 8 & 255) * 0.4 + 128 * 0.6, b = (i & 255) * 0.4 + 128 * 0.6;
        c = Math.round(m) << 16 | Math.round(g) << 8 | Math.round(b);
      }
      const h = new P.Vector3(r.virtualSource[0], r.virtualSource[1], r.virtualSource[2]), d = new P.SphereGeometry(l, 12, 12), f = new P.MeshStandardMaterial({
        color: c,
        transparent: !a,
        opacity: a ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), p = new P.Mesh(d, f);
      p.position.copy(h), this.virtualSourcesGroup.add(p), a && this.virtualSourceMap.set(p, {
        ...r,
        polygonPath: r.polygonPath || []
      });
    }), this.setupClickHandler(), D.needsToRender = !0;
  }
  // Check if a beam has a valid path to the receiver
  beamHasValidPath(e, o) {
    const n = e.polygonPath;
    if (!n || n.length === 0) return !1;
    const r = e.reflectionOrder;
    for (const a of o) {
      if (a.order !== r) continue;
      let l = !0;
      for (let i = 0; i < n.length; i++) {
        const c = r - i;
        if (a.polygonIds[c] !== n[i]) {
          l = !1;
          break;
        }
      }
      if (l) return !0;
    }
    return !1;
  }
  // Clear virtual source meshes
  clearVirtualSources() {
    var e;
    for (; this.virtualSourcesGroup.children.length > 0; ) {
      const o = this.virtualSourcesGroup.children[0];
      if (this.virtualSourcesGroup.remove(o), o instanceof P.Mesh) {
        (e = o.geometry) == null || e.dispose();
        const n = o.material;
        if (Array.isArray(n))
          for (const r of n)
            r instanceof P.Material && r.dispose();
        else n instanceof P.Material && n.dispose();
      }
    }
  }
  // Calculate impulse response
  async calculateImpulseResponse() {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const e = B.sampleRate, n = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05, a = Math.floor(e * r) * 2, l = [];
    for (let h = 0; h < this.frequencies.length; h++)
      l.push(new Float32Array(a));
    for (const h of this.validPaths) {
      const d = Math.random() > 0.5 ? 1 : -1, f = this.calculateArrivalPressure(n, h), p = Math.floor(h.arrivalTime * e);
      for (let m = 0; m < this.frequencies.length; m++)
        p < l[m].length && (l[m][p] += f[m] * d);
    }
    const c = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((h, d) => {
      c.postMessage({ samples: l }), c.onmessage = (f) => {
        const p = f.data.samples, m = new Float32Array(p[0].length >> 1);
        let g = 0;
        for (let y = 0; y < p.length; y++)
          for (let S = 0; S < m.length; S++)
            m[S] += p[y][S], Math.abs(m[S]) > g && (g = Math.abs(m[S]));
        const b = W(m), I = B.createOfflineContext(1, m.length, e), R = B.createBufferSource(b, I);
        R.connect(I.destination), R.start(), B.renderContextAsync(I).then((y) => {
          this.impulseResponse = y, this.updateImpulseResponseResult(y, e), h(y);
        }).catch(d).finally(() => c.terminate());
      }, c.onerror = (f) => {
        c.terminate(), d(f);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, o) {
    const n = ye(K(e));
    o.polygonIds.forEach((l) => {
      if (l === null) return;
      const i = this.polygonToSurface.get(l);
      if (i)
        for (let c = 0; c < this.frequencies.length; c++) {
          const h = 1 - i.absorptionFunction(this.frequencies[c]);
          n[c] *= h;
        }
    });
    const r = j(Se(n)), a = be(this.frequencies);
    for (let l = 0; l < this.frequencies.length; l++)
      r[l] -= a[l] * o.length;
    return K(r);
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, o) {
    var d, f;
    const n = k.getState().containers, r = this.sourceIDs.length > 0 && ((d = n[this.sourceIDs[0]]) == null ? void 0 : d.name) || "source", a = this.receiverIDs.length > 0 && ((f = n[this.receiverIDs[0]]) == null ? void 0 : f.name) || "receiver", l = e.getChannelData(0), i = [], c = Math.max(1, Math.floor(l.length / 2e3));
    for (let p = 0; p < l.length; p += c)
      i.push({
        time: p / o,
        amplitude: l[p]
      });
    console.log(`BeamTraceSolver: Updating IR result with ${i.length} samples, duration: ${(l.length / o).toFixed(3)}s`);
    const h = {
      kind: N.ImpulseResponse,
      data: i,
      info: {
        sampleRate: o,
        sourceName: r,
        receiverName: a,
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR: ${r} → ${a}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    };
    A("UPDATE_RESULT", { uuid: this.impulseResponseResult, result: h });
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse(), B.context.state === "suspended" && B.context.resume();
    const e = B.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(B.context.destination), e.start(), A("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(B.context.destination), A("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, o = B.sampleRate) {
    this.impulseResponse || await this.calculateImpulseResponse();
    const n = Z([W(this.impulseResponse.getChannelData(0))], { sampleRate: o, bitDepth: 32 }), r = e.endsWith(".wav") ? "" : ".wav";
    Y.saveAs(n, e + r);
  }
  /**
   * Calculate an ambisonic impulse response from the beam-traced paths.
   * Each reflection is encoded based on its arrival direction at the receiver.
   *
   * @param order - Ambisonic order (1 = first order with 4 channels, 2 = 9 channels, etc.)
   * @returns Promise resolving to an AudioBuffer with ambisonic channels
   */
  async calculateAmbisonicImpulseResponse(e = 1) {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const o = B.sampleRate, r = Array(this.frequencies.length).fill(100), a = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (a <= 0) throw new Error("Invalid impulse response duration");
    const l = Math.floor(o * a) * 2;
    if (l < 2) throw new Error("Impulse response too short to process");
    const i = we(e), c = [];
    for (let d = 0; d < this.frequencies.length; d++) {
      c.push([]);
      for (let f = 0; f < i; f++)
        c[d].push(new Float32Array(l));
    }
    for (const d of this.validPaths) {
      const f = Math.random() > 0.5 ? 1 : -1, p = this.calculateArrivalPressure(r, d), m = Math.floor(d.arrivalTime * o);
      if (m >= l) continue;
      const g = d.arrivalDirection, b = new Float32Array(1);
      for (let I = 0; I < this.frequencies.length; I++) {
        b[0] = p[I] * f;
        const R = De(b, g.x, g.y, g.z, e, "threejs");
        for (let y = 0; y < i; y++)
          c[I][y][m] += R[y][0];
      }
    }
    const h = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((d, f) => {
      const p = async (m) => new Promise((g) => {
        const b = [];
        for (let R = 0; R < this.frequencies.length; R++)
          b.push(c[R][m]);
        const I = h();
        I.postMessage({ samples: b }), I.onmessage = (R) => {
          const y = R.data.samples, S = new Float32Array(y[0].length >> 1);
          for (let M = 0; M < y.length; M++)
            for (let T = 0; T < S.length; T++)
              S[T] += y[M][T];
          I.terminate(), g(S);
        };
      });
      Promise.all(
        Array.from({ length: i }, (m, g) => p(g))
      ).then((m) => {
        let g = 0;
        for (const y of m)
          for (let S = 0; S < y.length; S++)
            Math.abs(y[S]) > g && (g = Math.abs(y[S]));
        if (g > 0)
          for (const y of m)
            for (let S = 0; S < y.length; S++)
              y[S] /= g;
        const b = m[0].length;
        if (b === 0) {
          f(new Error("Filtered signal has zero length"));
          return;
        }
        const R = B.createOfflineContext(i, b, o).createBuffer(i, b, o);
        for (let y = 0; y < i; y++)
          R.copyToChannel(new Float32Array(m[y]), y);
        this.ambisonicImpulseResponse = R, this.ambisonicOrder = e, d(R);
      }).catch(f);
    });
  }
  /**
   * Download the ambisonic impulse response as a multi-channel WAV file.
   * Channels are in ACN order with N3D normalization.
   *
   * @param filename - Output filename (without extension)
   * @param order - Ambisonic order (default: 1)
   */
  async downloadAmbisonicImpulseResponse(e, o = 1) {
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== o) && await this.calculateAmbisonicImpulseResponse(o);
    const n = this.ambisonicImpulseResponse.numberOfChannels, r = this.ambisonicImpulseResponse.sampleRate, a = [];
    for (let h = 0; h < n; h++)
      a.push(this.ambisonicImpulseResponse.getChannelData(h));
    const l = Z(a, { sampleRate: r, bitDepth: 32 }), i = e.endsWith(".wav") ? "" : ".wav", c = o === 1 ? "FOA" : `HOA${o}`;
    Y.saveAs(l, `${e}_${c}${i}`);
  }
  // Clear results
  reset() {
    this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), D.needsToRender = !0;
  }
  // Helper to clear highlighted beam lines
  clearSelectedBeams() {
    var e;
    for (; this.selectedBeamsGroup.children.length > 0; ) {
      const o = this.selectedBeamsGroup.children[0];
      this.selectedBeamsGroup.remove(o), (o instanceof P.Mesh || o instanceof P.Line) && ((e = o.geometry) == null || e.dispose(), o.material instanceof P.Material && o.material.dispose());
    }
  }
  // Getters and setters
  get room() {
    return k.getState().containers[this.roomID];
  }
  get sources() {
    return this.sourceIDs.map((e) => k.getState().containers[e]).filter(Boolean);
  }
  get receivers() {
    return this.receiverIDs.map((e) => k.getState().containers[e]).filter(Boolean);
  }
  get numValidPaths() {
    return this.validPaths.length;
  }
  set maxReflectionOrderReset(e) {
    this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (o, n) => n), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (o, n) => n), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), A("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
  }
  get maxReflectionOrderReset() {
    return this.maxReflectionOrder;
  }
  get visualizationMode() {
    return this._visualizationMode;
  }
  set visualizationMode(e) {
    switch (this._visualizationMode = e, this.clearVisualization(), e) {
      case "rays":
        this.validPaths.length > 0 && this.drawPaths();
        break;
      case "beams":
        this.btSolver && this.drawBeams();
        break;
      case "both":
        this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams();
        break;
    }
    D.needsToRender = !0;
  }
  // Show all beams toggle (including invalid/orphaned beams)
  get showAllBeams() {
    return this._showAllBeams;
  }
  set showAllBeams(e) {
    this._showAllBeams = e, (this._visualizationMode === "beams" || this._visualizationMode === "both") && (this.clearVisualization(), this._visualizationMode === "both" && this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams(), D.needsToRender = !0);
  }
  // Visible reflection orders for filtering visualization
  get visibleOrders() {
    return this._visibleOrders;
  }
  set visibleOrders(e) {
    switch (this._visibleOrders = e, this.clearVisualization(), this._visualizationMode) {
      case "rays":
        this.validPaths.length > 0 && this.drawPaths();
        break;
      case "beams":
        this.btSolver && this.drawBeams();
        break;
      case "both":
        this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams();
        break;
    }
    D.needsToRender = !0;
  }
  // Debug a specific beam path by polygon IDs
  debugBeamPath(e) {
    if (!this.btSolver) {
      console.warn("BeamTraceSolver: No solver built. Run calculate() first.");
      return;
    }
    if (this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: No receiver selected for debugging.");
      return;
    }
    const o = k.getState().containers[this.receiverIDs[0]];
    if (!o) {
      console.warn("BeamTraceSolver: Receiver not found.");
      return;
    }
    const n = [
      o.position.x,
      o.position.y,
      o.position.z
    ];
    console.group(`🔍 Debugging beam path: [${e.join(" → ")}]`), this.btSolver.debugBeamPath(n, e), console.groupEnd();
  }
  // Enable/disable BSP debug output (placeholder - setBSPDebug not exported from beam-trace)
  setBSPDebug(e) {
    console.log(`BeamTraceSolver: BSP debug ${e ? "enabled" : "disabled"} (note: requires beam-trace package update to export setBSPDebug)`);
  }
  // Get detailed paths with reflection information
  getDetailedPaths() {
    if (!this.btSolver)
      return console.warn("BeamTraceSolver: No solver built. Run calculate() first."), [];
    if (this.receiverIDs.length === 0)
      return console.warn("BeamTraceSolver: No receiver selected."), [];
    const e = k.getState().containers[this.receiverIDs[0]];
    if (!e)
      return console.warn("BeamTraceSolver: Receiver not found."), [];
    const o = [
      e.position.x,
      e.position.y,
      e.position.z
    ];
    return this.btSolver.getDetailedPaths(o);
  }
  // Highlight a specific path by index (for interactive selection)
  highlightPathByIndex(e) {
    const o = [...this.validPaths].sort((l, i) => l.arrivalTime - i.arrivalTime);
    if (e < 0 || e >= o.length) {
      console.warn("BeamTraceSolver: Path index out of bounds:", e);
      return;
    }
    const n = o[e];
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const r = L(n.order, this.maxReflectionOrder), a = new P.LineBasicMaterial({
      color: r,
      linewidth: 2,
      transparent: !1
    });
    for (let l = 0; l < n.points.length - 1; l++) {
      const i = new P.BufferGeometry().setFromPoints([
        n.points[l],
        n.points[l + 1]
      ]), c = new P.Line(i, a);
      this.selectedBeamsGroup.add(c);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const l = k.getState().containers[this.receiverIDs[0]];
      if (l) {
        const i = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), c = n.polygonIds[n.order];
        if (c !== null) {
          const h = i.find(
            (d) => d.polygonId === c && d.reflectionOrder === n.order
          );
          if (h) {
            const d = new P.LineDashedMaterial({
              color: r,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), f = new P.Vector3(
              h.virtualSource[0],
              h.virtualSource[1],
              h.virtualSource[2]
            ), p = l.position.clone(), m = new P.BufferGeometry().setFromPoints([f, p]), g = new P.Line(m, d);
            g.computeLineDistances(), this.selectedBeamsGroup.add(g);
          }
        }
      }
    }
    console.log(`BeamTraceSolver: Highlighting path ${e} with order ${n.order}, arrival time ${n.arrivalTime.toFixed(4)}s`), D.needsToRender = !0;
  }
  // Clear the current path highlight
  clearPathHighlight() {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), D.needsToRender = !0;
  }
}
$("BEAMTRACE_SET_PROPERTY", Ie);
$("REMOVE_BEAMTRACE", Re);
$("ADD_BEAMTRACE", xe(tt));
$("BEAMTRACE_CALCULATE", (t) => {
  V.getState().solvers[t].calculate(), setTimeout(() => A("BEAMTRACE_CALCULATE_COMPLETE", t), 0);
});
$("BEAMTRACE_RESET", (t) => {
  V.getState().solvers[t].reset();
});
$("BEAMTRACE_PLAY_IR", (t) => {
  V.getState().solvers[t].playImpulseResponse().catch((e) => {
    window.alert(e.message || "Failed to play impulse response");
  });
});
$("BEAMTRACE_DOWNLOAD_IR", (t) => {
  var a, l;
  const s = V.getState().solvers[t], e = k.getState().containers, o = s.sourceIDs.length > 0 && ((a = e[s.sourceIDs[0]]) == null ? void 0 : a.name) || "source", n = s.receiverIDs.length > 0 && ((l = e[s.receiverIDs[0]]) == null ? void 0 : l.name) || "receiver", r = `ir-beamtrace-${o}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  s.downloadImpulseResponse(r).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
$("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: t, order: s }) => {
  var l, i;
  const e = V.getState().solvers[t], o = k.getState().containers, n = e.sourceIDs.length > 0 && ((l = o[e.sourceIDs[0]]) == null ? void 0 : l.name) || "source", r = e.receiverIDs.length > 0 && ((i = o[e.receiverIDs[0]]) == null ? void 0 : i.name) || "receiver", a = `ir-beamtrace-ambi-${n}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadAmbisonicImpulseResponse(a, s).catch((c) => {
    window.alert(c.message || "Failed to download ambisonic impulse response");
  });
});
$("SHOULD_ADD_BEAMTRACE", () => {
  A("ADD_BEAMTRACE", void 0);
});
export {
  tt as BeamTraceSolver,
  tt as default
};
//# sourceMappingURL=index-HUchO09H.mjs.map
