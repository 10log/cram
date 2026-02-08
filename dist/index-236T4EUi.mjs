import { S as ae } from "./solver-R8BUlJ5R.mjs";
import * as g from "three";
import { MeshLine as le, MeshLineMaterial as ce } from "three.meshline";
import { v as L, g as ue, e as T, R as V, r as R, p as he, u as M, a as G, P as q, b as de, L as U, I as fe, o as k, s as me, c as pe, d as ge, f as _ } from "./index-WPNQK-eO.mjs";
import { a as ve } from "./air-attenuation-CBIk1QMo.mjs";
import { s as Pe } from "./sound-speed-Biev-mJ1.mjs";
import { a as $, n as ye } from "./audio-engine-BltQIBir.mjs";
import { p as Se, d as be, a as Ie } from "./export-playback-Datwk8y5.mjs";
import K from "chroma-js";
import { e as Re, g as we } from "./ambisonics.es-Ci32Q6qr.mjs";
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
}, v = {
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
    return v.fromNormalAndPoint(n, s);
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
    return Math.abs(v.signedDistance(s, e));
  },
  /**
   * Classify a point relative to the plane
   */
  classifyPoint(s, e, t = 1e-6) {
    const o = v.signedDistance(s, e);
    return o > t ? "front" : o < -t ? "back" : "on";
  },
  /**
   * Check if a point is in front of the plane
   */
  isPointInFront(s, e, t = 1e-6) {
    return v.signedDistance(s, e) > t;
  },
  /**
   * Check if a point is behind the plane
   */
  isPointBehind(s, e, t = 1e-6) {
    return v.signedDistance(s, e) < -t;
  },
  /**
   * Check if a point is on the plane
   */
  isPointOn(s, e, t = 1e-6) {
    return Math.abs(v.signedDistance(s, e)) <= t;
  },
  /**
   * Mirror a point across the plane
   * p' = p - 2 * signedDistance(p) * normal
   */
  mirrorPoint(s, e) {
    const t = v.signedDistance(s, e), o = v.normal(e);
    return h.subtract(s, h.scale(o, 2 * t));
  },
  /**
   * Mirror a plane across another plane (for fail plane propagation)
   * This mirrors two points on the source plane and reconstructs.
   */
  mirrorPlane(s, e) {
    const t = v.normal(s);
    let o;
    Math.abs(t[2]) > 0.5 ? o = [0, 0, -s.d / s.c] : Math.abs(t[1]) > 0.5 ? o = [0, -s.d / s.b, 0] : o = [-s.d / s.a, 0, 0];
    const r = Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], n = h.normalize(h.cross(t, r)), i = h.add(o, n), a = h.cross(t, n), l = h.add(o, a), c = v.mirrorPoint(o, e), u = v.mirrorPoint(i, e), m = v.mirrorPoint(l, e);
    return v.fromPoints(c, u, m);
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
    const o = v.normal(t), r = h.dot(o, e);
    return Math.abs(r) < 1e-10 ? null : -(h.dot(o, s) + t.d) / r;
  },
  /**
   * Get the point of intersection between a ray and plane
   */
  rayIntersectionPoint(s, e, t) {
    const o = v.rayIntersection(s, e, t);
    return o === null ? null : h.add(s, h.scale(e, o));
  },
  /**
   * Project a point onto the plane
   */
  projectPoint(s, e) {
    const t = v.signedDistance(s, e), o = v.normal(e);
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
    const t = s.map((r) => h.clone(r)), o = v.fromPoints(t[0], t[1], t[2]);
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
    return v.normal(s.plane);
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
      const i = v.classifyPoint(n, e, t);
      i === "front" ? o++ : i === "back" && r++;
    }
    return o > 0 && r > 0 ? "spanning" : o > 0 ? "front" : r > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(s, e, t = 1e-6) {
    const o = v.normal(s.plane), r = s.vertices.length;
    for (let n = 0; n < r; n++) {
      const i = s.vertices[n], a = s.vertices[(n + 1) % r], l = h.subtract(a, i), c = h.subtract(e, i), u = h.cross(l, c);
      if (h.dot(u, o) < -t)
        return !1;
    }
    return !0;
  },
  /**
   * Ray-polygon intersection
   * Returns t parameter and intersection point, or null if no hit
   */
  rayIntersection(s, e, t, o = 1e-4) {
    const r = v.rayIntersection(s, e, t.plane);
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
    const e = [...s.vertices].reverse(), t = v.flip(s.plane);
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
function De(s, e, t = 1e-4) {
  const o = w.classify(s, e, t);
  if (o === "front" || o === "coplanar")
    return { front: s, back: null };
  if (o === "back")
    return { front: null, back: s };
  const r = [], n = [], i = s.vertices.length;
  for (let c = 0; c < i; c++) {
    const u = s.vertices[c], m = s.vertices[(c + 1) % i], f = v.signedDistance(u, e), d = v.signedDistance(m, e), p = f > t ? "front" : f < -t ? "back" : "on", y = d > t ? "front" : d < -t ? "back" : "on";
    if (p === "front" ? r.push(u) : (p === "back" || r.push(u), n.push(u)), p === "front" && y === "back" || p === "back" && y === "front") {
      const I = f / (f - d), b = h.lerp(u, m, I);
      r.push(b), n.push(b);
    }
  }
  const a = r.length >= 3 ? w.createWithPlane(r, s.plane, s.materialId) : null, l = n.length >= 3 ? w.createWithPlane(n, s.plane, s.materialId) : null;
  return { front: a, back: l };
}
function xe(s, e, t = 1e-4) {
  const o = s.vertices, r = [];
  if (o.length < 3)
    return null;
  for (let n = 0; n < o.length; n++) {
    const i = o[n], a = o[(n + 1) % o.length], l = v.signedDistance(i, e), c = v.signedDistance(a, e), u = l >= -t, m = c >= -t;
    if (u && r.push(i), u && !m || !u && m) {
      const f = l / (l - c), d = h.lerp(i, a, Math.max(0, Math.min(1, f)));
      r.push(d);
    }
  }
  return r.length < 3 ? null : w.createWithPlane(r, s.plane, s.materialId);
}
function Me(s, e, t = 1e-4) {
  let o = s;
  for (const r of e) {
    if (!o)
      return null;
    o = xe(o, r, t);
  }
  return o;
}
function Te(s, e, t = 1e-4) {
  for (const o of e) {
    let r = !0;
    for (const n of s.vertices)
      if (v.signedDistance(n, o) >= -t) {
        r = !1;
        break;
      }
    if (r)
      return !0;
  }
  return !1;
}
function Be(s) {
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
  const e = Ae(s), t = s[e], o = t.polygon.plane, r = [], n = [];
  for (let i = 0; i < s.length; i++) {
    if (i === e)
      continue;
    const a = s[i], { front: l, back: c } = De(a.polygon, o);
    l && r.push({ polygon: l, originalId: a.originalId }), c && n.push({ polygon: c, originalId: a.originalId });
  }
  return {
    plane: o,
    polygon: t.polygon,
    polygonId: t.originalId,
    front: H(r),
    back: H(n)
  };
}
function Ae(s) {
  if (s.length <= 3)
    return 0;
  let e = 0, t = 1 / 0;
  const o = Math.min(s.length, 10), r = Math.max(1, Math.floor(s.length / o));
  for (let n = 0; n < s.length; n += r) {
    const i = s[n].polygon.plane;
    let a = 0, l = 0, c = 0;
    for (let m = 0; m < s.length; m++) {
      if (n === m)
        continue;
      const f = w.classify(s[m].polygon, i);
      f === "front" ? a++ : f === "back" ? l++ : f === "spanning" && (a++, l++, c++);
    }
    const u = c * 8 + Math.abs(a - l);
    u < t && (t = u, e = n);
  }
  return e;
}
function O(s, e, t, o = 0, r = 1 / 0, n = -1) {
  if (!t)
    return null;
  const i = v.signedDistance(s, t.plane), a = v.normal(t.plane), l = h.dot(a, e);
  let c, u;
  i >= 0 ? (c = t.front, u = t.back) : (c = t.back, u = t.front);
  let m = null;
  Math.abs(l) > 1e-10 && (m = -i / l);
  let f = null;
  if (m === null || m < o) {
    if (f = O(s, e, c, o, r, n), !f && t.polygonId !== n) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, o, r, n));
  } else if (m > r) {
    if (f = O(s, e, c, o, r, n), !f && t.polygonId !== n) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, o, r, n));
  } else {
    if (f = O(s, e, c, o, m, n), !f && t.polygonId !== n) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, m, r, n));
  }
  return f;
}
function F(s, e, t, o, r, n) {
  if (!t)
    return null;
  const i = v.signedDistance(s, t.plane), a = v.normal(t.plane), l = h.dot(a, e);
  let c, u;
  i >= 0 ? (c = t.front, u = t.back) : (c = t.back, u = t.front);
  let m = null;
  Math.abs(l) > 1e-10 && (m = -i / l);
  let f = null;
  if (m === null || m < o) {
    if (f = F(s, e, c, o, r, n), !f && !n.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = F(s, e, u, o, r, n));
  } else if (m > r) {
    if (f = F(s, e, c, o, r, n), !f && !n.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = F(s, e, u, o, r, n));
  } else {
    if (f = F(s, e, c, o, m, n), !f && !n.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= r && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = F(s, e, u, m, r, n));
  }
  return f;
}
function Z(s, e) {
  const t = [], o = w.edges(e), r = w.centroid(e);
  for (const [i, a] of o) {
    let l = v.fromPoints(s, i, a);
    v.signedDistance(r, l) < 0 && (l = v.flip(l)), t.push(l);
  }
  let n = e.plane;
  return v.signedDistance(s, n) > 0 && (n = v.flip(n)), t.push(n), t;
}
function Y(s, e) {
  return v.mirrorPoint(s, e.plane);
}
function Q(s, e) {
  const t = w.centroid(s), o = h.subtract(e, t), r = v.normal(s.plane);
  return h.dot(r, o) > 0;
}
const ke = 1e-6;
function Fe(s, e, t) {
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
      const a = Y(s, i), l = Z(a, i), c = {
        id: n,
        parent: o,
        virtualSource: a,
        aperture: w.clone(i),
        boundaryPlanes: l,
        children: []
      };
      o.children.push(c), t > 1 && X(c, e, 2, t);
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
      if (Te(n, s.boundaryPlanes) || !Q(n, s.virtualSource))
        continue;
      const i = Me(n, s.boundaryPlanes);
      if (!i || w.area(i) < ke)
        continue;
      const l = Y(s.virtualSource, n), c = Z(l, i), u = {
        id: r,
        parent: s,
        virtualSource: l,
        aperture: i,
        boundaryPlanes: c,
        children: []
      };
      s.children.push(u), t < o && X(u, e, t + 1, o);
    }
}
function J(s, e) {
  s.children.length === 0 && s.id !== -1 && e.push(s);
  for (const t of s.children)
    J(t, e);
}
function $e(s) {
  ee(s.root);
}
function ee(s) {
  s.failPlane = void 0, s.failPlaneType = void 0;
  for (const e of s.children)
    ee(e);
}
function Oe(s, e, t) {
  if (!e.aperture || !e.boundaryPlanes)
    return null;
  let r = t[e.id].plane;
  if (v.signedDistance(e.virtualSource, r) < 0 && (r = v.flip(r)), v.signedDistance(s, r) < 0)
    return {
      plane: r,
      type: "polygon",
      nodeDepth: j(e)
    };
  const n = e.boundaryPlanes.length - 1;
  for (let i = 0; i < e.boundaryPlanes.length; i++) {
    const a = e.boundaryPlanes[i];
    if (v.signedDistance(s, a) < 0) {
      const l = i < n ? "edge" : "aperture";
      return {
        plane: a,
        type: l,
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
function Ee(s, e) {
  return v.signedDistance(s, e) < 0;
}
const te = 16;
function Ce(s, e = te) {
  const t = [];
  for (let o = 0; o < s.length; o += e)
    t.push({
      id: t.length,
      nodes: s.slice(o, Math.min(o + e, s.length)),
      skipSphere: null
    });
  return t;
}
function Le(s, e) {
  return h.distance(s, e.center) < e.radius;
}
function _e(s, e) {
  return e.skipSphere ? Le(s, e.skipSphere) ? "inside" : "outside" : "none";
}
function ze(s, e) {
  let t = 1 / 0;
  for (const o of e) {
    if (!o.failPlane)
      return null;
    const r = Math.abs(v.signedDistance(s, o.failPlane));
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
function Ve(s) {
  for (const e of s.nodes)
    e.failPlane = void 0, e.failPlaneType = void 0;
}
class He {
  /**
   * Create a new 3D beam tracing solver
   *
   * @param polygons - Room geometry as an array of polygons
   * @param sourcePosition - Position of the sound source
   * @param config - Optional configuration
   */
  constructor(e, t, o = {}) {
    const r = o.maxReflectionOrder ?? 5, n = o.bucketSize ?? te;
    this.polygons = e, this.sourcePosition = h.clone(t), this.epsilon = o.epsilon ?? 1e-4, this.bspRoot = Be(e), this.beamTree = Fe(t, e, r), this.buckets = Ce(this.beamTree.leafNodes, n), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
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
      const i = _e(e, n);
      if (i === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      i === "outside" && (W(n), Ve(n)), this.metrics.bucketsChecked++;
      let a = !0, l = !0;
      for (const c of n.nodes) {
        if (c.failPlane && Ee(e, c.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        c.failPlane && (c.failPlane = void 0, c.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const u = this.validatePath(e, c);
        u.valid && u.path ? (t.push(u.path), a = !1, l = !1) : c.failPlane || (l = !1);
      }
      a && l && n.nodes.length > 0 && (n.skipSphere = ze(e, n.nodes), n.skipSphere && this.metrics.skipSphereCount++);
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
    return this.getPaths(e).map((o) => We(o, this.polygons));
  }
  /**
   * Validate the direct path from listener to source
   */
  validateDirectPath(e) {
    const t = h.subtract(this.sourcePosition, e), o = h.length(t), r = h.normalize(t);
    this.metrics.raycastCount++;
    const n = O(e, r, this.bspRoot, 0, o, -1);
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
    let a = e, l = t;
    const c = /* @__PURE__ */ new Set();
    let u = 0;
    for (; l && l.id !== -1; ) {
      const m = this.polygons[l.id], f = l.virtualSource, d = h.normalize(h.subtract(f, a)), p = w.rayIntersection(a, d, m);
      if (!p)
        return o && console.log(`  [Segment ${u}] FAIL: No intersection with polygon ${l.id}`), null;
      o && (console.log(`  [Segment ${u}] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    Direction: [${d[0].toFixed(3)}, ${d[1].toFixed(3)}, ${d[2].toFixed(3)}]`), console.log(`    Hit polygon ${l.id} at t=${p.t.toFixed(3)}, point=[${p.point[0].toFixed(3)}, ${p.point[1].toFixed(3)}, ${p.point[2].toFixed(3)}]`)), c.add(l.id), this.metrics.raycastCount++;
      const y = F(a, d, this.bspRoot, this.epsilon, p.t - this.epsilon, c);
      if (y)
        return o && (console.log(`    OCCLUDED by polygon ${y.polygonId} at t=${y.t.toFixed(3)}, point=[${y.point[0].toFixed(3)}, ${y.point[1].toFixed(3)}, ${y.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), r.push({
        position: h.clone(p.point),
        polygonId: l.id
      }), a = p.point, l = l.parent, u++;
    }
    if (l) {
      const m = h.normalize(h.subtract(l.virtualSource, a)), f = h.distance(l.virtualSource, a);
      if (o) {
        console.log(`  [Final segment] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    To source: [${l.virtualSource[0].toFixed(3)}, ${l.virtualSource[1].toFixed(3)}, ${l.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${m[0].toFixed(3)}, ${m[1].toFixed(3)}, ${m[2].toFixed(3)}]`), console.log(`    Distance: ${f.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(f - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
        const I = a, b = l.virtualSource;
        if (I[1] < 5.575 && b[1] > 5.575 || I[1] > 5.575 && b[1] < 5.575) {
          const P = (5.575 - I[1]) / (b[1] - I[1]), S = I[0] + P * (b[0] - I[0]), D = I[2] + P * (b[2] - I[2]);
          if (console.log(`    CROSSING y=5.575 at t=${P.toFixed(3)}, x=${S.toFixed(3)}, z=${D.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), S >= 6.215 && S <= 12.43 && D >= 0 && D <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const x of [3, 4]) {
              const E = this.polygons[x], B = w.rayIntersection(a, m, E);
              B ? console.log(`      Polygon ${x}: HIT at t=${B.t.toFixed(3)}, point=[${B.point[0].toFixed(3)}, ${B.point[1].toFixed(3)}, ${B.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${x}: NO HIT`), console.log(`        Vertices: ${E.vertices.map((A) => `[${A[0].toFixed(2)}, ${A[1].toFixed(2)}, ${A[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const d = this.epsilon, p = f - this.epsilon, y = F(a, m, this.bspRoot, d, p, c);
      if (y)
        return o && console.log(`    OCCLUDED by polygon ${y.polygonId} at t=${y.t.toFixed(3)}, point=[${y.point[0].toFixed(3)}, ${y.point[1].toFixed(3)}, ${y.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), r.push({
        position: h.clone(l.virtualSource),
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
    const r = Oe(e, t, this.polygons);
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
    const o = (i, a, l) => {
      if (l === a.length)
        return i;
      for (const c of i.children)
        if (c.id === a[l])
          return o(c, a, l + 1);
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
    $e(this.beamTree);
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
      const l = n.id !== -1 ? [...a, n.id] : a;
      n.id !== -1 && n.aperture && t.push({
        virtualSource: h.clone(n.virtualSource),
        apertureVertices: n.aperture.vertices.map((c) => h.clone(c)),
        reflectionOrder: i,
        polygonId: n.id,
        polygonPath: l
      });
      for (const c of n.children)
        r(c, i + 1, l);
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
function Ne(s, e = 343) {
  return se(s) / e;
}
function Ge(s) {
  return s.filter((e) => e.polygonId !== null).length;
}
const qe = 0.05;
function Ue(s, e) {
  const t = Math.abs(h.dot(h.negate(s), e)), o = Math.max(-1, Math.min(1, t));
  return Math.acos(o);
}
function je(s, e) {
  const t = v.normal(s.plane);
  return h.dot(e, t) > 0 ? h.negate(t) : h.clone(t);
}
function We(s, e) {
  if (s.length < 2)
    throw new Error("Path must have at least 2 points (listener and source)");
  const t = h.clone(s[0].position), o = h.clone(s[s.length - 1].position), r = [], n = [];
  let i = 0;
  for (let a = 0; a < s.length - 1; a++) {
    const l = s[a].position, c = s[a + 1].position, u = h.distance(l, c);
    n.push({
      startPoint: h.clone(l),
      endPoint: h.clone(c),
      length: u,
      segmentIndex: a
    });
    const m = s[a + 1].polygonId;
    if (m !== null) {
      const f = e[m], d = s[a + 1].position, p = h.normalize(h.subtract(d, l)), y = s[a + 2]?.position;
      let I;
      y ? I = h.normalize(h.subtract(y, d)) : I = h.reflect(p, v.normal(f.plane));
      const b = je(f, p), P = Ue(p, b), S = P;
      i += u;
      const D = Math.abs(P - Math.PI / 2) < qe;
      r.push({
        polygon: f,
        polygonId: m,
        hitPoint: h.clone(d),
        incidenceAngle: P,
        reflectionAngle: S,
        incomingDirection: p,
        outgoingDirection: I,
        surfaceNormal: b,
        reflectionOrder: r.length + 1,
        cumulativeDistance: i,
        incomingSegmentLength: u,
        isGrazing: D
      });
    } else
      i += u;
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
class Ke {
  constructor(e) {
    this.position = h.clone(e);
  }
}
class Ze {
  constructor(e, t, o) {
    this.source = t, this.solver = new He(e, t.position, o);
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
function Ye() {
  const s = new le();
  s.setPoints([]);
  const e = new ce({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new g.Mesh(s, e);
}
const Qe = K.scale(["#ff8a0b", "#000080"]).mode("lch");
function C(s, e) {
  const t = e + 1, o = Qe.colors(t), r = Math.min(s, t - 1), n = K(o[r]);
  return parseInt(n.hex().slice(1), 16);
}
const Xe = {
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
  impulseResponseResult: ""
};
class Je extends ae {
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
  constructor(e = {}) {
    super(e);
    const t = { ...Xe, ...e };
    if (this.kind = "beam-trace", this.uuid = t.uuid || L(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this.levelTimeProgression = t.levelTimeProgression || L(), this.impulseResponseResult = t.impulseResponseResult || L(), !this.roomID) {
      const o = ue();
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
    }), this.selectedPath = Ye(), R.markup.add(this.selectedPath), this.selectedBeamsGroup = new g.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", R.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new g.Group(), this.virtualSourcesGroup.name = "virtual-sources", R.markup.add(this.virtualSourcesGroup);
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
      n.setFromCamera(r, R.camera);
      const i = Array.from(this.virtualSourceMap.keys());
      n.intersectObjects(i).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (o) => {
      if (o.button !== 0 || this.virtualSourceMap.size === 0) return;
      const r = t(o), n = new g.Raycaster();
      n.setFromCamera(r, R.camera);
      const i = Array.from(this.virtualSourceMap.keys()), a = n.intersectObjects(i);
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
    const t = C(e.reflectionOrder, this.maxReflectionOrder), o = new g.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const r = M.getState().containers[this.receiverIDs[0]];
    if (!r) return;
    const n = r.position.clone(), i = new g.LineDashedMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), a = new g.BufferGeometry().setFromPoints([o, n]), l = new g.Line(a, i);
    l.computeLineDistances(), this.selectedBeamsGroup.add(l);
    const c = new g.SphereGeometry(0.18, 16, 16), u = new g.MeshBasicMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4
    }), m = new g.Mesh(c, u);
    m.position.copy(o), this.selectedBeamsGroup.add(m);
    const f = e.polygonPath;
    if (!f || f.length === 0) return;
    const d = e.reflectionOrder;
    for (const p of this.validPaths) {
      const y = p.order;
      if (y !== d) continue;
      let I = !0;
      for (let b = 0; b < f.length; b++) {
        const P = y - b;
        if (p.polygonIds[P] !== f[b]) {
          I = !1;
          break;
        }
      }
      if (I) {
        const b = p.points, P = p.order;
        for (let S = 0; S < b.length - 1; S++) {
          const D = b[S], x = b[S + 1], E = D.distanceTo(x), B = new g.Vector3().addVectors(D, x).multiplyScalar(0.5), A = P - S, oe = A === 0 ? 16777215 : C(A, this.maxReflectionOrder), re = new g.CylinderGeometry(0.025, 0.025, E, 8), ne = new g.MeshBasicMaterial({ color: oe }), z = new g.Mesh(re, ne);
          z.position.copy(B);
          const ie = new g.Vector3().subVectors(x, D).normalize(), N = new g.Quaternion();
          N.setFromUnitVectors(new g.Vector3(0, 1, 0), ie), z.setRotationFromQuaternion(N), this.selectedBeamsGroup.add(z);
        }
        for (let S = 1; S < p.points.length - 1; S++) {
          const D = P - S + 1, x = C(D, this.maxReflectionOrder), E = new g.SphereGeometry(0.08, 12, 12), B = new g.MeshBasicMaterial({ color: x }), A = new g.Mesh(E, B);
          A.position.copy(p.points[S]), this.selectedBeamsGroup.add(A);
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
    const n = e.matrixWorld, i = o.getIndex(), a = r.array, l = (c, u, m) => {
      const f = new g.Vector3(
        a[c * 3],
        a[c * 3 + 1],
        a[c * 3 + 2]
      ).applyMatrix4(n), d = new g.Vector3(
        a[u * 3],
        a[u * 3 + 1],
        a[u * 3 + 2]
      ).applyMatrix4(n), p = new g.Vector3(
        a[m * 3],
        a[m * 3 + 1],
        a[m * 3 + 2]
      ).applyMatrix4(n), y = [
        [f.x, f.y, f.z],
        [d.x, d.y, d.z],
        [p.x, p.y, p.z]
      ], I = w.create(y);
      t.push(I);
    };
    if (i) {
      const c = i.array;
      for (let u = 0; u < c.length; u += 3)
        l(c[u], c[u + 1], c[u + 2]);
    } else {
      const c = r.count;
      for (let u = 0; u < c; u += 3)
        l(u, u + 1, u + 2);
    }
    return t;
  }
  // Build/rebuild the beam-trace solver
  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const e = M.getState().containers[this.sourceIDs[0]];
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
    ], o = new Ke(t);
    this.btSolver = new Ze(this.polygons, o, {
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
      const t = M.getState().containers[e];
      if (!t) return;
      const o = [
        t.position.x,
        t.position.y,
        t.position.z
      ], r = this.btSolver.getPaths(o);
      this.lastMetrics = this.btSolver.getMetrics(), r.forEach((n) => {
        const i = this.convertPath(n);
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
    this.calculateLTP(), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), R.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e) {
    const t = e.map((l) => new g.Vector3(l.position[0], l.position[1], l.position[2])), o = se(e), r = Ne(e, this.c), n = Ge(e), i = e.map((l) => l.polygonId);
    let a;
    return t.length >= 2 ? a = new g.Vector3().subVectors(t[0], t[1]).normalize().negate() : a = new g.Vector3(0, 0, 1), { points: t, order: n, length: o, arrivalTime: r, polygonIds: i, arrivalDirection: a };
  }
  // Calculate Level Time Progression result
  calculateLTP() {
    if (this.validPaths.length === 0) return;
    const e = [...this.validPaths].sort((o, r) => o.arrivalTime - r.arrivalTime), t = { ...G.getState().results[this.levelTimeProgression] };
    t.data = [], t.info = {
      ...t.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };
    for (let o = 0; o < e.length; o++) {
      const r = e[o], n = this.calculateArrivalPressure(t.info.initialSPL, r), i = q(n);
      t.data.push({
        time: r.arrivalTime,
        pressure: i,
        arrival: o + 1,
        order: r.order,
        uuid: `${this.uuid}-path-${o}`
      });
    }
    T("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: t });
  }
  // Clear LTP data
  clearLevelTimeProgressionData() {
    const e = { ...G.getState().results[this.levelTimeProgression] };
    e.data = [], T("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
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
    R.markup.clearLines(), R.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
  }
  drawPaths() {
    this.validPaths.filter((o) => this._visibleOrders.includes(o.order)).forEach((o) => {
      const r = C(o.order, this.maxReflectionOrder), n = (r >> 16 & 255) / 255, i = (r >> 8 & 255) / 255, a = (r & 255) / 255, l = [n, i, a];
      for (let c = 0; c < o.points.length - 1; c++) {
        const u = o.points[c], m = o.points[c + 1];
        R.markup.addLine(
          [u.x, u.y, u.z],
          [m.x, m.y, m.z],
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
      let l = a;
      if (!n) {
        const d = (a >> 16 & 255) * 0.4 + 76.8, p = (a >> 8 & 255) * 0.4 + 128 * 0.6, y = (a & 255) * 0.4 + 128 * 0.6;
        l = Math.round(d) << 16 | Math.round(p) << 8 | Math.round(y);
      }
      const c = new g.Vector3(r.virtualSource[0], r.virtualSource[1], r.virtualSource[2]), u = new g.SphereGeometry(i, 12, 12), m = new g.MeshStandardMaterial({
        color: l,
        transparent: !n,
        opacity: n ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), f = new g.Mesh(u, m);
      f.position.copy(c), this.virtualSourcesGroup.add(f), n && this.virtualSourceMap.set(f, {
        ...r,
        polygonPath: r.polygonPath || []
      });
    }), this.setupClickHandler(), R.needsToRender = !0;
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
        const l = r - a;
        if (n.polygonIds[l] !== o[a]) {
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
    for (let c = 0; c < this.frequencies.length; c++)
      i.push(new Float32Array(n));
    for (const c of this.validPaths) {
      const u = Math.random() > 0.5 ? 1 : -1, m = this.calculateArrivalPressure(o, c), f = Math.floor(c.arrivalTime * e);
      for (let d = 0; d < this.frequencies.length; d++)
        f < i[d].length && (i[d][f] += m[d] * u);
    }
    const l = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((c, u) => {
      l.postMessage({ samples: i }), l.onmessage = (m) => {
        const f = m.data.samples, d = new Float32Array(f[0].length >> 1);
        let p = 0;
        for (let P = 0; P < f.length; P++)
          for (let S = 0; S < d.length; S++)
            d[S] += f[P][S], Math.abs(d[S]) > p && (p = Math.abs(d[S]));
        const y = ye(d), I = $.createOfflineContext(1, d.length, e), b = $.createBufferSource(y, I);
        b.connect(I.destination), b.start(), $.renderContextAsync(I).then((P) => {
          this.impulseResponse = P, this.updateImpulseResponseResult(P, e), c(P);
        }).catch(u).finally(() => l.terminate());
      }, l.onerror = (m) => {
        l.terminate(), u(m);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, t) {
    const o = de(U(e));
    t.polygonIds.forEach((i, a) => {
      if (i === null) return;
      const l = this.polygonToSurface.get(i);
      if (!l) return;
      let c = 0;
      if (a > 0 && a < t.points.length - 1) {
        const u = new g.Vector3().subVectors(t.points[a + 1], t.points[a]).normalize(), m = new g.Vector3().subVectors(t.points[a - 1], t.points[a]).normalize(), f = Math.min(1, Math.max(-1, u.dot(m)));
        c = Math.acos(f) / 2;
      }
      for (let u = 0; u < this.frequencies.length; u++) {
        const m = Math.abs(l.reflectionFunction(this.frequencies[u], c));
        o[u] *= m;
      }
    });
    const r = q(fe(o)), n = ve(this.frequencies, this.temperature);
    for (let i = 0; i < this.frequencies.length; i++)
      r[i] -= n[i] * t.length;
    return U(r);
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, t) {
    const o = M.getState().containers, r = this.sourceIDs.length > 0 && o[this.sourceIDs[0]]?.name || "source", n = this.receiverIDs.length > 0 && o[this.receiverIDs[0]]?.name || "receiver", i = e.getChannelData(0), a = [], l = Math.max(1, Math.floor(i.length / 2e3));
    for (let u = 0; u < i.length; u += l)
      a.push({
        time: u / t,
        amplitude: i[u]
      });
    console.log(`BeamTraceSolver: Updating IR result with ${a.length} samples, duration: ${(i.length / t).toFixed(3)}s`);
    const c = {
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
    T("UPDATE_RESULT", { uuid: this.impulseResponseResult, result: c });
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
    const o = await be(
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
    const a = we(e), l = [];
    for (let u = 0; u < this.frequencies.length; u++) {
      l.push([]);
      for (let m = 0; m < a; m++)
        l[u].push(new Float32Array(i));
    }
    for (const u of this.validPaths) {
      const m = Math.random() > 0.5 ? 1 : -1, f = this.calculateArrivalPressure(r, u), d = Math.floor(u.arrivalTime * t);
      if (d >= i) continue;
      const p = u.arrivalDirection, y = new Float32Array(1);
      for (let I = 0; I < this.frequencies.length; I++) {
        y[0] = f[I] * m;
        const b = Re(y, p.x, p.y, p.z, e, "threejs");
        for (let P = 0; P < a; P++)
          l[I][P][d] += b[P][0];
      }
    }
    const c = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((u, m) => {
      const f = async (d) => new Promise((p) => {
        const y = [];
        for (let b = 0; b < this.frequencies.length; b++)
          y.push(l[b][d]);
        const I = c();
        I.postMessage({ samples: y }), I.onmessage = (b) => {
          const P = b.data.samples, S = new Float32Array(P[0].length >> 1);
          for (let D = 0; D < P.length; D++)
            for (let x = 0; x < S.length; x++)
              S[x] += P[D][x];
          I.terminate(), p(S);
        };
      });
      Promise.all(
        Array.from({ length: a }, (d, p) => f(p))
      ).then((d) => {
        let p = 0;
        for (const P of d)
          for (let S = 0; S < P.length; S++)
            Math.abs(P[S]) > p && (p = Math.abs(P[S]));
        if (p > 0)
          for (const P of d)
            for (let S = 0; S < P.length; S++)
              P[S] /= p;
        const y = d[0].length;
        if (y === 0) {
          m(new Error("Filtered signal has zero length"));
          return;
        }
        const b = $.createOfflineContext(a, y, t).createBuffer(a, y, t);
        for (let P = 0; P < a; P++)
          b.copyToChannel(new Float32Array(d[P]), P);
        this.ambisonicImpulseResponse = b, this.ambisonicOrder = e, u(b);
      }).catch(m);
    });
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const o = await Ie(
      this.ambisonicImpulseResponse,
      (r) => this.calculateAmbisonicImpulseResponse(r),
      this.ambisonicOrder,
      t,
      e
    );
    this.ambisonicImpulseResponse = o.ambisonicImpulseResponse, this.ambisonicOrder = o.ambisonicOrder;
  }
  // Clear results
  reset() {
    this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), R.needsToRender = !0;
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
    return M.getState().containers[this.roomID];
  }
  get sources() {
    return this.sourceIDs.map((e) => M.getState().containers[e]).filter(Boolean);
  }
  get receivers() {
    return this.receiverIDs.map((e) => M.getState().containers[e]).filter(Boolean);
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
    const t = M.getState().containers[this.receiverIDs[0]];
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
    const e = M.getState().containers[this.receiverIDs[0]];
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
      ]), l = new g.Line(a, n);
      this.selectedBeamsGroup.add(l);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const i = M.getState().containers[this.receiverIDs[0]];
      if (i) {
        const a = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), l = o.polygonIds[o.order];
        if (l !== null) {
          const c = a.find(
            (u) => u.polygonId === l && u.reflectionOrder === o.order
          );
          if (c) {
            const u = new g.LineDashedMaterial({
              color: r,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), m = new g.Vector3(
              c.virtualSource[0],
              c.virtualSource[1],
              c.virtualSource[2]
            ), f = i.position.clone(), d = new g.BufferGeometry().setFromPoints([m, f]), p = new g.Line(d, u);
            p.computeLineDistances(), this.selectedBeamsGroup.add(p);
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
k("BEAMTRACE_SET_PROPERTY", me);
k("REMOVE_BEAMTRACE", pe);
k("ADD_BEAMTRACE", ge(Je));
k("BEAMTRACE_CALCULATE", (s) => {
  _.getState().solvers[s].calculate(), setTimeout(() => T("BEAMTRACE_CALCULATE_COMPLETE", s), 0);
});
k("BEAMTRACE_RESET", (s) => {
  _.getState().solvers[s].reset();
});
k("BEAMTRACE_PLAY_IR", (s) => {
  _.getState().solvers[s].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
k("BEAMTRACE_DOWNLOAD_IR", (s) => {
  const e = _.getState().solvers[s], t = M.getState().containers, o = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", r = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", n = `ir-beamtrace-${o}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(n).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
k("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: s, order: e }) => {
  const t = _.getState().solvers[s], o = M.getState().containers, r = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", n = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-ambi-${r}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((a) => {
    window.alert(a.message || "Failed to download ambisonic impulse response");
  });
});
k("SHOULD_ADD_BEAMTRACE", () => {
  T("ADD_BEAMTRACE", void 0);
});
export {
  Je as BeamTraceSolver
};
//# sourceMappingURL=index-236T4EUi.mjs.map
