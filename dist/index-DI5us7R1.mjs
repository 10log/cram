import { S as he } from "./solver-BSMLX2tM.mjs";
import * as g from "three";
import { MeshLine as de, MeshLineMaterial as fe } from "three.meshline";
import { v as L, g as pe, e as T, R as V, r as R, p as me, u as B, a as G, P as q, b as ge, L as U, I as ve, F as j, o as k, s as Pe, c as ye, d as Se, f as _ } from "./index-CGV1szrQ.mjs";
import { a as be } from "./air-attenuation-CBIk1QMo.mjs";
import { s as Ie } from "./sound-speed-Biev-mJ1.mjs";
import { a as M, n as W, w as K } from "./audio-engine-C-iA55bw.mjs";
import X from "chroma-js";
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
    const o = h.subtract(e, s), n = h.subtract(t, s), r = h.normalize(h.cross(o, n));
    return v.fromNormalAndPoint(r, s);
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
    const n = Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], r = h.normalize(h.cross(t, n)), i = h.add(o, r), a = h.cross(t, r), l = h.add(o, a), c = v.mirrorPoint(o, e), u = v.mirrorPoint(i, e), p = v.mirrorPoint(l, e);
    return v.fromPoints(c, u, p);
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
    const o = v.normal(t), n = h.dot(o, e);
    return Math.abs(n) < 1e-10 ? null : -(h.dot(o, s) + t.d) / n;
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
    const t = s.map((n) => h.clone(n)), o = v.fromPoints(t[0], t[1], t[2]);
    return { vertices: t, plane: o, materialId: e };
  },
  /**
   * Create a polygon with an explicit plane (for split polygons that may be degenerate)
   */
  createWithPlane(s, e, t) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    return { vertices: s.map((n) => h.clone(n)), plane: e, materialId: t };
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
      const n = s.vertices[o], r = s.vertices[o + 1], i = h.cross(h.subtract(n, t), h.subtract(r, t));
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
    let o = 0, n = 0;
    for (const r of s.vertices) {
      const i = v.classifyPoint(r, e, t);
      i === "front" ? o++ : i === "back" && n++;
    }
    return o > 0 && n > 0 ? "spanning" : o > 0 ? "front" : n > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(s, e, t = 1e-6) {
    const o = v.normal(s.plane), n = s.vertices.length;
    for (let r = 0; r < n; r++) {
      const i = s.vertices[r], a = s.vertices[(r + 1) % n], l = h.subtract(a, i), c = h.subtract(e, i), u = h.cross(l, c);
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
    const n = v.rayIntersection(s, e, t.plane);
    if (n === null || n < 0)
      return null;
    const r = h.add(s, h.scale(e, n));
    return w.containsPoint(t, r, o) ? { t: n, point: r } : null;
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
function xe(s, e, t = 1e-4) {
  const o = w.classify(s, e, t);
  if (o === "front" || o === "coplanar")
    return { front: s, back: null };
  if (o === "back")
    return { front: null, back: s };
  const n = [], r = [], i = s.vertices.length;
  for (let c = 0; c < i; c++) {
    const u = s.vertices[c], p = s.vertices[(c + 1) % i], f = v.signedDistance(u, e), d = v.signedDistance(p, e), m = f > t ? "front" : f < -t ? "back" : "on", y = d > t ? "front" : d < -t ? "back" : "on";
    if (m === "front" ? n.push(u) : (m === "back" || n.push(u), r.push(u)), m === "front" && y === "back" || m === "back" && y === "front") {
      const I = f / (f - d), b = h.lerp(u, p, I);
      n.push(b), r.push(b);
    }
  }
  const a = n.length >= 3 ? w.createWithPlane(n, s.plane, s.materialId) : null, l = r.length >= 3 ? w.createWithPlane(r, s.plane, s.materialId) : null;
  return { front: a, back: l };
}
function De(s, e, t = 1e-4) {
  const o = s.vertices, n = [];
  if (o.length < 3)
    return null;
  for (let r = 0; r < o.length; r++) {
    const i = o[r], a = o[(r + 1) % o.length], l = v.signedDistance(i, e), c = v.signedDistance(a, e), u = l >= -t, p = c >= -t;
    if (u && n.push(i), u && !p || !u && p) {
      const f = l / (l - c), d = h.lerp(i, a, Math.max(0, Math.min(1, f)));
      n.push(d);
    }
  }
  return n.length < 3 ? null : w.createWithPlane(n, s.plane, s.materialId);
}
function Me(s, e, t = 1e-4) {
  let o = s;
  for (const n of e) {
    if (!o)
      return null;
    o = De(o, n, t);
  }
  return o;
}
function Te(s, e, t = 1e-4) {
  for (const o of e) {
    let n = !0;
    for (const r of s.vertices)
      if (v.signedDistance(r, o) >= -t) {
        n = !1;
        break;
      }
    if (n)
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
  const e = Ae(s), t = s[e], o = t.polygon.plane, n = [], r = [];
  for (let i = 0; i < s.length; i++) {
    if (i === e)
      continue;
    const a = s[i], { front: l, back: c } = xe(a.polygon, o);
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
function Ae(s) {
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
      const f = w.classify(s[p].polygon, i);
      f === "front" ? a++ : f === "back" ? l++ : f === "spanning" && (a++, l++, c++);
    }
    const u = c * 8 + Math.abs(a - l);
    u < t && (t = u, e = r);
  }
  return e;
}
function O(s, e, t, o = 0, n = 1 / 0, r = -1) {
  if (!t)
    return null;
  const i = v.signedDistance(s, t.plane), a = v.normal(t.plane), l = h.dot(a, e);
  let c, u;
  i >= 0 ? (c = t.front, u = t.back) : (c = t.back, u = t.front);
  let p = null;
  Math.abs(l) > 1e-10 && (p = -i / l);
  let f = null;
  if (p === null || p < o) {
    if (f = O(s, e, c, o, n, r), !f && t.polygonId !== r) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, o, n, r));
  } else if (p > n) {
    if (f = O(s, e, c, o, n, r), !f && t.polygonId !== r) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, o, n, r));
  } else {
    if (f = O(s, e, c, o, p, r), !f && t.polygonId !== r) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = O(s, e, u, p, n, r));
  }
  return f;
}
function $(s, e, t, o, n, r) {
  if (!t)
    return null;
  const i = v.signedDistance(s, t.plane), a = v.normal(t.plane), l = h.dot(a, e);
  let c, u;
  i >= 0 ? (c = t.front, u = t.back) : (c = t.back, u = t.front);
  let p = null;
  Math.abs(l) > 1e-10 && (p = -i / l);
  let f = null;
  if (p === null || p < o) {
    if (f = $(s, e, c, o, n, r), !f && !r.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, u, o, n, r));
  } else if (p > n) {
    if (f = $(s, e, c, o, n, r), !f && !r.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, u, o, n, r));
  } else {
    if (f = $(s, e, c, o, p, r), !f && !r.has(t.polygonId)) {
      const d = w.rayIntersection(s, e, t.polygon);
      d && d.t >= o && d.t <= n && (f = {
        t: d.t,
        point: d.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    f || (f = $(s, e, u, p, n, r));
  }
  return f;
}
function J(s, e) {
  const t = [], o = w.edges(e), n = w.centroid(e);
  for (const [i, a] of o) {
    let l = v.fromPoints(s, i, a);
    v.signedDistance(n, l) < 0 && (l = v.flip(l)), t.push(l);
  }
  let r = e.plane;
  return v.signedDistance(s, r) > 0 && (r = v.flip(r)), t.push(r), t;
}
function ee(s, e) {
  return v.mirrorPoint(s, e.plane);
}
function te(s, e) {
  const t = w.centroid(s), o = h.subtract(e, t), n = v.normal(s.plane);
  return h.dot(n, o) > 0;
}
const Fe = 1e-6;
function ke(s, e, t) {
  const o = {
    id: -1,
    parent: null,
    virtualSource: h.clone(s),
    children: []
  };
  if (t >= 1)
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      if (!te(i, s))
        continue;
      const a = ee(s, i), l = J(a, i), c = {
        id: r,
        parent: o,
        virtualSource: a,
        aperture: w.clone(i),
        boundaryPlanes: l,
        children: []
      };
      o.children.push(c), t > 1 && se(c, e, 2, t);
    }
  const n = [];
  return oe(o, n), {
    root: o,
    leafNodes: n,
    polygons: e,
    maxReflectionOrder: t
  };
}
function se(s, e, t, o) {
  if (!(t > o) && !(!s.boundaryPlanes || !s.aperture))
    for (let n = 0; n < e.length; n++) {
      if (n === s.id)
        continue;
      const r = e[n];
      if (Te(r, s.boundaryPlanes) || !te(r, s.virtualSource))
        continue;
      const i = Me(r, s.boundaryPlanes);
      if (!i || w.area(i) < Fe)
        continue;
      const l = ee(s.virtualSource, r), c = J(l, i), u = {
        id: n,
        parent: s,
        virtualSource: l,
        aperture: i,
        boundaryPlanes: c,
        children: []
      };
      s.children.push(u), t < o && se(u, e, t + 1, o);
    }
}
function oe(s, e) {
  s.children.length === 0 && s.id !== -1 && e.push(s);
  for (const t of s.children)
    oe(t, e);
}
function $e(s) {
  ne(s.root);
}
function ne(s) {
  s.failPlane = void 0, s.failPlaneType = void 0;
  for (const e of s.children)
    ne(e);
}
function Oe(s, e, t) {
  if (!e.aperture || !e.boundaryPlanes)
    return null;
  let n = t[e.id].plane;
  if (v.signedDistance(e.virtualSource, n) < 0 && (n = v.flip(n)), v.signedDistance(s, n) < 0)
    return {
      plane: n,
      type: "polygon",
      nodeDepth: Z(e)
    };
  const r = e.boundaryPlanes.length - 1;
  for (let i = 0; i < e.boundaryPlanes.length; i++) {
    const a = e.boundaryPlanes[i];
    if (v.signedDistance(s, a) < 0) {
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
function Ee(s, e) {
  return v.signedDistance(s, e) < 0;
}
const re = 16;
function Ce(s, e = re) {
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
    const n = Math.abs(v.signedDistance(s, o.failPlane));
    t = Math.min(t, n);
  }
  return t === 1 / 0 || t <= 1e-10 ? null : {
    center: h.clone(s),
    radius: t
  };
}
function Y(s) {
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
    const n = o.maxReflectionOrder ?? 5, r = o.bucketSize ?? re;
    this.polygons = e, this.sourcePosition = h.clone(t), this.epsilon = o.epsilon ?? 1e-4, this.bspRoot = Be(e), this.beamTree = ke(t, e, n), this.buckets = Ce(this.beamTree.leafNodes, r), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
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
      const i = _e(e, r);
      if (i === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      i === "outside" && (Y(r), Ve(r)), this.metrics.bucketsChecked++;
      let a = !0, l = !0;
      for (const c of r.nodes) {
        if (c.failPlane && Ee(e, c.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        c.failPlane && (c.failPlane = void 0, c.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const u = this.validatePath(e, c);
        u.valid && u.path ? (t.push(u.path), a = !1, l = !1) : c.failPlane || (l = !1);
      }
      a && l && r.nodes.length > 0 && (r.skipSphere = ze(e, r.nodes), r.skipSphere && this.metrics.skipSphereCount++);
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
    const t = h.subtract(this.sourcePosition, e), o = h.length(t), n = h.normalize(t);
    this.metrics.raycastCount++;
    const r = O(e, n, this.bspRoot, 0, o, -1);
    return r && r.t < o - this.epsilon ? null : [
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
      { position: h.clone(e), polygonId: null }
    ], r = [];
    let i = t;
    for (; i && i.id !== -1; )
      r.unshift(i.id), i = i.parent;
    o && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${r.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
    let a = e, l = t;
    const c = /* @__PURE__ */ new Set();
    let u = 0;
    for (; l && l.id !== -1; ) {
      const p = this.polygons[l.id], f = l.virtualSource, d = h.normalize(h.subtract(f, a)), m = w.rayIntersection(a, d, p);
      if (!m)
        return o && console.log(`  [Segment ${u}] FAIL: No intersection with polygon ${l.id}`), null;
      o && (console.log(`  [Segment ${u}] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    Direction: [${d[0].toFixed(3)}, ${d[1].toFixed(3)}, ${d[2].toFixed(3)}]`), console.log(`    Hit polygon ${l.id} at t=${m.t.toFixed(3)}, point=[${m.point[0].toFixed(3)}, ${m.point[1].toFixed(3)}, ${m.point[2].toFixed(3)}]`)), c.add(l.id), this.metrics.raycastCount++;
      const y = $(a, d, this.bspRoot, this.epsilon, m.t - this.epsilon, c);
      if (y)
        return o && (console.log(`    OCCLUDED by polygon ${y.polygonId} at t=${y.t.toFixed(3)}, point=[${y.point[0].toFixed(3)}, ${y.point[1].toFixed(3)}, ${y.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(c).join(", ")}])`), n.push({
        position: h.clone(m.point),
        polygonId: l.id
      }), a = m.point, l = l.parent, u++;
    }
    if (l) {
      const p = h.normalize(h.subtract(l.virtualSource, a)), f = h.distance(l.virtualSource, a);
      if (o) {
        console.log(`  [Final segment] Ray from [${a[0].toFixed(3)}, ${a[1].toFixed(3)}, ${a[2].toFixed(3)}]`), console.log(`    To source: [${l.virtualSource[0].toFixed(3)}, ${l.virtualSource[1].toFixed(3)}, ${l.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${p[0].toFixed(3)}, ${p[1].toFixed(3)}, ${p[2].toFixed(3)}]`), console.log(`    Distance: ${f.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(f - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(c).join(", ")}]`);
        const I = a, b = l.virtualSource;
        if (I[1] < 5.575 && b[1] > 5.575 || I[1] > 5.575 && b[1] < 5.575) {
          const P = (5.575 - I[1]) / (b[1] - I[1]), S = I[0] + P * (b[0] - I[0]), x = I[2] + P * (b[2] - I[2]);
          if (console.log(`    CROSSING y=5.575 at t=${P.toFixed(3)}, x=${S.toFixed(3)}, z=${x.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), S >= 6.215 && S <= 12.43 && x >= 0 && x <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const D of [3, 4]) {
              const E = this.polygons[D], A = w.rayIntersection(a, p, E);
              A ? console.log(`      Polygon ${D}: HIT at t=${A.t.toFixed(3)}, point=[${A.point[0].toFixed(3)}, ${A.point[1].toFixed(3)}, ${A.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${D}: NO HIT`), console.log(`        Vertices: ${E.vertices.map((F) => `[${F[0].toFixed(2)}, ${F[1].toFixed(2)}, ${F[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const d = this.epsilon, m = f - this.epsilon, y = $(a, p, this.bspRoot, d, m, c);
      if (y)
        return o && console.log(`    OCCLUDED by polygon ${y.polygonId} at t=${y.t.toFixed(3)}, point=[${y.point[0].toFixed(3)}, ${y.point[1].toFixed(3)}, ${y.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), n.push({
        position: h.clone(l.virtualSource),
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
    const n = Oe(e, t, this.polygons);
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
    $e(this.beamTree);
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
    return h.clone(this.sourcePosition);
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
        virtualSource: h.clone(r.virtualSource),
        apertureVertices: r.aperture.vertices.map((c) => h.clone(c)),
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
function ie(s) {
  let e = 0;
  for (let t = 1; t < s.length; t++)
    e += h.distance(s[t - 1].position, s[t].position);
  return e;
}
function Ne(s, e = 343) {
  return ie(s) / e;
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
  const t = h.clone(s[0].position), o = h.clone(s[s.length - 1].position), n = [], r = [];
  let i = 0;
  for (let a = 0; a < s.length - 1; a++) {
    const l = s[a].position, c = s[a + 1].position, u = h.distance(l, c);
    r.push({
      startPoint: h.clone(l),
      endPoint: h.clone(c),
      length: u,
      segmentIndex: a
    });
    const p = s[a + 1].polygonId;
    if (p !== null) {
      const f = e[p], d = s[a + 1].position, m = h.normalize(h.subtract(d, l)), y = s[a + 2]?.position;
      let I;
      y ? I = h.normalize(h.subtract(y, d)) : I = h.reflect(m, v.normal(f.plane));
      const b = je(f, m), P = Ue(m, b), S = P;
      i += u;
      const x = Math.abs(P - Math.PI / 2) < qe;
      n.push({
        polygon: f,
        polygonId: p,
        hitPoint: h.clone(d),
        incidenceAngle: P,
        reflectionAngle: S,
        incomingDirection: m,
        outgoingDirection: I,
        surfaceNormal: b,
        reflectionOrder: n.length + 1,
        cumulativeDistance: i,
        incomingSegmentLength: u,
        isGrazing: x
      });
    } else
      i += u;
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
  const s = new de();
  s.setPoints([]);
  const e = new fe({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new g.Mesh(s, e);
}
const Qe = X.scale(["#ff8a0b", "#000080"]).mode("lch");
function C(s, e) {
  const t = e + 1, o = Qe.colors(t), n = Math.min(s, t - 1), r = X(o[n]);
  return parseInt(r.hex().slice(1), 16);
}
const Q = {
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
  impulseResponseResult: "",
  temperature: 20
};
class Xe extends he {
  roomID;
  sourceIDs;
  receiverIDs;
  maxReflectionOrder;
  frequencies;
  temperature;
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
    const t = { ...Q, ...e };
    if (this.kind = "beam-trace", this.uuid = t.uuid || L(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this.temperature = t.temperature ?? Q.temperature, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (o, n) => n), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (o, n) => n), this.levelTimeProgression = t.levelTimeProgression || L(), this.impulseResponseResult = t.impulseResponseResult || L(), !this.roomID) {
      const o = pe();
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
  get c() {
    return Ie(this.temperature);
  }
  save() {
    return {
      ...me([
        "name",
        "kind",
        "uuid",
        "autoCalculate",
        "roomID",
        "sourceIDs",
        "receiverIDs",
        "maxReflectionOrder",
        "frequencies",
        "temperature",
        "levelTimeProgression",
        "impulseResponseResult"
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.frequencies = e.frequencies, this.temperature = e.temperature ?? 20, this.levelTimeProgression = e.levelTimeProgression || L(), this.impulseResponseResult = e.impulseResponseResult || L(), this;
  }
  dispose() {
    this.clearVisualization(), this.removeClickHandler(), R.markup.remove(this.selectedPath), R.markup.remove(this.selectedBeamsGroup), R.markup.remove(this.virtualSourcesGroup), T("REMOVE_RESULT", this.levelTimeProgression), T("REMOVE_RESULT", this.impulseResponseResult);
  }
  setupClickHandler() {
    this.removeClickHandler();
    const e = R.renderer.domElement, t = (o) => {
      const n = e.getBoundingClientRect();
      return new g.Vector2(
        (o.clientX - n.left) / n.width * 2 - 1,
        -((o.clientY - n.top) / n.height) * 2 + 1
      );
    };
    this.hoverHandler = (o) => {
      if (this.virtualSourceMap.size === 0) {
        e.style.cursor = "default";
        return;
      }
      const n = t(o), r = new g.Raycaster();
      r.setFromCamera(n, R.camera);
      const i = Array.from(this.virtualSourceMap.keys());
      r.intersectObjects(i).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (o) => {
      if (o.button !== 0 || this.virtualSourceMap.size === 0) return;
      const n = t(o), r = new g.Raycaster();
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
    const t = C(e.reflectionOrder, this.maxReflectionOrder), o = new g.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const n = B.getState().containers[this.receiverIDs[0]];
    if (!n) return;
    const r = n.position.clone(), i = new g.LineDashedMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), a = new g.BufferGeometry().setFromPoints([o, r]), l = new g.Line(a, i);
    l.computeLineDistances(), this.selectedBeamsGroup.add(l);
    const c = new g.SphereGeometry(0.18, 16, 16), u = new g.MeshBasicMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4
    }), p = new g.Mesh(c, u);
    p.position.copy(o), this.selectedBeamsGroup.add(p);
    const f = e.polygonPath;
    if (!f || f.length === 0) return;
    const d = e.reflectionOrder;
    for (const m of this.validPaths) {
      const y = m.order;
      if (y !== d) continue;
      let I = !0;
      for (let b = 0; b < f.length; b++) {
        const P = y - b;
        if (m.polygonIds[P] !== f[b]) {
          I = !1;
          break;
        }
      }
      if (I) {
        const b = m.points, P = m.order;
        for (let S = 0; S < b.length - 1; S++) {
          const x = b[S], D = b[S + 1], E = x.distanceTo(D), A = new g.Vector3().addVectors(x, D).multiplyScalar(0.5), F = P - S, ae = F === 0 ? 16777215 : C(F, this.maxReflectionOrder), le = new g.CylinderGeometry(0.025, 0.025, E, 8), ce = new g.MeshBasicMaterial({ color: ae }), z = new g.Mesh(le, ce);
          z.position.copy(A);
          const ue = new g.Vector3().subVectors(D, x).normalize(), N = new g.Quaternion();
          N.setFromUnitVectors(new g.Vector3(0, 1, 0), ue), z.setRotationFromQuaternion(N), this.selectedBeamsGroup.add(z);
        }
        for (let S = 1; S < m.points.length - 1; S++) {
          const x = P - S + 1, D = C(x, this.maxReflectionOrder), E = new g.SphereGeometry(0.08, 12, 12), A = new g.MeshBasicMaterial({ color: D }), F = new g.Mesh(E, A);
          F.position.copy(m.points[S]), this.selectedBeamsGroup.add(F);
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
    const r = e.matrixWorld, i = o.getIndex(), a = n.array, l = (c, u, p) => {
      const f = new g.Vector3(
        a[c * 3],
        a[c * 3 + 1],
        a[c * 3 + 2]
      ).applyMatrix4(r), d = new g.Vector3(
        a[u * 3],
        a[u * 3 + 1],
        a[u * 3 + 2]
      ).applyMatrix4(r), m = new g.Vector3(
        a[p * 3],
        a[p * 3 + 1],
        a[p * 3 + 2]
      ).applyMatrix4(r), y = [
        [f.x, f.y, f.z],
        [d.x, d.y, d.z],
        [m.x, m.y, m.z]
      ], I = w.create(y);
      t.push(I);
    };
    if (i) {
      const c = i.array;
      for (let u = 0; u < c.length; u += 3)
        l(c[u], c[u + 1], c[u + 2]);
    } else {
      const c = n.count;
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
    this.calculateLTP(this.c), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), R.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e) {
    const t = e.map((l) => new g.Vector3(l.position[0], l.position[1], l.position[2])), o = ie(e), n = Ne(e), r = Ge(e), i = e.map((l) => l.polygonId);
    let a;
    return t.length >= 2 ? a = new g.Vector3().subVectors(t[0], t[1]).normalize().negate() : a = new g.Vector3(0, 0, 1), { points: t, order: r, length: o, arrivalTime: n, polygonIds: i, arrivalDirection: a };
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
    this._plotFrequency = e, this.calculateLTP(this.c);
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
        const u = o.points[c], p = o.points[c + 1];
        R.markup.addLine(
          [u.x, u.y, u.z],
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
        const d = (a >> 16 & 255) * 0.4 + 76.8, m = (a >> 8 & 255) * 0.4 + 128 * 0.6, y = (a & 255) * 0.4 + 128 * 0.6;
        l = Math.round(d) << 16 | Math.round(m) << 8 | Math.round(y);
      }
      const c = new g.Vector3(n.virtualSource[0], n.virtualSource[1], n.virtualSource[2]), u = new g.SphereGeometry(i, 12, 12), p = new g.MeshStandardMaterial({
        color: l,
        transparent: !r,
        opacity: r ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), f = new g.Mesh(u, p);
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
    const e = M.sampleRate, o = Array(this.frequencies.length).fill(100), n = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05, r = Math.floor(e * n) * 2, i = [];
    for (let c = 0; c < this.frequencies.length; c++)
      i.push(new Float32Array(r));
    for (const c of this.validPaths) {
      const u = Math.random() > 0.5 ? 1 : -1, p = this.calculateArrivalPressure(o, c), f = Math.floor(c.arrivalTime * e);
      for (let d = 0; d < this.frequencies.length; d++)
        f < i[d].length && (i[d][f] += p[d] * u);
    }
    const l = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((c, u) => {
      l.postMessage({ samples: i }), l.onmessage = (p) => {
        const f = p.data.samples, d = new Float32Array(f[0].length >> 1);
        let m = 0;
        for (let P = 0; P < f.length; P++)
          for (let S = 0; S < d.length; S++)
            d[S] += f[P][S], Math.abs(d[S]) > m && (m = Math.abs(d[S]));
        const y = W(d), I = M.createOfflineContext(1, d.length, e), b = M.createBufferSource(y, I);
        b.connect(I.destination), b.start(), M.renderContextAsync(I).then((P) => {
          this.impulseResponse = P, this.updateImpulseResponseResult(P, e), c(P);
        }).catch(u).finally(() => l.terminate());
      }, l.onerror = (p) => {
        l.terminate(), u(p);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, t) {
    const o = ge(U(e));
    t.polygonIds.forEach((i, a) => {
      if (i === null) return;
      const l = this.polygonToSurface.get(i);
      if (!l) return;
      let c = 0;
      if (a > 0 && a < t.points.length - 1) {
        const u = new g.Vector3().subVectors(t.points[a + 1], t.points[a]).normalize(), p = new g.Vector3().subVectors(t.points[a - 1], t.points[a]).normalize(), f = Math.min(1, Math.max(-1, u.dot(p)));
        c = Math.acos(f) / 2;
      }
      for (let u = 0; u < this.frequencies.length; u++) {
        const p = Math.abs(l.reflectionFunction(this.frequencies[u], c));
        o[u] *= p;
      }
    });
    const n = q(ve(o)), r = be(this.frequencies, this.temperature);
    for (let i = 0; i < this.frequencies.length; i++)
      n[i] -= r[i] * t.length;
    return U(n);
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, t) {
    const o = B.getState().containers, n = this.sourceIDs.length > 0 && o[this.sourceIDs[0]]?.name || "source", r = this.receiverIDs.length > 0 && o[this.receiverIDs[0]]?.name || "receiver", i = e.getChannelData(0), a = [], l = Math.max(1, Math.floor(i.length / 2e3));
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
    const o = K([W(this.impulseResponse.getChannelData(0))], { sampleRate: t, bitDepth: 32 }), n = e.endsWith(".wav") ? "" : ".wav";
    j.saveAs(o, e + n);
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
    const t = M.sampleRate, n = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (r <= 0) throw new Error("Invalid impulse response duration");
    const i = Math.floor(t * r) * 2;
    if (i < 2) throw new Error("Impulse response too short to process");
    const a = we(e), l = [];
    for (let u = 0; u < this.frequencies.length; u++) {
      l.push([]);
      for (let p = 0; p < a; p++)
        l[u].push(new Float32Array(i));
    }
    for (const u of this.validPaths) {
      const p = Math.random() > 0.5 ? 1 : -1, f = this.calculateArrivalPressure(n, u), d = Math.floor(u.arrivalTime * t);
      if (d >= i) continue;
      const m = u.arrivalDirection, y = new Float32Array(1);
      for (let I = 0; I < this.frequencies.length; I++) {
        y[0] = f[I] * p;
        const b = Re(y, m.x, m.y, m.z, e, "threejs");
        for (let P = 0; P < a; P++)
          l[I][P][d] += b[P][0];
      }
    }
    const c = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((u, p) => {
      const f = async (d) => new Promise((m) => {
        const y = [];
        for (let b = 0; b < this.frequencies.length; b++)
          y.push(l[b][d]);
        const I = c();
        I.postMessage({ samples: y }), I.onmessage = (b) => {
          const P = b.data.samples, S = new Float32Array(P[0].length >> 1);
          for (let x = 0; x < P.length; x++)
            for (let D = 0; D < S.length; D++)
              S[D] += P[x][D];
          I.terminate(), m(S);
        };
      });
      Promise.all(
        Array.from({ length: a }, (d, m) => f(m))
      ).then((d) => {
        let m = 0;
        for (const P of d)
          for (let S = 0; S < P.length; S++)
            Math.abs(P[S]) > m && (m = Math.abs(P[S]));
        if (m > 0)
          for (const P of d)
            for (let S = 0; S < P.length; S++)
              P[S] /= m;
        const y = d[0].length;
        if (y === 0) {
          p(new Error("Filtered signal has zero length"));
          return;
        }
        const b = M.createOfflineContext(a, y, t).createBuffer(a, y, t);
        for (let P = 0; P < a; P++)
          b.copyToChannel(new Float32Array(d[P]), P);
        this.ambisonicImpulseResponse = b, this.ambisonicOrder = e, u(b);
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
    const i = K(r, { sampleRate: n, bitDepth: 32 }), a = e.endsWith(".wav") ? "" : ".wav", l = t === 1 ? "FOA" : `HOA${t}`;
    j.saveAs(i, `${e}_${l}${a}`);
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
    const n = C(o.order, this.maxReflectionOrder), r = new g.LineBasicMaterial({
      color: n,
      linewidth: 2,
      transparent: !1
    });
    for (let i = 0; i < o.points.length - 1; i++) {
      const a = new g.BufferGeometry().setFromPoints([
        o.points[i],
        o.points[i + 1]
      ]), l = new g.Line(a, r);
      this.selectedBeamsGroup.add(l);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const i = B.getState().containers[this.receiverIDs[0]];
      if (i) {
        const a = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), l = o.polygonIds[o.order];
        if (l !== null) {
          const c = a.find(
            (u) => u.polygonId === l && u.reflectionOrder === o.order
          );
          if (c) {
            const u = new g.LineDashedMaterial({
              color: n,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), p = new g.Vector3(
              c.virtualSource[0],
              c.virtualSource[1],
              c.virtualSource[2]
            ), f = i.position.clone(), d = new g.BufferGeometry().setFromPoints([p, f]), m = new g.Line(d, u);
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
k("BEAMTRACE_SET_PROPERTY", Pe);
k("REMOVE_BEAMTRACE", ye);
k("ADD_BEAMTRACE", Se(Xe));
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
  const e = _.getState().solvers[s], t = B.getState().containers, o = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", n = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", r = `ir-beamtrace-${o}-${n}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(r).catch((i) => {
    window.alert(i.message || "Failed to download impulse response");
  });
});
k("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: s, order: e }) => {
  const t = _.getState().solvers[s], o = B.getState().containers, n = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", r = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-ambi-${n}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(i, e).catch((a) => {
    window.alert(a.message || "Failed to download ambisonic impulse response");
  });
});
k("SHOULD_ADD_BEAMTRACE", () => {
  T("ADD_BEAMTRACE", void 0);
});
export {
  Xe as BeamTraceSolver
};
//# sourceMappingURL=index-DI5us7R1.mjs.map
