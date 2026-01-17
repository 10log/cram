import { S as ue } from "./solver-BY1W6uB-.mjs";
import * as v from "three";
import { MeshLine as he, MeshLineMaterial as de } from "three.meshline";
import { v as L, n as fe, e as T, R as V, r as R, p as pe, k as B, q as G, s as q, w as M, y as U, z as me, L as j, I as ge, A as ve, x as W, F as K, a1 as Q, o as F, B as Pe, C as ye, D as Se, f as _ } from "./index-BaH-Rmpc.mjs";
import { e as be, g as Ie } from "./ambisonics.es-Ci32Q6qr.mjs";
const u = {
  /**
   * Create a new Vector3
   */
  create(s, e, t) {
    return [s, e, t];
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
  clone(s) {
    return [s[0], s[1], s[2]];
  },
  /**
   * Add two vectors
   */
  add(s, e) {
    return [s[0] + e[0], s[1] + e[1], s[2] + e[2]];
  },
  /**
   * Subtract vector b from vector a
   */
  subtract(s, e) {
    return [s[0] - e[0], s[1] - e[1], s[2] - e[2]];
  },
  /**
   * Scale a vector by a scalar
   */
  scale(s, e) {
    return [s[0] * e, s[1] * e, s[2] * e];
  },
  /**
   * Negate a vector
   */
  negate(s) {
    return [-s[0], -s[1], -s[2]];
  },
  /**
   * Dot product of two vectors
   */
  dot(s, e) {
    return s[0] * e[0] + s[1] * e[1] + s[2] * e[2];
  },
  /**
   * Cross product of two vectors (a × b)
   */
  cross(s, e) {
    return [
      s[1] * e[2] - s[2] * e[1],
      s[2] * e[0] - s[0] * e[2],
      s[0] * e[1] - s[1] * e[0]
    ];
  },
  /**
   * Squared length of a vector
   */
  lengthSquared(s) {
    return s[0] * s[0] + s[1] * s[1] + s[2] * s[2];
  },
  /**
   * Length (magnitude) of a vector
   */
  length(s) {
    return Math.sqrt(u.lengthSquared(s));
  },
  /**
   * Normalize a vector to unit length
   * Returns zero vector if input has zero length
   */
  normalize(s) {
    const e = u.length(s);
    return e < 1e-10 ? [0, 0, 0] : [s[0] / e, s[1] / e, s[2] / e];
  },
  /**
   * Linear interpolation between two vectors
   */
  lerp(s, e, t) {
    return [
      s[0] + t * (e[0] - s[0]),
      s[1] + t * (e[1] - s[1]),
      s[2] + t * (e[2] - s[2])
    ];
  },
  /**
   * Distance between two points
   */
  distance(s, e) {
    return u.length(u.subtract(s, e));
  },
  /**
   * Squared distance between two points (faster than distance)
   */
  distanceSquared(s, e) {
    return u.lengthSquared(u.subtract(s, e));
  },
  /**
   * Check if two vectors are approximately equal
   */
  equals(s, e, t = 1e-10) {
    return Math.abs(s[0] - e[0]) < t && Math.abs(s[1] - e[1]) < t && Math.abs(s[2] - e[2]) < t;
  },
  /**
   * Component-wise minimum
   */
  min(s, e) {
    return [
      Math.min(s[0], e[0]),
      Math.min(s[1], e[1]),
      Math.min(s[2], e[2])
    ];
  },
  /**
   * Component-wise maximum
   */
  max(s, e) {
    return [
      Math.max(s[0], e[0]),
      Math.max(s[1], e[1]),
      Math.max(s[2], e[2])
    ];
  },
  /**
   * Reflect vector v across a plane with given normal
   * v' = v - 2(v·n)n
   */
  reflect(s, e) {
    const t = 2 * u.dot(s, e);
    return u.subtract(s, u.scale(e, t));
  },
  /**
   * Project vector a onto vector b
   */
  project(s, e) {
    const t = u.lengthSquared(e);
    if (t < 1e-10)
      return [0, 0, 0];
    const o = u.dot(s, e) / t;
    return u.scale(e, o);
  },
  /**
   * Get the component of a perpendicular to b
   */
  reject(s, e) {
    return u.subtract(s, u.project(s, e));
  },
  /**
   * Convert to string for debugging
   */
  toString(s, e = 4) {
    return `[${s[0].toFixed(e)}, ${s[1].toFixed(e)}, ${s[2].toFixed(e)}]`;
  }
}, g = {
  /**
   * Create a plane from a normal vector and a point on the plane
   */
  fromNormalAndPoint(s, e) {
    const t = u.normalize(s), o = -u.dot(t, e);
    return { a: t[0], b: t[1], c: t[2], d: o };
  },
  /**
   * Create a plane from three non-collinear points
   * Uses counter-clockwise winding order: normal points toward viewer when
   * p1 → p2 → p3 appears counter-clockwise
   */
  fromPoints(s, e, t) {
    const o = u.subtract(e, s), n = u.subtract(t, s), r = u.normalize(u.cross(o, n));
    return g.fromNormalAndPoint(r, s);
  },
  /**
   * Create a plane directly from coefficients
   */
  create(s, e, t, o) {
    return { a: s, b: e, c: t, d: o };
  },
  /**
   * Get the normal vector of the plane
   */
  normal(s) {
    return [s.a, s.b, s.c];
  },
  /**
   * Signed distance from a point to the plane
   * Positive = point is in front (on normal side)
   * Negative = point is behind
   * Zero = point is on the plane
   */
  signedDistance(s, e) {
    return e.a * s[0] + e.b * s[1] + e.c * s[2] + e.d;
  },
  /**
   * Absolute distance from a point to the plane
   */
  distance(s, e) {
    return Math.abs(g.signedDistance(s, e));
  },
  /**
   * Classify a point relative to the plane
   */
  classifyPoint(s, e, t = 1e-6) {
    const o = g.signedDistance(s, e);
    return o > t ? "front" : o < -t ? "back" : "on";
  },
  /**
   * Check if a point is in front of the plane
   */
  isPointInFront(s, e, t = 1e-6) {
    return g.signedDistance(s, e) > t;
  },
  /**
   * Check if a point is behind the plane
   */
  isPointBehind(s, e, t = 1e-6) {
    return g.signedDistance(s, e) < -t;
  },
  /**
   * Check if a point is on the plane
   */
  isPointOn(s, e, t = 1e-6) {
    return Math.abs(g.signedDistance(s, e)) <= t;
  },
  /**
   * Mirror a point across the plane
   * p' = p - 2 * signedDistance(p) * normal
   */
  mirrorPoint(s, e) {
    const t = g.signedDistance(s, e), o = g.normal(e);
    return u.subtract(s, u.scale(o, 2 * t));
  },
  /**
   * Mirror a plane across another plane (for fail plane propagation)
   * This mirrors two points on the source plane and reconstructs.
   */
  mirrorPlane(s, e) {
    const t = g.normal(s);
    let o;
    Math.abs(t[2]) > 0.5 ? o = [0, 0, -s.d / s.c] : Math.abs(t[1]) > 0.5 ? o = [0, -s.d / s.b, 0] : o = [-s.d / s.a, 0, 0];
    const n = Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], r = u.normalize(u.cross(t, n)), i = u.add(o, r), a = u.cross(t, r), l = u.add(o, a), c = g.mirrorPoint(o, e), h = g.mirrorPoint(i, e), p = g.mirrorPoint(l, e);
    return g.fromPoints(c, h, p);
  },
  /**
   * Flip the plane orientation (negate normal and d)
   */
  flip(s) {
    return { a: -s.a, b: -s.b, c: -s.c, d: -s.d };
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
  rayIntersection(s, e, t) {
    const o = g.normal(t), n = u.dot(o, e);
    return Math.abs(n) < 1e-10 ? null : -(u.dot(o, s) + t.d) / n;
  },
  /**
   * Get the point of intersection between a ray and plane
   */
  rayIntersectionPoint(s, e, t) {
    const o = g.rayIntersection(s, e, t);
    return o === null ? null : u.add(s, u.scale(e, o));
  },
  /**
   * Project a point onto the plane
   */
  projectPoint(s, e) {
    const t = g.signedDistance(s, e), o = g.normal(e);
    return u.subtract(s, u.scale(o, t));
  },
  /**
   * Check if two planes are approximately equal
   */
  equals(s, e, t = 1e-6) {
    const o = s.a * e.a + s.b * e.b + s.c * e.c;
    return Math.abs(o - 1) < t ? Math.abs(s.d - e.d) < t : Math.abs(o + 1) < t ? Math.abs(s.d + e.d) < t : !1;
  },
  /**
   * Convert to string for debugging
   */
  toString(s, e = 4) {
    return `Plane3D(${s.a.toFixed(e)}x + ${s.b.toFixed(e)}y + ${s.c.toFixed(e)}z + ${s.d.toFixed(e)} = 0)`;
  }
}, x = {
  /**
   * Create a polygon from vertices (computes plane automatically)
   * Vertices must be in counter-clockwise order when viewed from front
   */
  create(s, e) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    const t = s.map((n) => u.clone(n)), o = g.fromPoints(t[0], t[1], t[2]);
    return { vertices: t, plane: o, materialId: e };
  },
  /**
   * Create a polygon with an explicit plane (for split polygons that may be degenerate)
   */
  createWithPlane(s, e, t) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    return { vertices: s.map((n) => u.clone(n)), plane: e, materialId: t };
  },
  /**
   * Get the number of vertices
   */
  vertexCount(s) {
    return s.vertices.length;
  },
  /**
   * Compute the centroid (geometric center) of the polygon
   */
  centroid(s) {
    const e = [0, 0, 0];
    for (const o of s.vertices)
      e[0] += o[0], e[1] += o[1], e[2] += o[2];
    const t = s.vertices.length;
    return [e[0] / t, e[1] / t, e[2] / t];
  },
  /**
   * Compute the area of the polygon using cross product method
   */
  area(s) {
    if (s.vertices.length < 3)
      return 0;
    let e = [0, 0, 0];
    const t = s.vertices[0];
    for (let o = 1; o < s.vertices.length - 1; o++) {
      const n = s.vertices[o], r = s.vertices[o + 1], i = u.cross(u.subtract(n, t), u.subtract(r, t));
      e = u.add(e, i);
    }
    return 0.5 * u.length(e);
  },
  /**
   * Get the normal vector of the polygon (from the plane)
   */
  normal(s) {
    return g.normal(s.plane);
  },
  /**
   * Get edges as pairs of vertices [start, end]
   */
  edges(s) {
    const e = [];
    for (let t = 0; t < s.vertices.length; t++) {
      const o = (t + 1) % s.vertices.length;
      e.push([s.vertices[t], s.vertices[o]]);
    }
    return e;
  },
  /**
   * Classify the polygon relative to a plane
   */
  classify(s, e, t = 1e-6) {
    let o = 0, n = 0;
    for (const r of s.vertices) {
      const i = g.classifyPoint(r, e, t);
      i === "front" ? o++ : i === "back" && n++;
    }
    return o > 0 && n > 0 ? "spanning" : o > 0 ? "front" : n > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(s, e, t = 1e-6) {
    const o = g.normal(s.plane), n = s.vertices.length;
    for (let r = 0; r < n; r++) {
      const i = s.vertices[r], a = s.vertices[(r + 1) % n], l = u.subtract(a, i), c = u.subtract(e, i), h = u.cross(l, c);
      if (u.dot(h, o) < -t)
        return !1;
    }
    return !0;
  },
  /**
   * Ray-polygon intersection
   * Returns t parameter and intersection point, or null if no hit
   */
  rayIntersection(s, e, t) {
    const o = g.rayIntersection(s, e, t.plane);
    if (o === null || o < 0)
      return null;
    const n = u.add(s, u.scale(e, o));
    return x.containsPoint(t, n) ? { t: o, point: n } : null;
  },
  /**
   * Create a bounding box for the polygon
   */
  boundingBox(s) {
    const e = [1 / 0, 1 / 0, 1 / 0], t = [-1 / 0, -1 / 0, -1 / 0];
    for (const o of s.vertices)
      e[0] = Math.min(e[0], o[0]), e[1] = Math.min(e[1], o[1]), e[2] = Math.min(e[2], o[2]), t[0] = Math.max(t[0], o[0]), t[1] = Math.max(t[1], o[1]), t[2] = Math.max(t[2], o[2]);
    return { min: e, max: t };
  },
  /**
   * Check if polygon is degenerate (zero or near-zero area)
   */
  isDegenerate(s, e = 1e-10) {
    return s.vertices.length < 3 || x.area(s) < e;
  },
  /**
   * Flip the polygon winding (reverse vertex order and flip plane)
   */
  flip(s) {
    const e = [...s.vertices].reverse(), t = g.flip(s.plane);
    return {
      vertices: e,
      plane: t,
      materialId: s.materialId
    };
  },
  /**
   * Clone a polygon
   */
  clone(s) {
    return {
      vertices: s.vertices.map((e) => u.clone(e)),
      plane: { ...s.plane },
      materialId: s.materialId
    };
  },
  /**
   * Convert to string for debugging
   */
  toString(s) {
    const e = s.vertices.map((t) => u.toString(t, 2)).join(", ");
    return `Polygon3D(${s.vertices.length} vertices: [${e}])`;
  }
};
function Re(s, e, t = 1e-6) {
  const o = x.classify(s, e, t);
  if (o === "front" || o === "coplanar")
    return { front: s, back: null };
  if (o === "back")
    return { front: null, back: s };
  const n = [], r = [], i = s.vertices.length;
  for (let c = 0; c < i; c++) {
    const h = s.vertices[c], p = s.vertices[(c + 1) % i], f = g.signedDistance(h, e), d = g.signedDistance(p, e), m = f > t ? "front" : f < -t ? "back" : "on", P = d > t ? "front" : d < -t ? "back" : "on";
    if (m === "front" ? n.push(h) : (m === "back" || n.push(h), r.push(h)), m === "front" && P === "back" || m === "back" && P === "front") {
      const I = f / (f - d), b = u.lerp(h, p, I);
      n.push(b), r.push(b);
    }
  }
  const a = n.length >= 3 ? x.createWithPlane(n, s.plane, s.materialId) : null, l = r.length >= 3 ? x.createWithPlane(r, s.plane, s.materialId) : null;
  return { front: a, back: l };
}
function xe(s, e, t = 1e-6) {
  const o = s.vertices, n = [];
  if (o.length < 3)
    return null;
  for (let r = 0; r < o.length; r++) {
    const i = o[r], a = o[(r + 1) % o.length], l = g.signedDistance(i, e), c = g.signedDistance(a, e), h = l >= -t, p = c >= -t;
    if (h && n.push(i), h && !p || !h && p) {
      const f = l / (l - c), d = u.lerp(i, a, Math.max(0, Math.min(1, f)));
      n.push(d);
    }
  }
  return n.length < 3 ? null : x.createWithPlane(n, s.plane, s.materialId);
}
function we(s, e, t = 1e-6) {
  let o = s;
  for (const n of e) {
    if (!o)
      return null;
    o = xe(o, n, t);
  }
  return o;
}
function De(s, e, t = 1e-6) {
  for (const o of e) {
    let n = !0;
    for (const r of s.vertices)
      if (g.signedDistance(r, o) >= -t) {
        n = !1;
        break;
      }
    if (n)
      return !0;
  }
  return !1;
}
function Me(s) {
  if (s.length === 0)
    return null;
  const e = s.map((t, o) => ({
    polygon: t,
    originalId: o
  }));
  return H(e);
}
function H(s) {
  if (s.length === 0)
    return null;
  const e = Te(s), t = s[e], o = t.polygon.plane, n = [], r = [];
  for (let i = 0; i < s.length; i++) {
    if (i === e)
      continue;
    const a = s[i], { front: l, back: c } = Re(a.polygon, o);
    l && n.push({ polygon: l, originalId: a.originalId }), c && r.push({ polygon: c, originalId: a.originalId });
  }
  return {
    plane: o,
    polygon: t.polygon,
    polygonId: t.originalId,
    front: H(n),
    back: H(r)
  };
}
function Te(s) {
  if (s.length <= 3)
    return 0;
  let e = 0, t = 1 / 0;
  const o = Math.min(s.length, 10), n = Math.max(1, Math.floor(s.length / o));
  for (let r = 0; r < s.length; r += n) {
    const i = s[r].polygon.plane;
    let a = 0, l = 0, c = 0;
    for (let p = 0; p < s.length; p++) {
      if (r === p)
        continue;
      const f = x.classify(s[p].polygon, i);
      f === "front" ? a++ : f === "back" ? l++ : f === "spanning" && (a++, l++, c++);
    }
    const h = c * 8 + Math.abs(a - l);
    h < t && (t = h, e = r);
  }
  return e;
}
function O(s, e, t, o = 0, n = 1 / 0, r = -1) {
  if (!t)
    return null;
  const i = g.signedDistance(s, t.plane), a = g.normal(t.plane), l = u.dot(a, e);
  let c, h;
  i >= 0 ? (c = t.front, h = t.back) : (c = t.back, h = t.front);
  let p = null;
  Math.abs(l) > 1e-10 && (p = -i / l);
  let f = null;
  if (p === null || p < o) {
    if (f = O(s, e, c, o, n, r), !f && t.polygonId !== r) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, h, o, n, r));
  } else if (p > n) {
    if (f = O(s, e, c, o, n, r), !f && t.polygonId !== r) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, h, o, n, r));
  } else {
    if (f = O(s, e, c, o, p, r), !f && t.polygonId !== r) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, h, p, n, r));
  }
  return f;
}
function $(s, e, t, o, n, r) {
  if (!t)
    return null;
  const i = g.signedDistance(s, t.plane), a = g.normal(t.plane), l = u.dot(a, e);
  let c, h;
  i >= 0 ? (c = t.front, h = t.back) : (c = t.back, h = t.front);
  let p = null;
  Math.abs(l) > 1e-10 && (p = -i / l);
  let f = null;
  if (p === null || p < o) {
    if (f = $(s, e, c, o, n, r), !f && !r.has(t.polygonId)) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, h, o, n, r));
  } else if (p > n) {
    if (f = $(s, e, c, o, n, r), !f && !r.has(t.polygonId)) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, h, o, n, r));
  } else {
    if (f = $(s, e, c, o, p, r), !f && !r.has(t.polygonId)) {
      const d = x.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, h, p, n, r));
  }
  return f;
}
function X(s, e) {
  const t = [], o = x.edges(e), n = x.centroid(e);
  for (const [i, a] of o) {
    let l = g.fromPoints(s, i, a);
    g.signedDistance(n, l) < 0 && (l = g.flip(l)), t.push(l);
  }
  let r = e.plane;
  return g.signedDistance(s, r) > 0 && (r = g.flip(r)), t.push(r), t;
}
function J(s, e) {
  return g.mirrorPoint(s, e.plane);
}
function ee(s, e) {
  const t = x.centroid(s), o = u.subtract(e, t), n = g.normal(s.plane);
  return u.dot(n, o) > 0;
}
const Be = 1e-6;
function Ae(s, e, t) {
  const o = {
    id: -1,
    parent: null,
    virtualSource: u.clone(s),
    children: []
  };
  if (t >= 1)
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      if (!ee(i, s))
        continue;
      const a = J(s, i), l = X(a, i), c = {
        id: r,
        parent: o,
        virtualSource: a,
        aperture: x.clone(i),
        boundaryPlanes: l,
        children: []
      };
      o.children.push(c), t > 1 && te(c, e, 2, t);
    }
  const n = [];
  return se(o, n), {
    root: o,
    leafNodes: n,
    polygons: e,
    maxReflectionOrder: t
  };
}
function te(s, e, t, o) {
  if (!(t > o) && !(!s.boundaryPlanes || !s.aperture))
    for (let n = 0; n < e.length; n++) {
      if (n === s.id)
        continue;
      const r = e[n];
      if (De(r, s.boundaryPlanes) || !ee(r, s.virtualSource))
        continue;
      const i = we(r, s.boundaryPlanes);
      if (!i || x.area(i) < Be)
        continue;
      const l = J(s.virtualSource, r), c = X(l, i), h = {
        id: n,
        parent: s,
        virtualSource: l,
        aperture: i,
        boundaryPlanes: c,
        children: []
      };
      s.children.push(h), t < o && te(h, e, t + 1, o);
    }
}
function se(s, e) {
  s.children.length === 0 && s.id !== -1 && e.push(s);
  for (const t of s.children)
    se(t, e);
}
function ke(s) {
  oe(s.root);
}
function oe(s) {
  s.failPlane = void 0, s.failPlaneType = void 0;
  for (const e of s.children)
    oe(e);
}
function Fe(s, e, t) {
  if (!e.aperture || !e.boundaryPlanes)
    return null;
  let n = t[e.id].plane;
  if (g.signedDistance(e.virtualSource, n) < 0 && (n = g.flip(n)), g.signedDistance(s, n) < 0)
    return {
      plane: n,
      type: "polygon",
      nodeDepth: Z(e)
    };
  const r = e.boundaryPlanes.length - 1;
  for (let i = 0; i < e.boundaryPlanes.length; i++) {
    const a = e.boundaryPlanes[i];
    if (g.signedDistance(s, a) < 0) {
      const l = i < r ? "edge" : "aperture";
      return {
        plane: a,
        type: l,
        nodeDepth: Z(e)
      };
    }
  }
  return null;
}
function Z(s) {
  let e = 0, t = s;
  for (; t && t.id !== -1; )
    e++, t = t.parent;
  return e;
}
function $e(s, e) {
  return g.signedDistance(s, e) < 0;
}
const ne = 16;
function Oe(s, e = ne) {
  const t = [];
  for (let o = 0; o < s.length; o += e)
    t.push({
      id: t.length,
      nodes: s.slice(o, Math.min(o + e, s.length)),
      skipSphere: null
    });
  return t;
}
function Ee(s, e) {
  return u.distance(s, e.center) < e.radius;
}
function Ce(s, e) {
  return e.skipSphere ? Ee(s, e.skipSphere) ? "inside" : "outside" : "none";
}
function Le(s, e) {
  let t = 1 / 0;
  for (const o of e) {
    if (!o.failPlane)
      return null;
    const n = Math.abs(g.signedDistance(s, o.failPlane));
    t = Math.min(t, n);
  }
  return t === 1 / 0 || t <= 1e-10 ? null : {
    center: u.clone(s),
    radius: t
  };
}
function Y(s) {
  s.skipSphere = null;
}
function _e(s) {
  for (const e of s.nodes)
    e.failPlane = void 0, e.failPlaneType = void 0;
}
class ze {
  /**
   * Create a new 3D beam tracing solver
   *
   * @param polygons - Room geometry as an array of polygons
   * @param sourcePosition - Position of the sound source
   * @param config - Optional configuration
   */
  constructor(e, t, o = {}) {
    const n = o.maxReflectionOrder ?? 5, r = o.bucketSize ?? ne;
    this.polygons = e, this.sourcePosition = u.clone(t), this.bspRoot = Me(e), this.beamTree = Ae(t, e, n), this.buckets = Oe(this.beamTree.leafNodes, r), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
  }
  /**
   * Get all valid reflection paths from source to listener
   *
   * @param listenerPos - Position of the listener
   * @returns Array of valid reflection paths
   */
  getPaths(e) {
    this.resetMetrics();
    const t = [], o = this.validateDirectPath(e);
    o && t.push(o);
    const n = this.findIntermediatePaths(e, this.beamTree.root);
    t.push(...n);
    for (const r of this.buckets) {
      const i = Ce(e, r);
      if (i === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      i === "outside" && (Y(r), _e(r)), this.metrics.bucketsChecked++;
      let a = !0, l = !0;
      for (const c of r.nodes) {
        if (c.failPlane && $e(e, c.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        c.failPlane && (c.failPlane = void 0, c.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const h = this.validatePath(e, c);
        h.valid && h.path ? (t.push(h.path), a = !1, l = !1) : c.failPlane || (l = !1);
      }
      a && l && r.nodes.length > 0 && (r.skipSphere = Le(e, r.nodes), r.skipSphere && this.metrics.skipSphereCount++);
    }
    return this.metrics.validPathCount = t.length, t;
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
  getDetailedPaths(e) {
    return this.getPaths(e).map((o) => Ue(o, this.polygons));
  }
  /**
   * Validate the direct path from listener to source
   */
  validateDirectPath(e) {
    const t = u.subtract(this.sourcePosition, e), o = u.length(t), n = u.normalize(t);
    this.metrics.raycastCount++;
    const r = O(e, n, this.bspRoot, 0, o, -1);
    return r && r.t < o - 1e-6 ? null : [
      { position: u.clone(e), polygonId: null },
      { position: u.clone(this.sourcePosition), polygonId: null }
    ];
  }
  /**
   * Find paths through intermediate (non-leaf) nodes
   *
   * These are lower-order reflections that didn't spawn further children.
   */
  findIntermediatePaths(e, t) {
    const o = [];
    for (const n of t.children)
      n.children.length > 0 && o.push(...this.findIntermediatePaths(e, n));
    if (t.id !== -1 && t.aperture) {
      const n = this.traverseBeam(e, t);
      n && o.push(n);
    }
    return o;
  }
  /**
   * Traverse a beam from listener to source, building the reflection path
   */
  traverseBeam(e, t, o = !1) {
    const n = [
      { position: u.clone(e), polygonId: null }
    ], r = [];
    let i = t;
    for (; i && i.id !== -1; )
      r.unshift(i.id), i = i.parent;
    o && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${r.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
    let a = e, l = t;
    const c = /* @__PURE__ */ new Set();
    let h = 0;
    for (; l && l.id !== -1; ) {
      const p = this.polygons[l.id], f = l.virtualSource, d = u.normalize(u.subtract(f, a)), m = x.rayIntersection(a, d, p);
      if (!m)
        return o && console.log(`  [Segment ${h}] FAIL: No intersection with polygon ${l.id}`), null;
      o && (console.log(`  [Segment ${h}] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    Direction: [${d[0].toFixed(3)}, ${d[1].toFixed(3)}, ${d[2].toFixed(3)}]`), console.log(`    Hit polygon ${l.id} at t=${m.t.toFixed(3)}, point=[${m.point[0].toFixed(3)}, ${m.point[1].toFixed(3)}, ${m.point[2].toFixed(3)}]`)), c.add(l.id), this.metrics.raycastCount++;
      const P = $(a, d, this.bspRoot, 1e-6, m.t - 1e-6, c);
      if (P)
        return o && (console.log(`    OCCLUDED by polygon ${P.polygonId} at t=${P.t.toFixed(3)}, point=[${P.point[0].toFixed(3)}, ${P.point[1].toFixed(3)}, ${P.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), n.push({
        position: u.clone(m.point),
        polygonId: l.id
      }), a = m.point, l = l.parent, h++;
    }
    if (l) {
      const p = u.normalize(u.subtract(l.virtualSource, a)), f = u.distance(l.virtualSource, a);
      if (o) {
        console.log(`  [Final segment] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    To source: [${l.virtualSource[0].toFixed(3)}, ${l.virtualSource[1].toFixed(3)}, ${l.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${p[0].toFixed(3)}, ${p[1].toFixed(3)}, ${p[2].toFixed(3)}]`), console.log(`    Distance: ${f.toFixed(3)}`), console.log(`    tMin: ${1e-6}, tMax: ${(f - 1e-6).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
        const I = a, b = l.virtualSource;
        if (I[1] < 5.575 && b[1] > 5.575 || I[1] > 5.575 && b[1] < 5.575) {
          const y = (5.575 - I[1]) / (b[1] - I[1]), S = I[0] + y * (b[0] - I[0]), D = I[2] + y * (b[2] - I[2]);
          if (console.log(`    CROSSING y=5.575 at t=${y.toFixed(3)}, x=${S.toFixed(3)}, z=${D.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), S >= 6.215 && S <= 12.43 && D >= 0 && D <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const w of [3, 4]) {
              const E = this.polygons[w], A = x.rayIntersection(a, p, E);
              A ? console.log(`      Polygon ${w}: HIT at t=${A.t.toFixed(3)}, point=[${A.point[0].toFixed(3)}, ${A.point[1].toFixed(3)}, ${A.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${w}: NO HIT`), console.log(`        Vertices: ${E.vertices.map((k) => `[${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const d = 1e-6, m = f - 1e-6, P = $(a, p, this.bspRoot, d, m, c);
      if (P)
        return o && console.log(`    OCCLUDED by polygon ${P.polygonId} at t=${P.t.toFixed(3)}, point=[${P.point[0].toFixed(3)}, ${P.point[1].toFixed(3)}, ${P.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), n.push({
        position: u.clone(l.virtualSource),
        polygonId: null
      });
    }
    return n;
  }
  /**
   * Validate a path through a beam node
   */
  validatePath(e, t) {
    const o = this.traverseBeam(e, t);
    if (o)
      return { valid: !0, path: o };
    const n = Fe(e, t, this.polygons);
    return n && (t.failPlane = n.plane, t.failPlaneType = n.type), { valid: !1, path: null };
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
  debugBeamPath(e, t) {
    console.log("=== DEBUG BEAM PATH ==="), console.log(`Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`Polygon path: [${t.join(", ")}]`), console.log(`Source: [${this.sourcePosition[0].toFixed(3)}, ${this.sourcePosition[1].toFixed(3)}, ${this.sourcePosition[2].toFixed(3)}]`);
    const o = (i, a, l) => {
      if (l === a.length)
        return i;
      for (const c of i.children)
        if (c.id === a[l])
          return o(c, a, l + 1);
      return null;
    }, n = o(this.beamTree.root, t, 0);
    if (!n) {
      console.log("ERROR: Could not find beam node for this polygon path");
      return;
    }
    console.log(`Found beam node with virtual source: [${n.virtualSource[0].toFixed(3)}, ${n.virtualSource[1].toFixed(3)}, ${n.virtualSource[2].toFixed(3)}]`);
    const r = this.traverseBeam(e, n, !0);
    if (r) {
      console.log("PATH VALID - returned path:");
      for (let i = 0; i < r.length; i++) {
        const a = r[i];
        console.log(`  [${i}] pos=[${a.position[0].toFixed(3)}, ${a.position[1].toFixed(3)}, ${a.position[2].toFixed(3)}], polygonId=${a.polygonId}`);
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
    ke(this.beamTree);
    for (const e of this.buckets)
      Y(e);
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
  getBeamsForVisualization(e) {
    const t = [], o = e ?? this.beamTree.maxReflectionOrder, n = (r, i, a) => {
      if (i > o)
        return;
      const l = r.id !== -1 ? [...a, r.id] : a;
      r.id !== -1 && r.aperture && t.push({
        virtualSource: u.clone(r.virtualSource),
        apertureVertices: r.aperture.vertices.map((c) => u.clone(c)),
        reflectionOrder: i,
        polygonId: r.id,
        polygonPath: l
      });
      for (const c of r.children)
        n(c, i + 1, l);
    };
    return n(this.beamTree.root, 0, []), t;
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
    const e = this.metrics.totalLeafNodes, t = this.metrics.bucketsTotal;
    this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = e, this.metrics.bucketsTotal = t;
  }
}
function re(s) {
  let e = 0;
  for (let t = 1; t < s.length; t++)
    e += u.distance(s[t - 1].position, s[t].position);
  return e;
}
function Ve(s, e = 343) {
  return re(s) / e;
}
function He(s) {
  return s.filter((e) => e.polygonId !== null).length;
}
const Ne = 0.05;
function Ge(s, e) {
  const t = Math.abs(u.dot(u.negate(s), e)), o = Math.max(-1, Math.min(1, t));
  return Math.acos(o);
}
function qe(s, e) {
  const t = g.normal(s.plane);
  return u.dot(e, t) > 0 ? u.negate(t) : u.clone(t);
}
function Ue(s, e) {
  var a;
  if (s.length < 2)
    throw new Error("Path must have at least 2 points (listener and source)");
  const t = u.clone(s[0].position), o = u.clone(s[s.length - 1].position), n = [], r = [];
  let i = 0;
  for (let l = 0; l < s.length - 1; l++) {
    const c = s[l].position, h = s[l + 1].position, p = u.distance(c, h);
    r.push({
      startPoint: u.clone(c),
      endPoint: u.clone(h),
      length: p,
      segmentIndex: l
    });
    const f = s[l + 1].polygonId;
    if (f !== null) {
      const d = e[f], m = s[l + 1].position, P = u.normalize(u.subtract(m, c)), I = (a = s[l + 2]) == null ? void 0 : a.position;
      let b;
      I ? b = u.normalize(u.subtract(I, m)) : b = u.reflect(P, g.normal(d.plane));
      const y = qe(d, P), S = Ge(P, y), D = S;
      i += p;
      const w = Math.abs(S - Math.PI / 2) < Ne;
      n.push({
        polygon: d,
        polygonId: f,
        hitPoint: u.clone(m),
        incidenceAngle: S,
        reflectionAngle: D,
        incomingDirection: P,
        outgoingDirection: b,
        surfaceNormal: y,
        reflectionOrder: n.length + 1,
        cumulativeDistance: i,
        incomingSegmentLength: p,
        isGrazing: w
      });
    } else
      i += p;
  }
  return {
    listenerPosition: t,
    sourcePosition: o,
    totalPathLength: i,
    reflectionCount: n.length,
    reflections: n,
    segments: r,
    simplePath: s
  };
}
class je {
  constructor(e) {
    this.position = u.clone(e);
  }
}
class We {
  constructor(e, t, o) {
    this.source = t, this.solver = new ze(e, t.position, o);
  }
  /**
   * Get all valid reflection paths to a listener
   */
  getPaths(e) {
    const t = Array.isArray(e) ? e : e.position;
    return this.solver.getPaths(t);
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
  getDetailedPaths(e) {
    const t = Array.isArray(e) ? e : e.position;
    return this.solver.getDetailedPaths(t);
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
  getBeamsForVisualization(e) {
    return this.solver.getBeamsForVisualization(e);
  }
  /**
   * Debug a specific beam path by polygon IDs
   * Logs detailed information about the path validation process
   */
  debugBeamPath(e, t) {
    const o = Array.isArray(e) ? e : e.position;
    this.solver.debugBeamPath(o, t);
  }
}
function Ke() {
  const s = new he();
  s.setPoints([]);
  const e = new de({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new v.Mesh(s, e);
}
const Ze = Q.scale(["#ff8a0b", "#000080"]).mode("lch");
function C(s, e) {
  const t = e + 1, o = Ze.colors(t), n = Math.min(s, t - 1), r = Q(o[n]);
  return parseInt(r.hex().slice(1), 16);
}
const Ye = {
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
class Qe extends ue {
  constructor(e = {}) {
    super(e), this.btSolver = null, this.polygons = [], this.surfaceToPolygonIndex = /* @__PURE__ */ new Map(), this.polygonToSurface = /* @__PURE__ */ new Map(), this.validPaths = [], this.impulseResponsePlaying = !1, this.lastMetrics = null, this.virtualSourceMap = /* @__PURE__ */ new Map(), this.selectedVirtualSource = null, this.clickHandler = null, this.hoverHandler = null, this.ambisonicOrder = 1;
    const t = { ...Ye, ...e };
    if (this.kind = "beam-trace", this.uuid = t.uuid || L(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (o, n) => n), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (o, n) => n), this.levelTimeProgression = t.levelTimeProgression || L(), this.impulseResponseResult = t.impulseResponseResult || L(), !this.roomID) {
      const o = fe();
      o.length > 0 && (this.roomID = o[0].uuid);
    }
    T("ADD_RESULT", {
      kind: V.LevelTimeProgression,
      data: [],
      info: {
        initialSPL: [100],
        frequency: [this._plotFrequency],
        maxOrder: this.maxReflectionOrder
      },
      name: `LTP - ${this.name}`,
      uuid: this.levelTimeProgression,
      from: this.uuid
    }), T("ADD_RESULT", {
      kind: V.ImpulseResponse,
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
    }), this.selectedPath = Ke(), R.markup.add(this.selectedPath), this.selectedBeamsGroup = new v.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", R.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new v.Group(), this.virtualSourcesGroup.name = "virtual-sources", R.markup.add(this.virtualSourcesGroup);
  }
  save() {
    return {
      ...pe([
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
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.frequencies = e.frequencies, this.levelTimeProgression = e.levelTimeProgression || L(), this.impulseResponseResult = e.impulseResponseResult || L(), this;
  }
  dispose() {
    this.clearVisualization(), this.removeClickHandler(), R.markup.remove(this.selectedPath), R.markup.remove(this.selectedBeamsGroup), R.markup.remove(this.virtualSourcesGroup), T("REMOVE_RESULT", this.levelTimeProgression), T("REMOVE_RESULT", this.impulseResponseResult);
  }
  setupClickHandler() {
    this.removeClickHandler();
    const e = R.renderer.domElement, t = (o) => {
      const n = e.getBoundingClientRect();
      return new v.Vector2(
        (o.clientX - n.left) / n.width * 2 - 1,
        -((o.clientY - n.top) / n.height) * 2 + 1
      );
    };
    this.hoverHandler = (o) => {
      if (this.virtualSourceMap.size === 0) {
        e.style.cursor = "default";
        return;
      }
      const n = t(o), r = new v.Raycaster();
      r.setFromCamera(n, R.camera);
      const i = Array.from(this.virtualSourceMap.keys());
      r.intersectObjects(i).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (o) => {
      if (o.button !== 0 || this.virtualSourceMap.size === 0) return;
      const n = t(o), r = new v.Raycaster();
      r.setFromCamera(n, R.camera);
      const i = Array.from(this.virtualSourceMap.keys()), a = r.intersectObjects(i);
      if (a.length > 0) {
        const l = a[0].object, c = this.virtualSourceMap.get(l);
        c && (this.selectedVirtualSource === l ? (this.selectedVirtualSource = null, this.clearSelectedBeams()) : (this.selectedVirtualSource = l, this.highlightVirtualSourcePath(c)));
      }
    }, e.addEventListener("click", this.clickHandler), e.addEventListener("mousemove", this.hoverHandler);
  }
  // Highlight the ray path from a clicked virtual source to the receiver
  // beam contains polygonPath which is the sequence of polygon IDs for reflections
  highlightVirtualSourcePath(e) {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const t = C(e.reflectionOrder, this.maxReflectionOrder), o = new v.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const n = B.getState().containers[this.receiverIDs[0]];
    if (!n) return;
    const r = n.position.clone(), i = new v.LineDashedMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), a = new v.BufferGeometry().setFromPoints([o, r]), l = new v.Line(a, i);
    l.computeLineDistances(), this.selectedBeamsGroup.add(l);
    const c = new v.SphereGeometry(0.18, 16, 16), h = new v.MeshBasicMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4
    }), p = new v.Mesh(c, h);
    p.position.copy(o), this.selectedBeamsGroup.add(p);
    const f = e.polygonPath;
    if (!f || f.length === 0) return;
    const d = e.reflectionOrder;
    for (const m of this.validPaths) {
      const P = m.order;
      if (P !== d) continue;
      let I = !0;
      for (let b = 0; b < f.length; b++) {
        const y = P - b;
        if (m.polygonIds[y] !== f[b]) {
          I = !1;
          break;
        }
      }
      if (I) {
        const b = m.points, y = m.order;
        for (let S = 0; S < b.length - 1; S++) {
          const D = b[S], w = b[S + 1], E = D.distanceTo(w), A = new v.Vector3().addVectors(D, w).multiplyScalar(0.5), k = y - S, ie = k === 0 ? 16777215 : C(k, this.maxReflectionOrder), ae = new v.CylinderGeometry(0.025, 0.025, E, 8), le = new v.MeshBasicMaterial({ color: ie }), z = new v.Mesh(ae, le);
          z.position.copy(A);
          const ce = new v.Vector3().subVectors(w, D).normalize(), N = new v.Quaternion();
          N.setFromUnitVectors(new v.Vector3(0, 1, 0), ce), z.setRotationFromQuaternion(N), this.selectedBeamsGroup.add(z);
        }
        for (let S = 1; S < m.points.length - 1; S++) {
          const D = y - S + 1, w = C(D, this.maxReflectionOrder), E = new v.SphereGeometry(0.08, 12, 12), A = new v.MeshBasicMaterial({ color: w }), k = new v.Mesh(E, A);
          k.position.copy(m.points[S]), this.selectedBeamsGroup.add(k);
        }
        R.needsToRender = !0;
        return;
      }
    }
    R.needsToRender = !0;
  }
  removeClickHandler() {
    const e = R.renderer.domElement;
    this.clickHandler && (e.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.hoverHandler && (e.removeEventListener("mousemove", this.hoverHandler), this.hoverHandler = null, e.style.cursor = "default");
  }
  // Convert room surfaces to beam-trace Polygon3D format
  extractPolygons() {
    const e = this.room;
    if (!e) return [];
    const t = [];
    return this.surfaceToPolygonIndex.clear(), this.polygonToSurface.clear(), e.allSurfaces.forEach((o) => {
      const n = this.surfaceToPolygons(o), r = t.length;
      n.forEach((i, a) => {
        this.polygonToSurface.set(r + a, o), t.push(i);
      }), this.surfaceToPolygonIndex.set(
        o.uuid,
        n.map((i, a) => r + a)
      );
    }), t;
  }
  // Convert a Surface to Polygon3D objects
  surfaceToPolygons(e) {
    const t = [], o = e.geometry, n = o.getAttribute("position");
    if (!n) return t;
    e.updateMatrixWorld(!0);
    const r = e.matrixWorld, i = o.getIndex(), a = n.array, l = (c, h, p) => {
      const f = new v.Vector3(
        a[c * 3],
        a[c * 3 + 1],
        a[c * 3 + 2]
      ).applyMatrix4(r), d = new v.Vector3(
        a[h * 3],
        a[h * 3 + 1],
        a[h * 3 + 2]
      ).applyMatrix4(r), m = new v.Vector3(
        a[p * 3],
        a[p * 3 + 1],
        a[p * 3 + 2]
      ).applyMatrix4(r), P = [
        [f.x, f.y, f.z],
        [d.x, d.y, d.z],
        [m.x, m.y, m.z]
      ], I = x.create(P);
      t.push(I);
    };
    if (i) {
      const c = i.array;
      for (let h = 0; h < c.length; h += 3)
        l(c[h], c[h + 1], c[h + 2]);
    } else {
      const c = n.count;
      for (let h = 0; h < c; h += 3)
        l(h, h + 1, h + 2);
    }
    return t;
  }
  // Build/rebuild the beam-trace solver
  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const e = B.getState().containers[this.sourceIDs[0]];
    if (!e) {
      console.warn("BeamTraceSolver: Source not found");
      return;
    }
    if (this.polygons = this.extractPolygons(), this.polygons.length === 0) {
      console.warn("BeamTraceSolver: No polygons extracted from room");
      return;
    }
    const t = [
      e.position.x,
      e.position.y,
      e.position.z
    ], o = new je(t);
    this.btSolver = new We(this.polygons, o, {
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
      const t = B.getState().containers[e];
      if (!t) return;
      const o = [
        t.position.x,
        t.position.y,
        t.position.z
      ], n = this.btSolver.getPaths(o);
      this.lastMetrics = this.btSolver.getMetrics(), n.forEach((r) => {
        const i = this.convertPath(r);
        this.validPaths.push(i);
      });
    }), this.validPaths.sort((e, t) => e.arrivalTime - t.arrivalTime), this._visualizationMode) {
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
    this.calculateLTP(343), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), R.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e) {
    const t = e.map((l) => new v.Vector3(l.position[0], l.position[1], l.position[2])), o = re(e), n = Ve(e), r = He(e), i = e.map((l) => l.polygonId);
    let a;
    return t.length >= 2 ? a = new v.Vector3().subVectors(t[0], t[1]).normalize().negate() : a = new v.Vector3(0, 0, 1), { points: t, order: r, length: o, arrivalTime: n, polygonIds: i, arrivalDirection: a };
  }
  // Calculate Level Time Progression result
  calculateLTP(e = 343) {
    if (this.validPaths.length === 0) return;
    const t = [...this.validPaths].sort((n, r) => n.arrivalTime - r.arrivalTime), o = { ...G.getState().results[this.levelTimeProgression] };
    o.data = [], o.info = {
      ...o.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = this.calculateArrivalPressure(o.info.initialSPL, r), a = q(i);
      o.data.push({
        time: r.arrivalTime,
        pressure: a,
        arrival: n + 1,
        order: r.order,
        uuid: `${this.uuid}-path-${n}`
      });
    }
    T("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: o });
  }
  // Clear LTP data
  clearLevelTimeProgressionData() {
    const e = { ...G.getState().results[this.levelTimeProgression] };
    e.data = [], T("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
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
    const t = e.match(/-path-(\d+)$/);
    if (!t) {
      console.warn("BeamTraceSolver: Invalid path UUID format:", e);
      return;
    }
    const o = parseInt(t[1], 10);
    this.highlightPathByIndex(o);
  }
  // Visualization methods
  clearVisualization() {
    R.markup.clearLines(), R.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
  }
  drawPaths() {
    this.validPaths.filter((o) => this._visibleOrders.includes(o.order)).forEach((o) => {
      const n = C(o.order, this.maxReflectionOrder), r = (n >> 16 & 255) / 255, i = (n >> 8 & 255) / 255, a = (n & 255) / 255, l = [r, i, a];
      for (let c = 0; c < o.points.length - 1; c++) {
        const h = o.points[c], p = o.points[c + 1];
        R.markup.addLine(
          [h.x, h.y, h.z],
          [p.x, p.y, p.z],
          l,
          l
        );
      }
    });
    const t = R.markup.getUsageStats();
    this.lastMetrics && (this.lastMetrics.bufferUsage = t), t.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${t.linesUsed}/${t.linesCapacity}. Reduce reflection order.`) : t.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${t.linesPercent.toFixed(1)}%`);
  }
  drawBeams() {
    if (!this.btSolver) return;
    this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
    const e = this.validPaths, t = /* @__PURE__ */ new Map();
    e.forEach((n) => {
      const r = n.polygonIds.filter((i) => i !== null).join(",");
      r && t.set(r, n);
    }), this.btSolver.getBeamsForVisualization(this.maxReflectionOrder).forEach((n) => {
      if (!this._visibleOrders.includes(n.reflectionOrder))
        return;
      const r = this.beamHasValidPath(n, e);
      if (!r && !this._showAllBeams)
        return;
      const i = Math.max(0.05, 0.1 - n.reflectionOrder * 0.01), a = C(n.reflectionOrder, this.maxReflectionOrder);
      let l = a;
      if (!r) {
        const d = (a >> 16 & 255) * 0.4 + 76.8, m = (a >> 8 & 255) * 0.4 + 128 * 0.6, P = (a & 255) * 0.4 + 128 * 0.6;
        l = Math.round(d) << 16 | Math.round(m) << 8 | Math.round(P);
      }
      const c = new v.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), h = new v.SphereGeometry(i, 12, 12), p = new v.MeshStandardMaterial({
        color: l,
        transparent: !r,
        opacity: r ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), f = new v.Mesh(h, p);
      f.position.copy(c), this.virtualSourcesGroup.add(f), r && this.virtualSourceMap.set(f, {
        ...n,
        polygonPath: n.polygonPath || []
      });
    }), this.setupClickHandler(), R.needsToRender = !0;
  }
  // Check if a beam has a valid path to the receiver
  beamHasValidPath(e, t) {
    const o = e.polygonPath;
    if (!o || o.length === 0) return !1;
    const n = e.reflectionOrder;
    for (const r of t) {
      if (r.order !== n) continue;
      let i = !0;
      for (let a = 0; a < o.length; a++) {
        const l = n - a;
        if (r.polygonIds[l] !== o[a]) {
          i = !1;
          break;
        }
      }
      if (i) return !0;
    }
    return !1;
  }
  // Clear virtual source meshes
  clearVirtualSources() {
    var e;
    for (; this.virtualSourcesGroup.children.length > 0; ) {
      const t = this.virtualSourcesGroup.children[0];
      if (this.virtualSourcesGroup.remove(t), t instanceof v.Mesh) {
        (e = t.geometry) == null || e.dispose();
        const o = t.material;
        if (Array.isArray(o))
          for (const n of o)
            n instanceof v.Material && n.dispose();
        else o instanceof v.Material && o.dispose();
      }
    }
  }
  // Calculate impulse response
  async calculateImpulseResponse() {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const e = M.sampleRate, o = Array(this.frequencies.length).fill(100), n = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05, r = Math.floor(e * n) * 2, i = [];
    for (let c = 0; c < this.frequencies.length; c++)
      i.push(new Float32Array(r));
    for (const c of this.validPaths) {
      const h = Math.random() > 0.5 ? 1 : -1, p = this.calculateArrivalPressure(o, c), f = Math.floor(c.arrivalTime * e);
      for (let d = 0; d < this.frequencies.length; d++)
        f < i[d].length && (i[d][f] += p[d] * h);
    }
    const l = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((c, h) => {
      l.postMessage({ samples: i }), l.onmessage = (p) => {
        const f = p.data.samples, d = new Float32Array(f[0].length >> 1);
        let m = 0;
        for (let y = 0; y < f.length; y++)
          for (let S = 0; S < d.length; S++)
            d[S] += f[y][S], Math.abs(d[S]) > m && (m = Math.abs(d[S]));
        const P = U(d), I = M.createOfflineContext(1, d.length, e), b = M.createBufferSource(P, I);
        b.connect(I.destination), b.start(), M.renderContextAsync(I).then((y) => {
          this.impulseResponse = y, this.updateImpulseResponseResult(y, e), c(y);
        }).catch(h).finally(() => l.terminate());
      }, l.onerror = (p) => {
        l.terminate(), h(p);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, t) {
    const o = me(j(e));
    t.polygonIds.forEach((i) => {
      if (i === null) return;
      const a = this.polygonToSurface.get(i);
      if (a)
        for (let l = 0; l < this.frequencies.length; l++) {
          const c = 1 - a.absorptionFunction(this.frequencies[l]);
          o[l] *= c;
        }
    });
    const n = q(ge(o)), r = ve(this.frequencies);
    for (let i = 0; i < this.frequencies.length; i++)
      n[i] -= r[i] * t.length;
    return j(n);
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, t) {
    var h, p;
    const o = B.getState().containers, n = this.sourceIDs.length > 0 && ((h = o[this.sourceIDs[0]]) == null ? void 0 : h.name) || "source", r = this.receiverIDs.length > 0 && ((p = o[this.receiverIDs[0]]) == null ? void 0 : p.name) || "receiver", i = e.getChannelData(0), a = [], l = Math.max(1, Math.floor(i.length / 2e3));
    for (let f = 0; f < i.length; f += l)
      a.push({
        time: f / t,
        amplitude: i[f]
      });
    console.log(`BeamTraceSolver: Updating IR result with ${a.length} samples, duration: ${(i.length / t).toFixed(3)}s`);
    const c = {
      kind: V.ImpulseResponse,
      data: a,
      info: {
        sampleRate: t,
        sourceName: n,
        receiverName: r,
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR: ${n} → ${r}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    };
    T("UPDATE_RESULT", { uuid: this.impulseResponseResult, result: c });
  }
  async playImpulseResponse() {
    this.impulseResponse || await this.calculateImpulseResponse(), M.context.state === "suspended" && M.context.resume();
    const e = M.context.createBufferSource();
    e.buffer = this.impulseResponse, e.connect(M.context.destination), e.start(), T("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !0 }), e.onended = () => {
      e.stop(), e.disconnect(M.context.destination), T("BEAMTRACE_SET_PROPERTY", { uuid: this.uuid, property: "impulseResponsePlaying", value: !1 });
    };
  }
  async downloadImpulseResponse(e, t = M.sampleRate) {
    this.impulseResponse || await this.calculateImpulseResponse();
    const o = W([U(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), n = e.endsWith(".wav") ? "" : ".wav";
    K.saveAs(o, e + n);
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
    const t = M.sampleRate, n = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (r <= 0) throw new Error("Invalid impulse response duration");
    const i = Math.floor(t * r) * 2;
    if (i < 2) throw new Error("Impulse response too short to process");
    const a = Ie(e), l = [];
    for (let h = 0; h < this.frequencies.length; h++) {
      l.push([]);
      for (let p = 0; p < a; p++)
        l[h].push(new Float32Array(i));
    }
    for (const h of this.validPaths) {
      const p = Math.random() > 0.5 ? 1 : -1, f = this.calculateArrivalPressure(n, h), d = Math.floor(h.arrivalTime * t);
      if (d >= i) continue;
      const m = h.arrivalDirection, P = new Float32Array(1);
      for (let I = 0; I < this.frequencies.length; I++) {
        P[0] = f[I] * p;
        const b = be(P, m.x, m.y, m.z, e, "threejs");
        for (let y = 0; y < a; y++)
          l[I][y][d] += b[y][0];
      }
    }
    const c = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((h, p) => {
      const f = async (d) => new Promise((m) => {
        const P = [];
        for (let b = 0; b < this.frequencies.length; b++)
          P.push(l[b][d]);
        const I = c();
        I.postMessage({ samples: P }), I.onmessage = (b) => {
          const y = b.data.samples, S = new Float32Array(y[0].length >> 1);
          for (let D = 0; D < y.length; D++)
            for (let w = 0; w < S.length; w++)
              S[w] += y[D][w];
          I.terminate(), m(S);
        };
      });
      Promise.all(
        Array.from({ length: a }, (d, m) => f(m))
      ).then((d) => {
        let m = 0;
        for (const y of d)
          for (let S = 0; S < y.length; S++)
            Math.abs(y[S]) > m && (m = Math.abs(y[S]));
        if (m > 0)
          for (const y of d)
            for (let S = 0; S < y.length; S++)
              y[S] /= m;
        const P = d[0].length;
        if (P === 0) {
          p(new Error("Filtered signal has zero length"));
          return;
        }
        const b = M.createOfflineContext(a, P, t).createBuffer(a, P, t);
        for (let y = 0; y < a; y++)
          b.copyToChannel(new Float32Array(d[y]), y);
        this.ambisonicImpulseResponse = b, this.ambisonicOrder = e, h(b);
      }).catch(p);
    });
  }
  /**
   * Download the ambisonic impulse response as a multi-channel WAV file.
   * Channels are in ACN order with N3D normalization.
   *
   * @param filename - Output filename (without extension)
   * @param order - Ambisonic order (default: 1)
   */
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    (!this.ambisonicImpulseResponse || this.ambisonicOrder !== t) && await this.calculateAmbisonicImpulseResponse(t);
    const o = this.ambisonicImpulseResponse.numberOfChannels, n = this.ambisonicImpulseResponse.sampleRate, r = [];
    for (let c = 0; c < o; c++)
      r.push(this.ambisonicImpulseResponse.getChannelData(c));
    const i = W(r, { sampleRate: n, bitDepth: 32 }), a = e.endsWith(".wav") ? "" : ".wav", l = t === 1 ? "FOA" : `HOA${t}`;
    K.saveAs(i, `${e}_${l}${a}`);
  }
  // Clear results
  reset() {
    this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), R.needsToRender = !0;
  }
  // Helper to clear highlighted beam lines
  clearSelectedBeams() {
    var e;
    for (; this.selectedBeamsGroup.children.length > 0; ) {
      const t = this.selectedBeamsGroup.children[0];
      this.selectedBeamsGroup.remove(t), (t instanceof v.Mesh || t instanceof v.Line) && ((e = t.geometry) == null || e.dispose(), t.material instanceof v.Material && t.material.dispose());
    }
  }
  // Getters and setters
  get room() {
    return B.getState().containers[this.roomID];
  }
  get sources() {
    return this.sourceIDs.map((e) => B.getState().containers[e]).filter(Boolean);
  }
  get receivers() {
    return this.receiverIDs.map((e) => B.getState().containers[e]).filter(Boolean);
  }
  get numValidPaths() {
    return this.validPaths.length;
  }
  set maxReflectionOrderReset(e) {
    this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), T("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
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
    R.needsToRender = !0;
  }
  // Show all beams toggle (including invalid/orphaned beams)
  get showAllBeams() {
    return this._showAllBeams;
  }
  set showAllBeams(e) {
    this._showAllBeams = e, (this._visualizationMode === "beams" || this._visualizationMode === "both") && (this.clearVisualization(), this._visualizationMode === "both" && this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams(), R.needsToRender = !0);
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
    R.needsToRender = !0;
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
    const t = B.getState().containers[this.receiverIDs[0]];
    if (!t) {
      console.warn("BeamTraceSolver: Receiver not found.");
      return;
    }
    const o = [
      t.position.x,
      t.position.y,
      t.position.z
    ];
    console.group(`🔍 Debugging beam path: [${e.join(" → ")}]`), this.btSolver.debugBeamPath(o, e), console.groupEnd();
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
    const e = B.getState().containers[this.receiverIDs[0]];
    if (!e)
      return console.warn("BeamTraceSolver: Receiver not found."), [];
    const t = [
      e.position.x,
      e.position.y,
      e.position.z
    ];
    return this.btSolver.getDetailedPaths(t);
  }
  // Highlight a specific path by index (for interactive selection)
  highlightPathByIndex(e) {
    const t = [...this.validPaths].sort((i, a) => i.arrivalTime - a.arrivalTime);
    if (e < 0 || e >= t.length) {
      console.warn("BeamTraceSolver: Path index out of bounds:", e);
      return;
    }
    const o = t[e];
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const n = C(o.order, this.maxReflectionOrder), r = new v.LineBasicMaterial({
      color: n,
      linewidth: 2,
      transparent: !1
    });
    for (let i = 0; i < o.points.length - 1; i++) {
      const a = new v.BufferGeometry().setFromPoints([
        o.points[i],
        o.points[i + 1]
      ]), l = new v.Line(a, r);
      this.selectedBeamsGroup.add(l);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const i = B.getState().containers[this.receiverIDs[0]];
      if (i) {
        const a = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), l = o.polygonIds[o.order];
        if (l !== null) {
          const c = a.find(
            (h) => h.polygonId === l && h.reflectionOrder === o.order
          );
          if (c) {
            const h = new v.LineDashedMaterial({
              color: n,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), p = new v.Vector3(
              c.virtualSource[0],
              c.virtualSource[1],
              c.virtualSource[2]
            ), f = i.position.clone(), d = new v.BufferGeometry().setFromPoints([p, f]), m = new v.Line(d, h);
            m.computeLineDistances(), this.selectedBeamsGroup.add(m);
          }
        }
      }
    }
    console.log(`BeamTraceSolver: Highlighting path ${e} with order ${o.order}, arrival time ${o.arrivalTime.toFixed(4)}s`), R.needsToRender = !0;
  }
  // Clear the current path highlight
  clearPathHighlight() {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), R.needsToRender = !0;
  }
}
F("BEAMTRACE_SET_PROPERTY", Pe);
F("REMOVE_BEAMTRACE", ye);
F("ADD_BEAMTRACE", Se(Qe));
F("BEAMTRACE_CALCULATE", (s) => {
  _.getState().solvers[s].calculate(), setTimeout(() => T("BEAMTRACE_CALCULATE_COMPLETE", s), 0);
});
F("BEAMTRACE_RESET", (s) => {
  _.getState().solvers[s].reset();
});
F("BEAMTRACE_PLAY_IR", (s) => {
  _.getState().solvers[s].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
F("BEAMTRACE_DOWNLOAD_IR", (s) => {
  var i, a;
  const e = _.getState().solvers[s], t = B.getState().containers, o = e.sourceIDs.length > 0 && ((i = t[e.sourceIDs[0]]) == null ? void 0 : i.name) || "source", n = e.receiverIDs.length > 0 && ((a = t[e.receiverIDs[0]]) == null ? void 0 : a.name) || "receiver", r = `ir-beamtrace-${o}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(r).catch((l) => {
    window.alert(l.message || "Failed to download impulse response");
  });
});
F("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: s, order: e }) => {
  var a, l;
  const t = _.getState().solvers[s], o = B.getState().containers, n = t.sourceIDs.length > 0 && ((a = o[t.sourceIDs[0]]) == null ? void 0 : a.name) || "source", r = t.receiverIDs.length > 0 && ((l = o[t.receiverIDs[0]]) == null ? void 0 : l.name) || "receiver", i = `ir-beamtrace-ambi-${n}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((c) => {
    window.alert(c.message || "Failed to download ambisonic impulse response");
  });
});
F("SHOULD_ADD_BEAMTRACE", () => {
  T("ADD_BEAMTRACE", void 0);
});
export {
  Qe as BeamTraceSolver,
  Qe as default
};
//# sourceMappingURL=index-BNAWt3bi.mjs.map
