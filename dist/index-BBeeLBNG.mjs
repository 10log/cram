import { S as ae } from "./solver-BnRpsXb-.mjs";
import * as g from "three";
import { MeshLine as le, MeshLineMaterial as ce } from "three.meshline";
import { v as L, g as ue, e as A, R as V, r as D, p as he, u as x, a as H, P as q, b as de, L as U, I as fe, o as T, s as me, c as pe, d as ge, f as _ } from "./index-BW01orYZ.mjs";
import { a as ve } from "./air-attenuation-CBIk1QMo.mjs";
import { s as Pe } from "./sound-speed-Biev-mJ1.mjs";
import { a as $, n as ye } from "./audio-engine-DTb1Qexp.mjs";
import { p as Se, d as Ie, a as be, b as Re, c as De } from "./export-playback-GRqBZlbu.mjs";
import { e as we, c as xe, g as Me } from "./calculate-binaural-z75egsJs.mjs";
import Y from "chroma-js";
const h = {
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
    return Math.sqrt(h.lengthSquared(s));
  },
  /**
   * Normalize a vector to unit length
   * Returns zero vector if input has zero length
   */
  normalize(s) {
    const e = h.length(s);
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
    return h.length(h.subtract(s, e));
  },
  /**
   * Squared distance between two points (faster than distance)
   */
  distanceSquared(s, e) {
    return h.lengthSquared(h.subtract(s, e));
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
    const t = 2 * h.dot(s, e);
    return h.subtract(s, h.scale(e, t));
  },
  /**
   * Project vector a onto vector b
   */
  project(s, e) {
    const t = h.lengthSquared(e);
    if (t < 1e-10)
      return [0, 0, 0];
    const o = h.dot(s, e) / t;
    return h.scale(e, o);
  },
  /**
   * Get the component of a perpendicular to b
   */
  reject(s, e) {
    return h.subtract(s, h.project(s, e));
  },
  /**
   * Convert to string for debugging
   */
  toString(s, e = 4) {
    return `[${s[0].toFixed(e)}, ${s[1].toFixed(e)}, ${s[2].toFixed(e)}]`;
  }
}, P = {
  /**
   * Create a plane from a normal vector and a point on the plane
   */
  fromNormalAndPoint(s, e) {
    const t = h.normalize(s), o = -h.dot(t, e);
    return { a: t[0], b: t[1], c: t[2], d: o };
  },
  /**
   * Create a plane from three non-collinear points
   * Uses counter-clockwise winding order: normal points toward viewer when
   * p1 → p2 → p3 appears counter-clockwise
   */
  fromPoints(s, e, t) {
    const o = h.subtract(e, s), r = h.subtract(t, s), n = h.normalize(h.cross(o, r));
    return P.fromNormalAndPoint(n, s);
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
    return Math.abs(P.signedDistance(s, e));
  },
  /**
   * Classify a point relative to the plane
   */
  classifyPoint(s, e, t = 1e-6) {
    const o = P.signedDistance(s, e);
    return o > t ? "front" : o < -t ? "back" : "on";
  },
  /**
   * Check if a point is in front of the plane
   */
  isPointInFront(s, e, t = 1e-6) {
    return P.signedDistance(s, e) > t;
  },
  /**
   * Check if a point is behind the plane
   */
  isPointBehind(s, e, t = 1e-6) {
    return P.signedDistance(s, e) < -t;
  },
  /**
   * Check if a point is on the plane
   */
  isPointOn(s, e, t = 1e-6) {
    return Math.abs(P.signedDistance(s, e)) <= t;
  },
  /**
   * Mirror a point across the plane
   * p' = p - 2 * signedDistance(p) * normal
   */
  mirrorPoint(s, e) {
    const t = P.signedDistance(s, e), o = P.normal(e);
    return h.subtract(s, h.scale(o, 2 * t));
  },
  /**
   * Mirror a plane across another plane (for fail plane propagation)
   * This mirrors two points on the source plane and reconstructs.
   */
  mirrorPlane(s, e) {
    const t = P.normal(s);
    let o;
    Math.abs(t[2]) > 0.5 ? o = [0, 0, -s.d / s.c] : Math.abs(t[1]) > 0.5 ? o = [0, -s.d / s.b, 0] : o = [-s.d / s.a, 0, 0];
    const r = Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], n = h.normalize(h.cross(t, r)), i = h.add(o, n), a = h.cross(t, n), c = h.add(o, a), u = P.mirrorPoint(o, e), l = P.mirrorPoint(i, e), m = P.mirrorPoint(c, e);
    return P.fromPoints(u, l, m);
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
    const o = P.normal(t), r = h.dot(o, e);
    return Math.abs(r) < 1e-10 ? null : -(h.dot(o, s) + t.d) / r;
  },
  /**
   * Get the point of intersection between a ray and plane
   */
  rayIntersectionPoint(s, e, t) {
    const o = P.rayIntersection(s, e, t);
    return o === null ? null : h.add(s, h.scale(e, o));
  },
  /**
   * Project a point onto the plane
   */
  projectPoint(s, e) {
    const t = P.signedDistance(s, e), o = P.normal(e);
    return h.subtract(s, h.scale(o, t));
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
}, w = {
  /**
   * Create a polygon from vertices (computes plane automatically)
   * Vertices must be in counter-clockwise order when viewed from front
   */
  create(s, e) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    const t = s.map((r) => h.clone(r)), o = P.fromPoints(t[0], t[1], t[2]);
    return { vertices: t, plane: o, materialId: e };
  },
  /**
   * Create a polygon with an explicit plane (for split polygons that may be degenerate)
   */
  createWithPlane(s, e, t) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    return { vertices: s.map((r) => h.clone(r)), plane: e, materialId: t };
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
      const r = s.vertices[o], n = s.vertices[o + 1], i = h.cross(h.subtract(r, t), h.subtract(n, t));
      e = h.add(e, i);
    }
    return 0.5 * h.length(e);
  },
  /**
   * Get the normal vector of the polygon (from the plane)
   */
  normal(s) {
    return P.normal(s.plane);
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
    let o = 0, r = 0;
    for (const n of s.vertices) {
      const i = P.classifyPoint(n, e, t);
      i === "front" ? o++ : i === "back" && r++;
    }
    return o > 0 && r > 0 ? "spanning" : o > 0 ? "front" : r > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(s, e, t = 1e-6) {
    const o = P.normal(s.plane), r = s.vertices.length;
    for (let n = 0; n < r; n++) {
      const i = s.vertices[n], a = s.vertices[(n + 1) % r], c = h.subtract(a, i), u = h.subtract(e, i), l = h.cross(c, u);
      if (h.dot(l, o) < -t)
        return !1;
    }
    return !0;
  },
  /**
   * Ray-polygon intersection
   * Returns t parameter and intersection point, or null if no hit
   */
  rayIntersection(s, e, t, o = 1e-4) {
    const r = P.rayIntersection(s, e, t.plane);
    if (r === null || r < 0)
      return null;
    const n = h.add(s, h.scale(e, r));
    return w.containsPoint(t, n, o) ? { t: r, point: n } : null;
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
    return s.vertices.length < 3 || w.area(s) < e;
  },
  /**
   * Flip the polygon winding (reverse vertex order and flip plane)
   */
  flip(s) {
    const e = [...s.vertices].reverse(), t = P.flip(s.plane);
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
      vertices: s.vertices.map((e) => h.clone(e)),
      plane: { ...s.plane },
      materialId: s.materialId
    };
  },
  /**
   * Convert to string for debugging
   */
  toString(s) {
    const e = s.vertices.map((t) => h.toString(t, 2)).join(", ");
    return `Polygon3D(${s.vertices.length} vertices: [${e}])`;
  }
};
function Be(s, e, t = 1e-4) {
  const o = w.classify(s, e, t);
  if (o === "front" || o === "coplanar")
    return { front: s, back: null };
  if (o === "back")
    return { front: null, back: s };
  const r = [], n = [], i = s.vertices.length;
  for (let u = 0; u < i; u++) {
    const l = s.vertices[u], m = s.vertices[(u + 1) % i], d = P.signedDistance(l, e), f = P.signedDistance(m, e), p = d > t ? "front" : d < -t ? "back" : "on", v = f > t ? "front" : f < -t ? "back" : "on";
    if (p === "front" ? r.push(l) : (p === "back" || r.push(l), n.push(l)), p === "front" && v === "back" || p === "back" && v === "front") {
      const I = d / (d - f), b = h.lerp(l, m, I);
      r.push(b), n.push(b);
    }
  }
  const a = r.length >= 3 ? w.createWithPlane(r, s.plane, s.materialId) : null, c = n.length >= 3 ? w.createWithPlane(n, s.plane, s.materialId) : null;
  return { front: a, back: c };
}
function Te(s, e, t = 1e-4) {
  const o = s.vertices, r = [];
  if (o.length < 3)
    return null;
  for (let n = 0; n < o.length; n++) {
    const i = o[n], a = o[(n + 1) % o.length], c = P.signedDistance(i, e), u = P.signedDistance(a, e), l = c >= -t, m = u >= -t;
    if (l && r.push(i), l && !m || !l && m) {
      const d = c / (c - u), f = h.lerp(i, a, Math.max(0, Math.min(1, d)));
      r.push(f);
    }
  }
  return r.length < 3 ? null : w.createWithPlane(r, s.plane, s.materialId);
}
function Ae(s, e, t = 1e-4) {
  let o = s;
  for (const r of e) {
    if (!o)
      return null;
    o = Te(o, r, t);
  }
  return o;
}
function Fe(s, e, t = 1e-4) {
  for (const o of e) {
    let r = !0;
    for (const n of s.vertices)
      if (P.signedDistance(n, o) >= -t) {
        r = !1;
        break;
      }
    if (r)
      return !0;
  }
  return !1;
}
function ke(s) {
  if (s.length === 0)
    return null;
  const e = s.map((t, o) => ({
    polygon: t,
    originalId: o
  }));
  return N(e);
}
function N(s) {
  if (s.length === 0)
    return null;
  const e = Oe(s), t = s[e], o = t.polygon.plane, r = [], n = [];
  for (let i = 0; i < s.length; i++) {
    if (i === e)
      continue;
    const a = s[i], { front: c, back: u } = Be(a.polygon, o);
    c && r.push({ polygon: c, originalId: a.originalId }), u && n.push({ polygon: u, originalId: a.originalId });
  }
  return {
    plane: o,
    polygon: t.polygon,
    polygonId: t.originalId,
    front: N(r),
    back: N(n)
  };
}
function Oe(s) {
  if (s.length <= 3)
    return 0;
  let e = 0, t = 1 / 0;
  const o = Math.min(s.length, 10), r = Math.max(1, Math.floor(s.length / o));
  for (let n = 0; n < s.length; n += r) {
    const i = s[n].polygon.plane;
    let a = 0, c = 0, u = 0;
    for (let m = 0; m < s.length; m++) {
      if (n === m)
        continue;
      const d = w.classify(s[m].polygon, i);
      d === "front" ? a++ : d === "back" ? c++ : d === "spanning" && (a++, c++, u++);
    }
    const l = u * 8 + Math.abs(a - c);
    l < t && (t = l, e = n);
  }
  return e;
}
function E(s, e, t, o = 0, r = 1 / 0, n = -1) {
  if (!t)
    return null;
  const i = P.signedDistance(s, t.plane), a = P.normal(t.plane), c = h.dot(a, e);
  let u, l;
  i >= 0 ? (u = t.front, l = t.back) : (u = t.back, l = t.front);
  let m = null;
  Math.abs(c) > 1e-10 && (m = -i / c);
  let d = null;
  if (m === null || m < o) {
    if (d = E(s, e, u, o, r, n), !d && t.polygonId !== n) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = E(s, e, l, o, r, n));
  } else if (m > r) {
    if (d = E(s, e, u, o, r, n), !d && t.polygonId !== n) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = E(s, e, l, o, r, n));
  } else {
    if (d = E(s, e, u, o, m, n), !d && t.polygonId !== n) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = E(s, e, l, m, r, n));
  }
  return d;
}
function O(s, e, t, o, r, n) {
  if (!t)
    return null;
  const i = P.signedDistance(s, t.plane), a = P.normal(t.plane), c = h.dot(a, e);
  let u, l;
  i >= 0 ? (u = t.front, l = t.back) : (u = t.back, l = t.front);
  let m = null;
  Math.abs(c) > 1e-10 && (m = -i / c);
  let d = null;
  if (m === null || m < o) {
    if (d = O(s, e, u, o, r, n), !d && !n.has(t.polygonId)) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, l, o, r, n));
  } else if (m > r) {
    if (d = O(s, e, u, o, r, n), !d && !n.has(t.polygonId)) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, l, o, r, n));
  } else {
    if (d = O(s, e, u, o, m, n), !d && !n.has(t.polygonId)) {
      const f = w.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, l, m, r, n));
  }
  return d;
}
function Z(s, e) {
  const t = [], o = w.edges(e), r = w.centroid(e);
  for (const [i, a] of o) {
    let c = P.fromPoints(s, i, a);
    P.signedDistance(r, c) < 0 && (c = P.flip(c)), t.push(c);
  }
  let n = e.plane;
  return P.signedDistance(s, n) > 0 && (n = P.flip(n)), t.push(n), t;
}
function K(s, e) {
  return P.mirrorPoint(s, e.plane);
}
function Q(s, e) {
  const t = w.centroid(s), o = h.subtract(e, t), r = P.normal(s.plane);
  return h.dot(r, o) > 0;
}
const $e = 1e-6;
function Ee(s, e, t) {
  const o = {
    id: -1,
    parent: null,
    virtualSource: h.clone(s),
    children: []
  };
  if (t >= 1)
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      if (!Q(i, s))
        continue;
      const a = K(s, i), c = Z(a, i), u = {
        id: n,
        parent: o,
        virtualSource: a,
        aperture: w.clone(i),
        boundaryPlanes: c,
        children: []
      };
      o.children.push(u), t > 1 && X(u, e, 2, t);
    }
  const r = [];
  return J(o, r), {
    root: o,
    leafNodes: r,
    polygons: e,
    maxReflectionOrder: t
  };
}
function X(s, e, t, o) {
  if (!(t > o) && !(!s.boundaryPlanes || !s.aperture))
    for (let r = 0; r < e.length; r++) {
      if (r === s.id)
        continue;
      const n = e[r];
      if (Fe(n, s.boundaryPlanes) || !Q(n, s.virtualSource))
        continue;
      const i = Ae(n, s.boundaryPlanes);
      if (!i || w.area(i) < $e)
        continue;
      const c = K(s.virtualSource, n), u = Z(c, i), l = {
        id: r,
        parent: s,
        virtualSource: c,
        aperture: i,
        boundaryPlanes: u,
        children: []
      };
      s.children.push(l), t < o && X(l, e, t + 1, o);
    }
}
function J(s, e) {
  s.children.length === 0 && s.id !== -1 && e.push(s);
  for (const t of s.children)
    J(t, e);
}
function _e(s) {
  ee(s.root);
}
function ee(s) {
  s.failPlane = void 0, s.failPlaneType = void 0;
  for (const e of s.children)
    ee(e);
}
function Ce(s, e, t) {
  if (!e.aperture || !e.boundaryPlanes)
    return null;
  let r = t[e.id].plane;
  if (P.signedDistance(e.virtualSource, r) < 0 && (r = P.flip(r)), P.signedDistance(s, r) < 0)
    return {
      plane: r,
      type: "polygon",
      nodeDepth: j(e)
    };
  const n = e.boundaryPlanes.length - 1;
  for (let i = 0; i < e.boundaryPlanes.length; i++) {
    const a = e.boundaryPlanes[i];
    if (P.signedDistance(s, a) < 0) {
      const c = i < n ? "edge" : "aperture";
      return {
        plane: a,
        type: c,
        nodeDepth: j(e)
      };
    }
  }
  return null;
}
function j(s) {
  let e = 0, t = s;
  for (; t && t.id !== -1; )
    e++, t = t.parent;
  return e;
}
function Le(s, e) {
  return P.signedDistance(s, e) < 0;
}
const te = 16;
function ze(s, e = te) {
  const t = [];
  for (let o = 0; o < s.length; o += e)
    t.push({
      id: t.length,
      nodes: s.slice(o, Math.min(o + e, s.length)),
      skipSphere: null
    });
  return t;
}
function Ve(s, e) {
  return h.distance(s, e.center) < e.radius;
}
function Ne(s, e) {
  return e.skipSphere ? Ve(s, e.skipSphere) ? "inside" : "outside" : "none";
}
function Ge(s, e) {
  let t = 1 / 0;
  for (const o of e) {
    if (!o.failPlane)
      return null;
    const r = Math.abs(P.signedDistance(s, o.failPlane));
    t = Math.min(t, r);
  }
  return t === 1 / 0 || t <= 1e-10 ? null : {
    center: h.clone(s),
    radius: t
  };
}
function W(s) {
  s.skipSphere = null;
}
function He(s) {
  for (const e of s.nodes)
    e.failPlane = void 0, e.failPlaneType = void 0;
}
class qe {
  /**
   * Create a new 3D beam tracing solver
   *
   * @param polygons - Room geometry as an array of polygons
   * @param sourcePosition - Position of the sound source
   * @param config - Optional configuration
   */
  constructor(e, t, o = {}) {
    const r = o.maxReflectionOrder ?? 5, n = o.bucketSize ?? te;
    this.polygons = e, this.sourcePosition = h.clone(t), this.epsilon = o.epsilon ?? 1e-4, this.bspRoot = ke(e), this.beamTree = Ee(t, e, r), this.buckets = ze(this.beamTree.leafNodes, n), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
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
    const r = this.findIntermediatePaths(e, this.beamTree.root);
    t.push(...r);
    for (const n of this.buckets) {
      const i = Ne(e, n);
      if (i === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      i === "outside" && (W(n), He(n)), this.metrics.bucketsChecked++;
      let a = !0, c = !0;
      for (const u of n.nodes) {
        if (u.failPlane && Le(e, u.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        u.failPlane && (u.failPlane = void 0, u.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const l = this.validatePath(e, u);
        l.valid && l.path ? (t.push(l.path), a = !1, c = !1) : u.failPlane || (c = !1);
      }
      a && c && n.nodes.length > 0 && (n.skipSphere = Ge(e, n.nodes), n.skipSphere && this.metrics.skipSphereCount++);
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
    return this.getPaths(e).map((o) => Ke(o, this.polygons));
  }
  /**
   * Validate the direct path from listener to source
   */
  validateDirectPath(e) {
    const t = h.subtract(this.sourcePosition, e), o = h.length(t), r = h.normalize(t);
    this.metrics.raycastCount++;
    const n = E(e, r, this.bspRoot, 0, o, -1);
    return n && n.t < o - this.epsilon ? null : [
      { position: h.clone(e), polygonId: null },
      { position: h.clone(this.sourcePosition), polygonId: null }
    ];
  }
  /**
   * Find paths through intermediate (non-leaf) nodes
   *
   * These are lower-order reflections that didn't spawn further children.
   */
  findIntermediatePaths(e, t) {
    const o = [];
    for (const r of t.children)
      r.children.length > 0 && o.push(...this.findIntermediatePaths(e, r));
    if (t.id !== -1 && t.aperture) {
      const r = this.traverseBeam(e, t);
      r && o.push(r);
    }
    return o;
  }
  /**
   * Traverse a beam from listener to source, building the reflection path
   */
  traverseBeam(e, t, o = !1) {
    const r = [
      { position: h.clone(e), polygonId: null }
    ], n = [];
    let i = t;
    for (; i && i.id !== -1; )
      n.unshift(i.id), i = i.parent;
    o && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${n.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
    let a = e, c = t;
    const u = /* @__PURE__ */ new Set();
    let l = 0;
    for (; c && c.id !== -1; ) {
      const m = this.polygons[c.id], d = c.virtualSource, f = h.normalize(h.subtract(d, a)), p = w.rayIntersection(a, f, m);
      if (!p)
        return o && console.log(`  [Segment ${l}] FAIL: No intersection with polygon ${c.id}`), null;
      o && (console.log(`  [Segment ${l}] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    Direction: [${f[0].toFixed(3)}, ${f[1].toFixed(3)}, ${f[2].toFixed(3)}]`), console.log(`    Hit polygon ${c.id} at t=${p.t.toFixed(3)}, point=[${p.point[0].toFixed(3)}, ${p.point[1].toFixed(3)}, ${p.point[2].toFixed(3)}]`)), u.add(c.id), this.metrics.raycastCount++;
      const v = O(a, f, this.bspRoot, this.epsilon, p.t - this.epsilon, u);
      if (v)
        return o && (console.log(`    OCCLUDED by polygon ${v.polygonId} at t=${v.t.toFixed(3)}, point=[${v.point[0].toFixed(3)}, ${v.point[1].toFixed(3)}, ${v.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(u).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(u).join(", ")}])`), r.push({
        position: h.clone(p.point),
        polygonId: c.id
      }), a = p.point, c = c.parent, l++;
    }
    if (c) {
      const m = h.normalize(h.subtract(c.virtualSource, a)), d = h.distance(c.virtualSource, a);
      if (o) {
        console.log(`  [Final segment] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    To source: [${c.virtualSource[0].toFixed(3)}, ${c.virtualSource[1].toFixed(3)}, ${c.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${m[0].toFixed(3)}, ${m[1].toFixed(3)}, ${m[2].toFixed(3)}]`), console.log(`    Distance: ${d.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(d - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(u).join(", ")}]`);
        const I = a, b = c.virtualSource;
        if (I[1] < 5.575 && b[1] > 5.575 || I[1] > 5.575 && b[1] < 5.575) {
          const R = (5.575 - I[1]) / (b[1] - I[1]), y = I[0] + R * (b[0] - I[0]), S = I[2] + R * (b[2] - I[2]);
          if (console.log(`    CROSSING y=5.575 at t=${R.toFixed(3)}, x=${y.toFixed(3)}, z=${S.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), y >= 6.215 && y <= 12.43 && S >= 0 && S <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const M of [3, 4]) {
              const B = this.polygons[M], F = w.rayIntersection(a, m, B);
              F ? console.log(`      Polygon ${M}: HIT at t=${F.t.toFixed(3)}, point=[${F.point[0].toFixed(3)}, ${F.point[1].toFixed(3)}, ${F.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${M}: NO HIT`), console.log(`        Vertices: ${B.vertices.map((k) => `[${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const f = this.epsilon, p = d - this.epsilon, v = O(a, m, this.bspRoot, f, p, u);
      if (v)
        return o && console.log(`    OCCLUDED by polygon ${v.polygonId} at t=${v.t.toFixed(3)}, point=[${v.point[0].toFixed(3)}, ${v.point[1].toFixed(3)}, ${v.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), r.push({
        position: h.clone(c.virtualSource),
        polygonId: null
      });
    }
    return r;
  }
  /**
   * Validate a path through a beam node
   */
  validatePath(e, t) {
    const o = this.traverseBeam(e, t);
    if (o)
      return { valid: !0, path: o };
    const r = Ce(e, t, this.polygons);
    return r && (t.failPlane = r.plane, t.failPlaneType = r.type), { valid: !1, path: null };
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
    const o = (i, a, c) => {
      if (c === a.length)
        return i;
      for (const u of i.children)
        if (u.id === a[c])
          return o(u, a, c + 1);
      return null;
    }, r = o(this.beamTree.root, t, 0);
    if (!r) {
      console.log("ERROR: Could not find beam node for this polygon path");
      return;
    }
    console.log(`Found beam node with virtual source: [${r.virtualSource[0].toFixed(3)}, ${r.virtualSource[1].toFixed(3)}, ${r.virtualSource[2].toFixed(3)}]`);
    const n = this.traverseBeam(e, r, !0);
    if (n) {
      console.log("PATH VALID - returned path:");
      for (let i = 0; i < n.length; i++) {
        const a = n[i];
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
    _e(this.beamTree);
    for (const e of this.buckets)
      W(e);
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
    return h.clone(this.sourcePosition);
  }
  /**
   * Get beam data for visualization
   * Returns beams organized by reflection order
   */
  getBeamsForVisualization(e) {
    const t = [], o = e ?? this.beamTree.maxReflectionOrder, r = (n, i, a) => {
      if (i > o)
        return;
      const c = n.id !== -1 ? [...a, n.id] : a;
      n.id !== -1 && n.aperture && t.push({
        virtualSource: h.clone(n.virtualSource),
        apertureVertices: n.aperture.vertices.map((u) => h.clone(u)),
        reflectionOrder: i,
        polygonId: n.id,
        polygonPath: c
      });
      for (const u of n.children)
        r(u, i + 1, c);
    };
    return r(this.beamTree.root, 0, []), t;
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
function se(s) {
  let e = 0;
  for (let t = 1; t < s.length; t++)
    e += h.distance(s[t - 1].position, s[t].position);
  return e;
}
function Ue(s, e = 343) {
  return se(s) / e;
}
function je(s) {
  return s.filter((e) => e.polygonId !== null).length;
}
const We = 0.05;
function Ye(s, e) {
  const t = Math.abs(h.dot(h.negate(s), e)), o = Math.max(-1, Math.min(1, t));
  return Math.acos(o);
}
function Ze(s, e) {
  const t = P.normal(s.plane);
  return h.dot(e, t) > 0 ? h.negate(t) : h.clone(t);
}
function Ke(s, e) {
  if (s.length < 2)
    throw new Error("Path must have at least 2 points (listener and source)");
  const t = h.clone(s[0].position), o = h.clone(s[s.length - 1].position), r = [], n = [];
  let i = 0;
  for (let a = 0; a < s.length - 1; a++) {
    const c = s[a].position, u = s[a + 1].position, l = h.distance(c, u);
    n.push({
      startPoint: h.clone(c),
      endPoint: h.clone(u),
      length: l,
      segmentIndex: a
    });
    const m = s[a + 1].polygonId;
    if (m !== null) {
      const d = e[m], f = s[a + 1].position, p = h.normalize(h.subtract(f, c)), v = s[a + 2]?.position;
      let I;
      v ? I = h.normalize(h.subtract(v, f)) : I = h.reflect(p, P.normal(d.plane));
      const b = Ze(d, p), R = Ye(p, b), y = R;
      i += l;
      const S = Math.abs(R - Math.PI / 2) < We;
      r.push({
        polygon: d,
        polygonId: m,
        hitPoint: h.clone(f),
        incidenceAngle: R,
        reflectionAngle: y,
        incomingDirection: p,
        outgoingDirection: I,
        surfaceNormal: b,
        reflectionOrder: r.length + 1,
        cumulativeDistance: i,
        incomingSegmentLength: l,
        isGrazing: S
      });
    } else
      i += l;
  }
  return {
    listenerPosition: t,
    sourcePosition: o,
    totalPathLength: i,
    reflectionCount: r.length,
    reflections: r,
    segments: n,
    simplePath: s
  };
}
class Qe {
  constructor(e) {
    this.position = h.clone(e);
  }
}
class Xe {
  constructor(e, t, o) {
    this.source = t, this.solver = new qe(e, t.position, o);
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
function Je() {
  const s = new le();
  s.setPoints([]);
  const e = new ce({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new g.Mesh(s, e);
}
const et = Y.scale(["#ff8a0b", "#000080"]).mode("lch");
function C(s, e) {
  const t = e + 1, o = et.colors(t), r = Math.min(s, t - 1), n = Y(o[r]);
  return parseInt(n.hex().slice(1), 16);
}
const tt = {
  name: "Beam Tracer",
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
  impulseResponseResult: "",
  hrtfSubjectId: "D1",
  headYaw: 0,
  headPitch: 0,
  headRoll: 0
};
class st extends ae {
  roomID;
  sourceIDs;
  receiverIDs;
  maxReflectionOrder;
  frequencies;
  levelTimeProgression;
  impulseResponseResult;
  _visualizationMode;
  _showAllBeams;
  _visibleOrders;
  _plotFrequency;
  _plotOrders;
  // Internal beam-trace solver instance
  btSolver = null;
  polygons = [];
  surfaceToPolygonIndex = /* @__PURE__ */ new Map();
  polygonToSurface = /* @__PURE__ */ new Map();
  // Binaural
  hrtfSubjectId;
  headYaw;
  headPitch;
  headRoll;
  binauralImpulseResponse;
  binauralPlaying = !1;
  // Results
  validPaths = [];
  impulseResponse;
  impulseResponsePlaying = !1;
  // Metrics
  lastMetrics = null;
  // Group for virtual source meshes (replaces Points for reliable raycasting)
  virtualSourcesGroup;
  // Map from virtual source mesh to beam data for click detection
  virtualSourceMap = /* @__PURE__ */ new Map();
  // Currently selected virtual source mesh
  selectedVirtualSource = null;
  // Click handler cleanup
  clickHandler = null;
  hoverHandler = null;
  // Selected path highlight (for LTP chart click interaction)
  selectedPath;
  selectedBeamsGroup;
  // Incremental update tracking: skip full beam tree rebuild when only the listener moved
  _lastSourcePos = null;
  _lastRoomID = "";
  _lastMaxOrder = -1;
  constructor(e = {}) {
    super(e);
    const t = { ...tt, ...e };
    if (this.kind = "beam-trace", this.uuid = t.uuid || L(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this.hrtfSubjectId = t.hrtfSubjectId, this.headYaw = t.headYaw, this.headPitch = t.headPitch, this.headRoll = t.headRoll, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this.levelTimeProgression = t.levelTimeProgression || L(), this.impulseResponseResult = t.impulseResponseResult || L(), !this.roomID) {
      const o = ue();
      o.length > 0 && (this.roomID = o[0].uuid);
    }
    A("ADD_RESULT", {
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
    }), A("ADD_RESULT", {
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
    }), this.selectedPath = Je(), D.markup.add(this.selectedPath), this.selectedBeamsGroup = new g.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", D.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new g.Group(), this.virtualSourcesGroup.name = "virtual-sources", D.markup.add(this.virtualSourcesGroup);
  }
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get c() {
    return Pe(this.temperature);
  }
  save() {
    return {
      ...he([
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
        "impulseResponseResult",
        "hrtfSubjectId",
        "headYaw",
        "headPitch",
        "headRoll"
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.frequencies = e.frequencies, this.levelTimeProgression = e.levelTimeProgression || L(), this.impulseResponseResult = e.impulseResponseResult || L(), this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this;
  }
  dispose() {
    this.clearVisualization(), this.removeClickHandler(), D.markup.remove(this.selectedPath), D.markup.remove(this.selectedBeamsGroup), D.markup.remove(this.virtualSourcesGroup), A("REMOVE_RESULT", this.levelTimeProgression), A("REMOVE_RESULT", this.impulseResponseResult);
  }
  setupClickHandler() {
    this.removeClickHandler();
    const e = D.renderer.domElement, t = (o) => {
      const r = e.getBoundingClientRect();
      return new g.Vector2(
        (o.clientX - r.left) / r.width * 2 - 1,
        -((o.clientY - r.top) / r.height) * 2 + 1
      );
    };
    this.hoverHandler = (o) => {
      if (this.virtualSourceMap.size === 0) {
        e.style.cursor = "default";
        return;
      }
      const r = t(o), n = new g.Raycaster();
      n.setFromCamera(r, D.camera);
      const i = Array.from(this.virtualSourceMap.keys());
      n.intersectObjects(i).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (o) => {
      if (o.button !== 0 || this.virtualSourceMap.size === 0) return;
      const r = t(o), n = new g.Raycaster();
      n.setFromCamera(r, D.camera);
      const i = Array.from(this.virtualSourceMap.keys()), a = n.intersectObjects(i);
      if (a.length > 0) {
        const c = a[0].object, u = this.virtualSourceMap.get(c);
        u && (this.selectedVirtualSource === c ? (this.selectedVirtualSource = null, this.clearSelectedBeams()) : (this.selectedVirtualSource = c, this.highlightVirtualSourcePath(u)));
      }
    }, e.addEventListener("click", this.clickHandler), e.addEventListener("mousemove", this.hoverHandler);
  }
  // Highlight the ray path from a clicked virtual source to the receiver
  // beam contains polygonPath which is the sequence of polygon IDs for reflections
  highlightVirtualSourcePath(e) {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const t = C(e.reflectionOrder, this.maxReflectionOrder), o = new g.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const r = x.getState().containers[this.receiverIDs[0]];
    if (!r) return;
    const n = r.position.clone(), i = new g.LineDashedMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), a = new g.BufferGeometry().setFromPoints([o, n]), c = new g.Line(a, i);
    c.computeLineDistances(), this.selectedBeamsGroup.add(c);
    const u = new g.SphereGeometry(0.18, 16, 16), l = new g.MeshBasicMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4
    }), m = new g.Mesh(u, l);
    m.position.copy(o), this.selectedBeamsGroup.add(m);
    const d = e.polygonPath;
    if (!d || d.length === 0) return;
    const f = e.reflectionOrder;
    for (const p of this.validPaths) {
      const v = p.order;
      if (v !== f) continue;
      let I = !0;
      for (let b = 0; b < d.length; b++) {
        const R = v - b;
        if (p.polygonIds[R] !== d[b]) {
          I = !1;
          break;
        }
      }
      if (I) {
        const b = p.points, R = p.order;
        for (let y = 0; y < b.length - 1; y++) {
          const S = b[y], M = b[y + 1], B = S.distanceTo(M), F = new g.Vector3().addVectors(S, M).multiplyScalar(0.5), k = R - y, oe = k === 0 ? 16777215 : C(k, this.maxReflectionOrder), re = new g.CylinderGeometry(0.025, 0.025, B, 8), ne = new g.MeshBasicMaterial({ color: oe }), z = new g.Mesh(re, ne);
          z.position.copy(F);
          const ie = new g.Vector3().subVectors(M, S).normalize(), G = new g.Quaternion();
          G.setFromUnitVectors(new g.Vector3(0, 1, 0), ie), z.setRotationFromQuaternion(G), this.selectedBeamsGroup.add(z);
        }
        for (let y = 1; y < p.points.length - 1; y++) {
          const S = R - y + 1, M = C(S, this.maxReflectionOrder), B = new g.SphereGeometry(0.08, 12, 12), F = new g.MeshBasicMaterial({ color: M }), k = new g.Mesh(B, F);
          k.position.copy(p.points[y]), this.selectedBeamsGroup.add(k);
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
    const t = [];
    return this.surfaceToPolygonIndex.clear(), this.polygonToSurface.clear(), e.allSurfaces.forEach((o) => {
      const r = this.surfaceToPolygons(o), n = t.length;
      r.forEach((i, a) => {
        this.polygonToSurface.set(n + a, o), t.push(i);
      }), this.surfaceToPolygonIndex.set(
        o.uuid,
        r.map((i, a) => n + a)
      );
    }), t;
  }
  // Convert a Surface to Polygon3D objects
  surfaceToPolygons(e) {
    const t = [], o = e.geometry, r = o.getAttribute("position");
    if (!r) return t;
    e.updateMatrixWorld(!0);
    const n = e.matrixWorld, i = o.getIndex(), a = r.array, c = (u, l, m) => {
      const d = new g.Vector3(
        a[u * 3],
        a[u * 3 + 1],
        a[u * 3 + 2]
      ).applyMatrix4(n), f = new g.Vector3(
        a[l * 3],
        a[l * 3 + 1],
        a[l * 3 + 2]
      ).applyMatrix4(n), p = new g.Vector3(
        a[m * 3],
        a[m * 3 + 1],
        a[m * 3 + 2]
      ).applyMatrix4(n), v = [
        [d.x, d.y, d.z],
        [f.x, f.y, f.z],
        [p.x, p.y, p.z]
      ], I = w.create(v);
      t.push(I);
    };
    if (i) {
      const u = i.array;
      for (let l = 0; l < u.length; l += 3)
        c(u[l], u[l + 1], u[l + 2]);
    } else {
      const u = r.count;
      for (let l = 0; l < u; l += 3)
        c(l, l + 1, l + 2);
    }
    return t;
  }
  // Check if the beam tree needs to be rebuilt (source moved, room changed, or order changed)
  needsBeamTreeRebuild() {
    if (!this.btSolver || this._lastRoomID !== this.roomID || this._lastMaxOrder !== this.maxReflectionOrder || this.sourceIDs.length === 0) return !0;
    const e = x.getState().containers[this.sourceIDs[0]];
    return !e || !this._lastSourcePos || !this._lastSourcePos.equals(e.position);
  }
  // Build/rebuild the beam-trace solver
  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const e = x.getState().containers[this.sourceIDs[0]];
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
    ], o = new Qe(t);
    this.btSolver = new Xe(this.polygons, o, {
      maxReflectionOrder: this.maxReflectionOrder
    }), this._lastSourcePos = e.position.clone(), this._lastRoomID = this.roomID, this._lastMaxOrder = this.maxReflectionOrder, console.log(`BeamTraceSolver: Built with ${this.polygons.length} polygons, max order ${this.maxReflectionOrder}`);
  }
  // Calculate paths to all receivers
  calculate() {
    if (this.sourceIDs.length === 0 || this.receiverIDs.length === 0) {
      console.warn("BeamTraceSolver: Need at least one source and one receiver");
      return;
    }
    if (this.needsBeamTreeRebuild() ? this.buildSolver() : this.btSolver && (this.btSolver.clearCache(), console.log("BeamTraceSolver: Reusing beam tree (listener-only change)")), !this.btSolver) {
      console.warn("BeamTraceSolver: Solver not built");
      return;
    }
    switch (this.validPaths = [], this.clearVisualization(), this.receiverIDs.forEach((t) => {
      const o = x.getState().containers[t];
      if (!o) return;
      const r = [
        o.position.x,
        o.position.y,
        o.position.z
      ], n = this.btSolver.getPaths(r);
      this.lastMetrics = this.btSolver.getMetrics();
      const i = this.btSolver.getDetailedPaths(r);
      n.forEach((a, c) => {
        const u = c < i.length ? i[c] : void 0, l = this.convertPath(a, u);
        this.validPaths.push(l);
      });
    }), this.validPaths.sort((t, o) => t.arrivalTime - o.arrivalTime), this._visualizationMode) {
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
    this.calculateLTP(), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), D.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e, t) {
    const o = e.map((l) => new g.Vector3(l.position[0], l.position[1], l.position[2])), r = se(e), n = Ue(e, this.c), i = je(e), a = e.map((l) => l.polygonId);
    let c;
    o.length >= 2 ? c = new g.Vector3().subVectors(o[0], o[1]).normalize().negate() : c = new g.Vector3(0, 0, 1);
    const u = t?.reflections.map((l) => ({
      polygonId: l.polygonId,
      hitPoint: new g.Vector3(l.hitPoint[0], l.hitPoint[1], l.hitPoint[2]),
      incidenceAngle: l.incidenceAngle,
      surfaceNormal: new g.Vector3(l.surfaceNormal[0], l.surfaceNormal[1], l.surfaceNormal[2]),
      isGrazing: l.isGrazing
    }));
    return { points: o, order: i, length: r, arrivalTime: n, polygonIds: a, arrivalDirection: c, reflections: u };
  }
  // Calculate Level Time Progression result
  calculateLTP() {
    if (this.validPaths.length === 0) return;
    const e = [...this.validPaths].sort((r, n) => r.arrivalTime - n.arrivalTime), t = { ...H.getState().results[this.levelTimeProgression] };
    t.data = [], t.info = {
      ...t.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };
    const o = this.receiverIDs.length > 0 ? x.getState().containers[this.receiverIDs[0]] : null;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], i = n.arrivalDirection, a = o ? o.getGain([i.x, i.y, i.z]) : 1, c = this.calculateArrivalPressure(t.info.initialSPL, n, a), u = q(c);
      t.data.push({
        time: n.arrivalTime,
        pressure: u,
        arrival: r + 1,
        order: n.order,
        uuid: `${this.uuid}-path-${r}`
      });
    }
    A("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: t });
  }
  // Clear LTP data
  clearLevelTimeProgressionData() {
    const e = { ...H.getState().results[this.levelTimeProgression] };
    e.data = [], A("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
  }
  // Setter for plot frequency (recalculates LTP when changed)
  set plotFrequency(e) {
    this._plotFrequency = e, this.calculateLTP();
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
    D.markup.clearLines(), D.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
  }
  drawPaths() {
    this.validPaths.filter((o) => this._visibleOrders.includes(o.order)).forEach((o) => {
      const r = C(o.order, this.maxReflectionOrder), n = (r >> 16 & 255) / 255, i = (r >> 8 & 255) / 255, a = (r & 255) / 255, c = [n, i, a];
      for (let u = 0; u < o.points.length - 1; u++) {
        const l = o.points[u], m = o.points[u + 1];
        D.markup.addLine(
          [l.x, l.y, l.z],
          [m.x, m.y, m.z],
          c,
          c
        );
      }
    });
    const t = D.markup.getUsageStats();
    this.lastMetrics && (this.lastMetrics.bufferUsage = t), t.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${t.linesUsed}/${t.linesCapacity}. Reduce reflection order.`) : t.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${t.linesPercent.toFixed(1)}%`);
  }
  drawBeams() {
    if (!this.btSolver) return;
    this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
    const e = this.validPaths, t = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      const n = r.polygonIds.filter((i) => i !== null).join(",");
      n && t.set(n, r);
    }), this.btSolver.getBeamsForVisualization(this.maxReflectionOrder).forEach((r) => {
      if (!this._visibleOrders.includes(r.reflectionOrder))
        return;
      const n = this.beamHasValidPath(r, e);
      if (!n && !this._showAllBeams)
        return;
      const i = Math.max(0.05, 0.1 - r.reflectionOrder * 0.01), a = C(r.reflectionOrder, this.maxReflectionOrder);
      let c = a;
      if (!n) {
        const f = (a >> 16 & 255) * 0.4 + 76.8, p = (a >> 8 & 255) * 0.4 + 128 * 0.6, v = (a & 255) * 0.4 + 128 * 0.6;
        c = Math.round(f) << 16 | Math.round(p) << 8 | Math.round(v);
      }
      const u = new g.Vector3(r.virtualSource[0], r.virtualSource[1], r.virtualSource[2]), l = new g.SphereGeometry(i, 12, 12), m = new g.MeshStandardMaterial({
        color: c,
        transparent: !n,
        opacity: n ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), d = new g.Mesh(l, m);
      d.position.copy(u), this.virtualSourcesGroup.add(d), n && this.virtualSourceMap.set(d, {
        ...r,
        polygonPath: r.polygonPath || []
      });
    }), this.setupClickHandler(), D.needsToRender = !0;
  }
  // Check if a beam has a valid path to the receiver
  beamHasValidPath(e, t) {
    const o = e.polygonPath;
    if (!o || o.length === 0) return !1;
    const r = e.reflectionOrder;
    for (const n of t) {
      if (n.order !== r) continue;
      let i = !0;
      for (let a = 0; a < o.length; a++) {
        const c = r - a;
        if (n.polygonIds[c] !== o[a]) {
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
    for (; this.virtualSourcesGroup.children.length > 0; ) {
      const e = this.virtualSourcesGroup.children[0];
      if (this.virtualSourcesGroup.remove(e), e instanceof g.Mesh) {
        e.geometry?.dispose();
        const t = e.material;
        if (Array.isArray(t))
          for (const o of t)
            o instanceof g.Material && o.dispose();
        else t instanceof g.Material && t.dispose();
      }
    }
  }
  // Calculate impulse response
  async calculateImpulseResponse() {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const e = $.sampleRate, o = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05, n = Math.floor(e * r) * 2, i = [];
    for (let l = 0; l < this.frequencies.length; l++)
      i.push(new Float32Array(n));
    const a = this.receiverIDs.length > 0 ? x.getState().containers[this.receiverIDs[0]] : null;
    for (const l of this.validPaths) {
      const m = Math.random() > 0.5 ? 1 : -1, d = l.arrivalDirection, f = a ? a.getGain([d.x, d.y, d.z]) : 1, p = this.calculateArrivalPressure(o, l, f), v = Math.floor(l.arrivalTime * e);
      for (let I = 0; I < this.frequencies.length; I++)
        v < i[I].length && (i[I][v] += p[I] * m);
    }
    const u = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((l, m) => {
      u.postMessage({ samples: i }), u.onmessage = (d) => {
        const f = d.data.samples, p = new Float32Array(f[0].length >> 1);
        let v = 0;
        for (let y = 0; y < f.length; y++)
          for (let S = 0; S < p.length; S++)
            p[S] += f[y][S], Math.abs(p[S]) > v && (v = Math.abs(p[S]));
        const I = ye(p), b = $.createOfflineContext(1, p.length, e), R = $.createBufferSource(I, b);
        R.connect(b.destination), R.start(), $.renderContextAsync(b).then((y) => {
          this.impulseResponse = y, this.updateImpulseResponseResult(y, e), l(y);
        }).catch(m).finally(() => u.terminate());
      }, u.onerror = (d) => {
        u.terminate(), m(d);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, t, o = 1) {
    const r = de(U(e)), n = t.points.length - 1;
    if (n >= 1 && this.sourceIDs.length > 0) {
      const l = x.getState().containers[this.sourceIDs[0]];
      if (l?.directivityHandler) {
        const m = t.points[n], d = t.points[n - 1], p = new g.Vector3().subVectors(d, m).normalize().clone().applyEuler(
          new g.Euler(-l.rotation.x, -l.rotation.y, -l.rotation.z, l.rotation.order)
        ), v = p.length();
        if (v > 1e-10) {
          const I = Math.acos(Math.min(1, Math.max(-1, p.z / v))), R = (Math.atan2(p.y, p.x) * 180 / Math.PI % 360 + 360) % 360, y = I * 180 / Math.PI;
          for (let S = 0; S < this.frequencies.length; S++) {
            const M = l.directivityHandler.getPressureAtPosition(0, this.frequencies[S], R, y), B = l.directivityHandler.getPressureAtPosition(0, this.frequencies[S], 0, 0);
            typeof M == "number" && typeof B == "number" && B > 0 && (r[S] *= (M / B) ** 2);
          }
        }
      }
    }
    let i = 0;
    t.polygonIds.forEach((l, m) => {
      if (l === null) return;
      const d = this.polygonToSurface.get(l);
      if (!d) {
        i++;
        return;
      }
      let f = 0;
      if (t.reflections && i < t.reflections.length)
        f = t.reflections[i].incidenceAngle;
      else if (m > 0 && m < t.points.length - 1) {
        const p = new g.Vector3().subVectors(t.points[m + 1], t.points[m]).normalize(), v = new g.Vector3().subVectors(t.points[m - 1], t.points[m]).normalize(), I = Math.min(1, Math.max(-1, p.dot(v)));
        f = Math.acos(I) / 2;
      }
      i++;
      for (let p = 0; p < this.frequencies.length; p++) {
        const v = Math.abs(d.reflectionFunction(this.frequencies[p], f));
        r[p] *= v;
      }
    });
    const a = q(fe(r)), c = ve(this.frequencies, this.temperature);
    for (let l = 0; l < this.frequencies.length; l++)
      a[l] -= c[l] * t.length;
    const u = U(a);
    if (o !== 1)
      for (let l = 0; l < u.length; l++)
        u[l] *= o;
    return u;
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, t) {
    const o = x.getState().containers, r = this.sourceIDs.length > 0 && o[this.sourceIDs[0]]?.name || "source", n = this.receiverIDs.length > 0 && o[this.receiverIDs[0]]?.name || "receiver", i = e.getChannelData(0), a = [], c = Math.max(1, Math.floor(i.length / 2e3));
    for (let l = 0; l < i.length; l += c)
      a.push({
        time: l / t,
        amplitude: i[l]
      });
    console.log(`BeamTraceSolver: Updating IR result with ${a.length} samples, duration: ${(i.length / t).toFixed(3)}s`);
    const u = {
      kind: V.ImpulseResponse,
      data: a,
      info: {
        sampleRate: t,
        sourceName: r,
        receiverName: n,
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR: ${r} → ${n}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    };
    A("UPDATE_RESULT", { uuid: this.impulseResponseResult, result: u });
  }
  async playImpulseResponse() {
    const e = await Se(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid,
      "BEAMTRACE_SET_PROPERTY"
    );
    this.impulseResponse = e.impulseResponse;
  }
  async downloadImpulseResponse(e, t = $.sampleRate) {
    const o = await Ie(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      e,
      t
    );
    this.impulseResponse = o.impulseResponse;
  }
  // Ambisonic impulse response storage
  ambisonicImpulseResponse;
  ambisonicOrder = 1;
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
    const t = $.sampleRate, r = Array(this.frequencies.length).fill(100), n = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (n <= 0) throw new Error("Invalid impulse response duration");
    const i = Math.floor(t * n) * 2;
    if (i < 2) throw new Error("Impulse response too short to process");
    const a = Me(e), c = [];
    for (let m = 0; m < this.frequencies.length; m++) {
      c.push([]);
      for (let d = 0; d < a; d++)
        c[m].push(new Float32Array(i));
    }
    const u = this.receiverIDs.length > 0 ? x.getState().containers[this.receiverIDs[0]] : null;
    for (const m of this.validPaths) {
      const d = Math.random() > 0.5 ? 1 : -1, f = m.arrivalDirection, p = u ? u.getGain([f.x, f.y, f.z]) : 1, v = this.calculateArrivalPressure(r, m, p), I = Math.floor(m.arrivalTime * t);
      if (I >= i) continue;
      const b = new Float32Array(1);
      for (let R = 0; R < this.frequencies.length; R++) {
        b[0] = v[R] * d;
        const y = we(b, f.x, f.y, f.z, e, "threejs");
        for (let S = 0; S < a; S++)
          c[R][S][I] += y[S][0];
      }
    }
    const l = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((m, d) => {
      const f = async (p) => new Promise((v) => {
        const I = [];
        for (let R = 0; R < this.frequencies.length; R++)
          I.push(c[R][p]);
        const b = l();
        b.postMessage({ samples: I }), b.onmessage = (R) => {
          const y = R.data.samples, S = new Float32Array(y[0].length >> 1);
          for (let M = 0; M < y.length; M++)
            for (let B = 0; B < S.length; B++)
              S[B] += y[M][B];
          b.terminate(), v(S);
        };
      });
      Promise.all(
        Array.from({ length: a }, (p, v) => f(v))
      ).then((p) => {
        let v = 0;
        for (const y of p)
          for (let S = 0; S < y.length; S++)
            Math.abs(y[S]) > v && (v = Math.abs(y[S]));
        if (v > 0)
          for (const y of p)
            for (let S = 0; S < y.length; S++)
              y[S] /= v;
        const I = p[0].length;
        if (I === 0) {
          d(new Error("Filtered signal has zero length"));
          return;
        }
        const R = $.createOfflineContext(a, I, t).createBuffer(a, I, t);
        for (let y = 0; y < a; y++)
          R.copyToChannel(new Float32Array(p[y]), y);
        this.ambisonicImpulseResponse = R, this.ambisonicOrder = e, m(R);
      }).catch(d);
    });
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const o = await be(
      this.ambisonicImpulseResponse,
      (r) => this.calculateAmbisonicImpulseResponse(r),
      this.ambisonicOrder,
      t,
      e
    );
    this.ambisonicImpulseResponse = o.ambisonicImpulseResponse, this.ambisonicOrder = o.ambisonicOrder;
  }
  async calculateBinauralImpulseResponse(e = 1) {
    return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await xe({
      ambisonicImpulseResponse: this.ambisonicImpulseResponse,
      order: e,
      hrtfSubjectId: this.hrtfSubjectId,
      headYaw: this.headYaw,
      headPitch: this.headPitch,
      headRoll: this.headRoll
    }), this.binauralImpulseResponse;
  }
  async playBinauralImpulseResponse(e = 1) {
    const t = await Re(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(e),
      this.uuid,
      "BEAMTRACE_SET_PROPERTY"
    );
    this.binauralImpulseResponse = t.binauralImpulseResponse;
  }
  async downloadBinauralImpulseResponse(e, t = 1) {
    const o = await De(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(t),
      e
    );
    this.binauralImpulseResponse = o.binauralImpulseResponse;
  }
  // Clear results
  reset() {
    this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), D.needsToRender = !0;
  }
  // Helper to clear highlighted beam lines
  clearSelectedBeams() {
    for (; this.selectedBeamsGroup.children.length > 0; ) {
      const e = this.selectedBeamsGroup.children[0];
      this.selectedBeamsGroup.remove(e), (e instanceof g.Mesh || e instanceof g.Line) && (e.geometry?.dispose(), e.material instanceof g.Material && e.material.dispose());
    }
  }
  // Getters and setters
  get room() {
    return x.getState().containers[this.roomID];
  }
  get sources() {
    return this.sourceIDs.map((e) => x.getState().containers[e]).filter(Boolean);
  }
  get receivers() {
    return this.receiverIDs.map((e) => x.getState().containers[e]).filter(Boolean);
  }
  get numValidPaths() {
    return this.validPaths.length;
  }
  set maxReflectionOrderReset(e) {
    this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), A("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
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
    const t = x.getState().containers[this.receiverIDs[0]];
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
    const e = x.getState().containers[this.receiverIDs[0]];
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
    const r = C(o.order, this.maxReflectionOrder), n = new g.LineBasicMaterial({
      color: r,
      linewidth: 2,
      transparent: !1
    });
    for (let i = 0; i < o.points.length - 1; i++) {
      const a = new g.BufferGeometry().setFromPoints([
        o.points[i],
        o.points[i + 1]
      ]), c = new g.Line(a, n);
      this.selectedBeamsGroup.add(c);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const i = x.getState().containers[this.receiverIDs[0]];
      if (i) {
        const a = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), c = o.polygonIds[o.order];
        if (c !== null) {
          const u = a.find(
            (l) => l.polygonId === c && l.reflectionOrder === o.order
          );
          if (u) {
            const l = new g.LineDashedMaterial({
              color: r,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), m = new g.Vector3(
              u.virtualSource[0],
              u.virtualSource[1],
              u.virtualSource[2]
            ), d = i.position.clone(), f = new g.BufferGeometry().setFromPoints([m, d]), p = new g.Line(f, l);
            p.computeLineDistances(), this.selectedBeamsGroup.add(p);
          }
        }
      }
    }
    console.log(`BeamTraceSolver: Highlighting path ${e} with order ${o.order}, arrival time ${o.arrivalTime.toFixed(4)}s`), D.needsToRender = !0;
  }
  // Clear the current path highlight
  clearPathHighlight() {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), D.needsToRender = !0;
  }
}
T("BEAMTRACE_SET_PROPERTY", me);
T("REMOVE_BEAMTRACE", pe);
T("ADD_BEAMTRACE", ge(st));
T("BEAMTRACE_CALCULATE", (s) => {
  _.getState().solvers[s].calculate(), setTimeout(() => A("BEAMTRACE_CALCULATE_COMPLETE", s), 0);
});
T("BEAMTRACE_RESET", (s) => {
  _.getState().solvers[s].reset();
});
T("BEAMTRACE_PLAY_IR", (s) => {
  _.getState().solvers[s].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
T("BEAMTRACE_DOWNLOAD_IR", (s) => {
  const e = _.getState().solvers[s], t = x.getState().containers, o = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", r = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", n = `ir-beamtrace-${o}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(n).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
T("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: s, order: e }) => {
  const t = _.getState().solvers[s], o = x.getState().containers, r = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", n = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-ambi-${r}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((a) => {
    window.alert(a.message || "Failed to download ambisonic impulse response");
  });
});
T("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid: s, order: e }) => {
  _.getState().solvers[s].playBinauralImpulseResponse(e).catch((o) => {
    window.alert(o.message || "Failed to play binaural impulse response");
  });
});
T("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid: s, order: e }) => {
  const t = _.getState().solvers[s], o = x.getState().containers, r = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", n = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-${r}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadBinauralImpulseResponse(i, e).catch((a) => {
    window.alert(a.message || "Failed to download binaural impulse response");
  });
});
T("SHOULD_ADD_BEAMTRACE", () => {
  A("ADD_BEAMTRACE", void 0);
});
export {
  st as BeamTraceSolver
};
//# sourceMappingURL=index-BBeeLBNG.mjs.map
