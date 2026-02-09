import { S as pe } from "./solver-hyVpuV37.mjs";
import * as g from "three";
import { MeshLine as ge, MeshLineMaterial as ve } from "three.meshline";
import { v as H, g as Pe, e as k, R as N, r as M, p as ye, u as T, a as Z, P as U, b as Q, L as j, I as X, F as Ie, o as _, s as Se, c as be, d as Re, f as F } from "./index-DDGfegRq.mjs";
import { a as De } from "./air-attenuation-CBIk1QMo.mjs";
import { s as we } from "./sound-speed-Biev-mJ1.mjs";
import { a as C, n as J, w as Me } from "./audio-engine-DbWjDVpV.mjs";
import { p as Te, d as xe, a as Ae, b as Be, c as Ee } from "./export-playback-DSkRh1Qi.mjs";
import { b as _e, f as ke, H as ee, a as W, e as te, s as se, c as oe, d as Fe, g as Ce, r as Oe, q as $e, h as Le, D as ze } from "./quick-estimate-7e5tl2Yy.mjs";
import ne from "chroma-js";
const m = {
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
    return Math.sqrt(m.lengthSquared(s));
  },
  /**
   * Normalize a vector to unit length
   * Returns zero vector if input has zero length
   */
  normalize(s) {
    const e = m.length(s);
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
    return m.length(m.subtract(s, e));
  },
  /**
   * Squared distance between two points (faster than distance)
   */
  distanceSquared(s, e) {
    return m.lengthSquared(m.subtract(s, e));
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
    const t = 2 * m.dot(s, e);
    return m.subtract(s, m.scale(e, t));
  },
  /**
   * Project vector a onto vector b
   */
  project(s, e) {
    const t = m.lengthSquared(e);
    if (t < 1e-10)
      return [0, 0, 0];
    const o = m.dot(s, e) / t;
    return m.scale(e, o);
  },
  /**
   * Get the component of a perpendicular to b
   */
  reject(s, e) {
    return m.subtract(s, m.project(s, e));
  },
  /**
   * Convert to string for debugging
   */
  toString(s, e = 4) {
    return `[${s[0].toFixed(e)}, ${s[1].toFixed(e)}, ${s[2].toFixed(e)}]`;
  }
}, S = {
  /**
   * Create a plane from a normal vector and a point on the plane
   */
  fromNormalAndPoint(s, e) {
    const t = m.normalize(s), o = -m.dot(t, e);
    return { a: t[0], b: t[1], c: t[2], d: o };
  },
  /**
   * Create a plane from three non-collinear points
   * Uses counter-clockwise winding order: normal points toward viewer when
   * p1 → p2 → p3 appears counter-clockwise
   */
  fromPoints(s, e, t) {
    const o = m.subtract(e, s), r = m.subtract(t, s), i = m.normalize(m.cross(o, r));
    return S.fromNormalAndPoint(i, s);
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
    return Math.abs(S.signedDistance(s, e));
  },
  /**
   * Classify a point relative to the plane
   */
  classifyPoint(s, e, t = 1e-6) {
    const o = S.signedDistance(s, e);
    return o > t ? "front" : o < -t ? "back" : "on";
  },
  /**
   * Check if a point is in front of the plane
   */
  isPointInFront(s, e, t = 1e-6) {
    return S.signedDistance(s, e) > t;
  },
  /**
   * Check if a point is behind the plane
   */
  isPointBehind(s, e, t = 1e-6) {
    return S.signedDistance(s, e) < -t;
  },
  /**
   * Check if a point is on the plane
   */
  isPointOn(s, e, t = 1e-6) {
    return Math.abs(S.signedDistance(s, e)) <= t;
  },
  /**
   * Mirror a point across the plane
   * p' = p - 2 * signedDistance(p) * normal
   */
  mirrorPoint(s, e) {
    const t = S.signedDistance(s, e), o = S.normal(e);
    return m.subtract(s, m.scale(o, 2 * t));
  },
  /**
   * Mirror a plane across another plane (for fail plane propagation)
   * This mirrors two points on the source plane and reconstructs.
   */
  mirrorPlane(s, e) {
    const t = S.normal(s);
    let o;
    Math.abs(t[2]) > 0.5 ? o = [0, 0, -s.d / s.c] : Math.abs(t[1]) > 0.5 ? o = [0, -s.d / s.b, 0] : o = [-s.d / s.a, 0, 0];
    const r = Math.abs(t[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], i = m.normalize(m.cross(t, r)), l = m.add(o, i), n = m.cross(t, i), c = m.add(o, n), u = S.mirrorPoint(o, e), a = S.mirrorPoint(l, e), h = S.mirrorPoint(c, e);
    return S.fromPoints(u, a, h);
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
    const o = S.normal(t), r = m.dot(o, e);
    return Math.abs(r) < 1e-10 ? null : -(m.dot(o, s) + t.d) / r;
  },
  /**
   * Get the point of intersection between a ray and plane
   */
  rayIntersectionPoint(s, e, t) {
    const o = S.rayIntersection(s, e, t);
    return o === null ? null : m.add(s, m.scale(e, o));
  },
  /**
   * Project a point onto the plane
   */
  projectPoint(s, e) {
    const t = S.signedDistance(s, e), o = S.normal(e);
    return m.subtract(s, m.scale(o, t));
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
}, A = {
  /**
   * Create a polygon from vertices (computes plane automatically)
   * Vertices must be in counter-clockwise order when viewed from front
   */
  create(s, e) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    const t = s.map((r) => m.clone(r)), o = S.fromPoints(t[0], t[1], t[2]);
    return { vertices: t, plane: o, materialId: e };
  },
  /**
   * Create a polygon with an explicit plane (for split polygons that may be degenerate)
   */
  createWithPlane(s, e, t) {
    if (s.length < 3)
      throw new Error("Polygon requires at least 3 vertices");
    return { vertices: s.map((r) => m.clone(r)), plane: e, materialId: t };
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
      const r = s.vertices[o], i = s.vertices[o + 1], l = m.cross(m.subtract(r, t), m.subtract(i, t));
      e = m.add(e, l);
    }
    return 0.5 * m.length(e);
  },
  /**
   * Get the normal vector of the polygon (from the plane)
   */
  normal(s) {
    return S.normal(s.plane);
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
    for (const i of s.vertices) {
      const l = S.classifyPoint(i, e, t);
      l === "front" ? o++ : l === "back" && r++;
    }
    return o > 0 && r > 0 ? "spanning" : o > 0 ? "front" : r > 0 ? "back" : "coplanar";
  },
  /**
   * Check if a point is inside the polygon
   * Assumes the point is on (or very close to) the polygon's plane
   */
  containsPoint(s, e, t = 1e-6) {
    const o = S.normal(s.plane), r = s.vertices.length;
    for (let i = 0; i < r; i++) {
      const l = s.vertices[i], n = s.vertices[(i + 1) % r], c = m.subtract(n, l), u = m.subtract(e, l), a = m.cross(c, u);
      if (m.dot(a, o) < -t)
        return !1;
    }
    return !0;
  },
  /**
   * Ray-polygon intersection
   * Returns t parameter and intersection point, or null if no hit
   */
  rayIntersection(s, e, t, o = 1e-4) {
    const r = S.rayIntersection(s, e, t.plane);
    if (r === null || r < 0)
      return null;
    const i = m.add(s, m.scale(e, r));
    return A.containsPoint(t, i, o) ? { t: r, point: i } : null;
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
    return s.vertices.length < 3 || A.area(s) < e;
  },
  /**
   * Flip the polygon winding (reverse vertex order and flip plane)
   */
  flip(s) {
    const e = [...s.vertices].reverse(), t = S.flip(s.plane);
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
      vertices: s.vertices.map((e) => m.clone(e)),
      plane: { ...s.plane },
      materialId: s.materialId
    };
  },
  /**
   * Convert to string for debugging
   */
  toString(s) {
    const e = s.vertices.map((t) => m.toString(t, 2)).join(", ");
    return `Polygon3D(${s.vertices.length} vertices: [${e}])`;
  }
};
function qe(s, e, t = 1e-4) {
  const o = A.classify(s, e, t);
  if (o === "front" || o === "coplanar")
    return { front: s, back: null };
  if (o === "back")
    return { front: null, back: s };
  const r = [], i = [], l = s.vertices.length;
  for (let u = 0; u < l; u++) {
    const a = s.vertices[u], h = s.vertices[(u + 1) % l], d = S.signedDistance(a, e), f = S.signedDistance(h, e), p = d > t ? "front" : d < -t ? "back" : "on", v = f > t ? "front" : f < -t ? "back" : "on";
    if (p === "front" ? r.push(a) : (p === "back" || r.push(a), i.push(a)), p === "front" && v === "back" || p === "back" && v === "front") {
      const P = d / (d - f), y = m.lerp(a, h, P);
      r.push(y), i.push(y);
    }
  }
  const n = r.length >= 3 ? A.createWithPlane(r, s.plane, s.materialId) : null, c = i.length >= 3 ? A.createWithPlane(i, s.plane, s.materialId) : null;
  return { front: n, back: c };
}
function Ve(s, e, t = 1e-4) {
  const o = s.vertices, r = [];
  if (o.length < 3)
    return null;
  for (let i = 0; i < o.length; i++) {
    const l = o[i], n = o[(i + 1) % o.length], c = S.signedDistance(l, e), u = S.signedDistance(n, e), a = c >= -t, h = u >= -t;
    if (a && r.push(l), a && !h || !a && h) {
      const d = c / (c - u), f = m.lerp(l, n, Math.max(0, Math.min(1, d)));
      r.push(f);
    }
  }
  return r.length < 3 ? null : A.createWithPlane(r, s.plane, s.materialId);
}
function Ge(s, e, t = 1e-4) {
  let o = s;
  for (const r of e) {
    if (!o)
      return null;
    o = Ve(o, r, t);
  }
  return o;
}
function He(s, e, t = 1e-4) {
  for (const o of e) {
    let r = !0;
    for (const i of s.vertices)
      if (S.signedDistance(i, o) >= -t) {
        r = !1;
        break;
      }
    if (r)
      return !0;
  }
  return !1;
}
function Ne(s) {
  if (s.length === 0)
    return null;
  const e = s.map((t, o) => ({
    polygon: t,
    originalId: o
  }));
  return Y(e);
}
function Y(s) {
  if (s.length === 0)
    return null;
  const e = Ue(s), t = s[e], o = t.polygon.plane, r = [], i = [];
  for (let l = 0; l < s.length; l++) {
    if (l === e)
      continue;
    const n = s[l], { front: c, back: u } = qe(n.polygon, o);
    c && r.push({ polygon: c, originalId: n.originalId }), u && i.push({ polygon: u, originalId: n.originalId });
  }
  return {
    plane: o,
    polygon: t.polygon,
    polygonId: t.originalId,
    front: Y(r),
    back: Y(i)
  };
}
function Ue(s) {
  if (s.length <= 3)
    return 0;
  let e = 0, t = 1 / 0;
  const o = Math.min(s.length, 10), r = Math.max(1, Math.floor(s.length / o));
  for (let i = 0; i < s.length; i += r) {
    const l = s[i].polygon.plane;
    let n = 0, c = 0, u = 0;
    for (let h = 0; h < s.length; h++) {
      if (i === h)
        continue;
      const d = A.classify(s[h].polygon, l);
      d === "front" ? n++ : d === "back" ? c++ : d === "spanning" && (n++, c++, u++);
    }
    const a = u * 8 + Math.abs(n - c);
    a < t && (t = a, e = i);
  }
  return e;
}
function z(s, e, t, o = 0, r = 1 / 0, i = -1) {
  if (!t)
    return null;
  const l = S.signedDistance(s, t.plane), n = S.normal(t.plane), c = m.dot(n, e);
  let u, a;
  l >= 0 ? (u = t.front, a = t.back) : (u = t.back, a = t.front);
  let h = null;
  Math.abs(c) > 1e-10 && (h = -l / c);
  let d = null;
  if (h === null || h < o) {
    if (d = z(s, e, u, o, r, i), !d && t.polygonId !== i) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = z(s, e, a, o, r, i));
  } else if (h > r) {
    if (d = z(s, e, u, o, r, i), !d && t.polygonId !== i) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = z(s, e, a, o, r, i));
  } else {
    if (d = z(s, e, u, o, h, i), !d && t.polygonId !== i) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = z(s, e, a, h, r, i));
  }
  return d;
}
function O(s, e, t, o, r, i) {
  if (!t)
    return null;
  const l = S.signedDistance(s, t.plane), n = S.normal(t.plane), c = m.dot(n, e);
  let u, a;
  l >= 0 ? (u = t.front, a = t.back) : (u = t.back, a = t.front);
  let h = null;
  Math.abs(c) > 1e-10 && (h = -l / c);
  let d = null;
  if (h === null || h < o) {
    if (d = O(s, e, u, o, r, i), !d && !i.has(t.polygonId)) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, a, o, r, i));
  } else if (h > r) {
    if (d = O(s, e, u, o, r, i), !d && !i.has(t.polygonId)) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, a, o, r, i));
  } else {
    if (d = O(s, e, u, o, h, i), !d && !i.has(t.polygonId)) {
      const f = A.rayIntersection(s, e, t.polygon);
      f && f.t >= o && f.t <= r && (d = {
        t: f.t,
        point: f.point,
        polygonId: t.polygonId,
        polygon: t.polygon
      });
    }
    d || (d = O(s, e, a, h, r, i));
  }
  return d;
}
function ae(s, e) {
  const t = [], o = A.edges(e), r = A.centroid(e);
  for (const [l, n] of o) {
    let c = S.fromPoints(s, l, n);
    S.signedDistance(r, c) < 0 && (c = S.flip(c)), t.push(c);
  }
  let i = e.plane;
  return S.signedDistance(s, i) > 0 && (i = S.flip(i)), t.push(i), t;
}
function le(s, e) {
  return S.mirrorPoint(s, e.plane);
}
function ce(s, e) {
  const t = A.centroid(s), o = m.subtract(e, t), r = S.normal(s.plane);
  return m.dot(r, o) > 0;
}
const je = 1e-6;
function We(s, e, t) {
  const o = {
    id: -1,
    parent: null,
    virtualSource: m.clone(s),
    children: []
  };
  if (t >= 1)
    for (let i = 0; i < e.length; i++) {
      const l = e[i];
      if (!ce(l, s))
        continue;
      const n = le(s, l), c = ae(n, l), u = {
        id: i,
        parent: o,
        virtualSource: n,
        aperture: A.clone(l),
        boundaryPlanes: c,
        children: []
      };
      o.children.push(u), t > 1 && ue(u, e, 2, t);
    }
  const r = [];
  return he(o, r), {
    root: o,
    leafNodes: r,
    polygons: e,
    maxReflectionOrder: t
  };
}
function ue(s, e, t, o) {
  if (!(t > o) && !(!s.boundaryPlanes || !s.aperture))
    for (let r = 0; r < e.length; r++) {
      if (r === s.id)
        continue;
      const i = e[r];
      if (He(i, s.boundaryPlanes) || !ce(i, s.virtualSource))
        continue;
      const l = Ge(i, s.boundaryPlanes);
      if (!l || A.area(l) < je)
        continue;
      const c = le(s.virtualSource, i), u = ae(c, l), a = {
        id: r,
        parent: s,
        virtualSource: c,
        aperture: l,
        boundaryPlanes: u,
        children: []
      };
      s.children.push(a), t < o && ue(a, e, t + 1, o);
    }
}
function he(s, e) {
  s.children.length === 0 && s.id !== -1 && e.push(s);
  for (const t of s.children)
    he(t, e);
}
function Ye(s) {
  de(s.root);
}
function de(s) {
  s.failPlane = void 0, s.failPlaneType = void 0;
  for (const e of s.children)
    de(e);
}
function Ke(s, e, t) {
  if (!e.aperture || !e.boundaryPlanes)
    return null;
  let r = t[e.id].plane;
  if (S.signedDistance(e.virtualSource, r) < 0 && (r = S.flip(r)), S.signedDistance(s, r) < 0)
    return {
      plane: r,
      type: "polygon",
      nodeDepth: re(e)
    };
  const i = e.boundaryPlanes.length - 1;
  for (let l = 0; l < e.boundaryPlanes.length; l++) {
    const n = e.boundaryPlanes[l];
    if (S.signedDistance(s, n) < 0) {
      const c = l < i ? "edge" : "aperture";
      return {
        plane: n,
        type: c,
        nodeDepth: re(e)
      };
    }
  }
  return null;
}
function re(s) {
  let e = 0, t = s;
  for (; t && t.id !== -1; )
    e++, t = t.parent;
  return e;
}
function Ze(s, e) {
  return S.signedDistance(s, e) < 0;
}
const fe = 16;
function Qe(s, e = fe) {
  const t = [];
  for (let o = 0; o < s.length; o += e)
    t.push({
      id: t.length,
      nodes: s.slice(o, Math.min(o + e, s.length)),
      skipSphere: null
    });
  return t;
}
function Xe(s, e) {
  return m.distance(s, e.center) < e.radius;
}
function Je(s, e) {
  return e.skipSphere ? Xe(s, e.skipSphere) ? "inside" : "outside" : "none";
}
function et(s, e) {
  let t = 1 / 0;
  for (const o of e) {
    if (!o.failPlane)
      return null;
    const r = Math.abs(S.signedDistance(s, o.failPlane));
    t = Math.min(t, r);
  }
  return t === 1 / 0 || t <= 1e-10 ? null : {
    center: m.clone(s),
    radius: t
  };
}
function ie(s) {
  s.skipSphere = null;
}
function tt(s) {
  for (const e of s.nodes)
    e.failPlane = void 0, e.failPlaneType = void 0;
}
class st {
  /**
   * Create a new 3D beam tracing solver
   *
   * @param polygons - Room geometry as an array of polygons
   * @param sourcePosition - Position of the sound source
   * @param config - Optional configuration
   */
  constructor(e, t, o = {}) {
    const r = o.maxReflectionOrder ?? 5, i = o.bucketSize ?? fe;
    this.polygons = e, this.sourcePosition = m.clone(t), this.epsilon = o.epsilon ?? 1e-4, this.bspRoot = Ne(e), this.beamTree = We(t, e, r), this.buckets = Qe(this.beamTree.leafNodes, i), this.metrics = this.createEmptyMetrics(), this.metrics.totalLeafNodes = this.beamTree.leafNodes.length, this.metrics.bucketsTotal = this.buckets.length;
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
    for (const i of this.buckets) {
      const l = Je(e, i);
      if (l === "inside") {
        this.metrics.bucketsSkipped++;
        continue;
      }
      l === "outside" && (ie(i), tt(i)), this.metrics.bucketsChecked++;
      let n = !0, c = !0;
      for (const u of i.nodes) {
        if (u.failPlane && Ze(e, u.failPlane)) {
          this.metrics.failPlaneCacheHits++;
          continue;
        }
        u.failPlane && (u.failPlane = void 0, u.failPlaneType = void 0, this.metrics.failPlaneCacheMisses++);
        const a = this.validatePath(e, u);
        a.valid && a.path ? (t.push(a.path), n = !1, c = !1) : u.failPlane || (c = !1);
      }
      n && c && i.nodes.length > 0 && (i.skipSphere = et(e, i.nodes), i.skipSphere && this.metrics.skipSphereCount++);
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
    return this.getPaths(e).map((o) => lt(o, this.polygons));
  }
  /**
   * Validate the direct path from listener to source
   */
  validateDirectPath(e) {
    const t = m.subtract(this.sourcePosition, e), o = m.length(t), r = m.normalize(t);
    this.metrics.raycastCount++;
    const i = z(e, r, this.bspRoot, 0, o, -1);
    return i && i.t < o - this.epsilon ? null : [
      { position: m.clone(e), polygonId: null },
      { position: m.clone(this.sourcePosition), polygonId: null }
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
      { position: m.clone(e), polygonId: null }
    ], i = [];
    let l = t;
    for (; l && l.id !== -1; )
      i.unshift(l.id), l = l.parent;
    o && (console.log(`[traverseBeam] Exploring beam with polygonPath: [${i.join(", ")}]`), console.log(`  Listener: [${e[0].toFixed(3)}, ${e[1].toFixed(3)}, ${e[2].toFixed(3)}]`), console.log(`  Virtual source: [${t.virtualSource[0].toFixed(3)}, ${t.virtualSource[1].toFixed(3)}, ${t.virtualSource[2].toFixed(3)}]`));
    let n = e, c = t;
    const u = /* @__PURE__ */ new Set();
    let a = 0;
    for (; c && c.id !== -1; ) {
      const h = this.polygons[c.id], d = c.virtualSource, f = m.normalize(m.subtract(d, n)), p = A.rayIntersection(n, f, h);
      if (!p)
        return o && console.log(`  [Segment ${a}] FAIL: No intersection with polygon ${c.id}`), null;
      o && (console.log(`  [Segment ${a}] Ray from [${n[0].toFixed(3)}, ${n[1].toFixed(3)}, ${n[2].toFixed(3)}]`), console.log(`    Direction: [${f[0].toFixed(3)}, ${f[1].toFixed(3)}, ${f[2].toFixed(3)}]`), console.log(`    Hit polygon ${c.id} at t=${p.t.toFixed(3)}, point=[${p.point[0].toFixed(3)}, ${p.point[1].toFixed(3)}, ${p.point[2].toFixed(3)}]`)), u.add(c.id), this.metrics.raycastCount++;
      const v = O(n, f, this.bspRoot, this.epsilon, p.t - this.epsilon, u);
      if (v)
        return o && (console.log(`    OCCLUDED by polygon ${v.polygonId} at t=${v.t.toFixed(3)}, point=[${v.point[0].toFixed(3)}, ${v.point[1].toFixed(3)}, ${v.point[2].toFixed(3)}]`), console.log(`    ignoreIds: [${Array.from(u).join(", ")}]`)), null;
      o && console.log(`    OK - no occlusion (ignoreIds: [${Array.from(u).join(", ")}])`), r.push({
        position: m.clone(p.point),
        polygonId: c.id
      }), n = p.point, c = c.parent, a++;
    }
    if (c) {
      const h = m.normalize(m.subtract(c.virtualSource, n)), d = m.distance(c.virtualSource, n);
      if (o) {
        console.log(`  [Final segment] Ray from [${n[0].toFixed(3)}, ${n[1].toFixed(3)}, ${n[2].toFixed(3)}]`), console.log(`    To source: [${c.virtualSource[0].toFixed(3)}, ${c.virtualSource[1].toFixed(3)}, ${c.virtualSource[2].toFixed(3)}]`), console.log(`    Direction: [${h[0].toFixed(3)}, ${h[1].toFixed(3)}, ${h[2].toFixed(3)}]`), console.log(`    Distance: ${d.toFixed(3)}`), console.log(`    tMin: ${this.epsilon}, tMax: ${(d - this.epsilon).toFixed(6)}`), console.log(`    ignoreIds: [${Array.from(u).join(", ")}]`);
        const P = n, y = c.virtualSource;
        if (P[1] < 5.575 && y[1] > 5.575 || P[1] > 5.575 && y[1] < 5.575) {
          const R = (5.575 - P[1]) / (y[1] - P[1]), b = P[0] + R * (y[0] - P[0]), I = P[2] + R * (y[2] - P[2]);
          if (console.log(`    CROSSING y=5.575 at t=${R.toFixed(3)}, x=${b.toFixed(3)}, z=${I.toFixed(3)}`), console.log("    back1 spans: x=[6.215, 12.43], z=[0, 4.877]"), b >= 6.215 && b <= 12.43 && I >= 0 && I <= 4.877) {
            console.log("    *** SHOULD HIT back1 (polygons 3, 4) ***"), console.log("    Direct polygon intersection test:");
            for (const D of [3, 4]) {
              const x = this.polygons[D], B = A.rayIntersection(n, h, x);
              B ? console.log(`      Polygon ${D}: HIT at t=${B.t.toFixed(3)}, point=[${B.point[0].toFixed(3)}, ${B.point[1].toFixed(3)}, ${B.point[2].toFixed(3)}]`) : (console.log(`      Polygon ${D}: NO HIT`), console.log(`        Vertices: ${x.vertices.map((E) => `[${E[0].toFixed(2)}, ${E[1].toFixed(2)}, ${E[2].toFixed(2)}]`).join(", ")}`));
            }
          }
        }
      }
      this.metrics.raycastCount++;
      const f = this.epsilon, p = d - this.epsilon, v = O(n, h, this.bspRoot, f, p, u);
      if (v)
        return o && console.log(`    OCCLUDED by polygon ${v.polygonId} at t=${v.t.toFixed(3)}, point=[${v.point[0].toFixed(3)}, ${v.point[1].toFixed(3)}, ${v.point[2].toFixed(3)}]`), null;
      o && console.log("    OK - path valid!"), r.push({
        position: m.clone(c.virtualSource),
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
    const r = Ke(e, t, this.polygons);
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
    const o = (l, n, c) => {
      if (c === n.length)
        return l;
      for (const u of l.children)
        if (u.id === n[c])
          return o(u, n, c + 1);
      return null;
    }, r = o(this.beamTree.root, t, 0);
    if (!r) {
      console.log("ERROR: Could not find beam node for this polygon path");
      return;
    }
    console.log(`Found beam node with virtual source: [${r.virtualSource[0].toFixed(3)}, ${r.virtualSource[1].toFixed(3)}, ${r.virtualSource[2].toFixed(3)}]`);
    const i = this.traverseBeam(e, r, !0);
    if (i) {
      console.log("PATH VALID - returned path:");
      for (let l = 0; l < i.length; l++) {
        const n = i[l];
        console.log(`  [${l}] pos=[${n.position[0].toFixed(3)}, ${n.position[1].toFixed(3)}, ${n.position[2].toFixed(3)}], polygonId=${n.polygonId}`);
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
    Ye(this.beamTree);
    for (const e of this.buckets)
      ie(e);
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
    return m.clone(this.sourcePosition);
  }
  /**
   * Get beam data for visualization
   * Returns beams organized by reflection order
   */
  getBeamsForVisualization(e) {
    const t = [], o = e ?? this.beamTree.maxReflectionOrder, r = (i, l, n) => {
      if (l > o)
        return;
      const c = i.id !== -1 ? [...n, i.id] : n;
      i.id !== -1 && i.aperture && t.push({
        virtualSource: m.clone(i.virtualSource),
        apertureVertices: i.aperture.vertices.map((u) => m.clone(u)),
        reflectionOrder: l,
        polygonId: i.id,
        polygonPath: c
      });
      for (const u of i.children)
        r(u, l + 1, c);
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
function me(s) {
  let e = 0;
  for (let t = 1; t < s.length; t++)
    e += m.distance(s[t - 1].position, s[t].position);
  return e;
}
function ot(s, e = 343) {
  return me(s) / e;
}
function rt(s) {
  return s.filter((e) => e.polygonId !== null).length;
}
const it = 0.05;
function nt(s, e) {
  const t = Math.abs(m.dot(m.negate(s), e)), o = Math.max(-1, Math.min(1, t));
  return Math.acos(o);
}
function at(s, e) {
  const t = S.normal(s.plane);
  return m.dot(e, t) > 0 ? m.negate(t) : m.clone(t);
}
function lt(s, e) {
  if (s.length < 2)
    throw new Error("Path must have at least 2 points (listener and source)");
  const t = m.clone(s[0].position), o = m.clone(s[s.length - 1].position), r = [], i = [];
  let l = 0;
  for (let n = 0; n < s.length - 1; n++) {
    const c = s[n].position, u = s[n + 1].position, a = m.distance(c, u);
    i.push({
      startPoint: m.clone(c),
      endPoint: m.clone(u),
      length: a,
      segmentIndex: n
    });
    const h = s[n + 1].polygonId;
    if (h !== null) {
      const d = e[h], f = s[n + 1].position, p = m.normalize(m.subtract(f, c)), v = s[n + 2]?.position;
      let P;
      v ? P = m.normalize(m.subtract(v, f)) : P = m.reflect(p, S.normal(d.plane));
      const y = at(d, p), R = nt(p, y), b = R;
      l += a;
      const I = Math.abs(R - Math.PI / 2) < it;
      r.push({
        polygon: d,
        polygonId: h,
        hitPoint: m.clone(f),
        incidenceAngle: R,
        reflectionAngle: b,
        incomingDirection: p,
        outgoingDirection: P,
        surfaceNormal: y,
        reflectionOrder: r.length + 1,
        cumulativeDistance: l,
        incomingSegmentLength: a,
        isGrazing: I
      });
    } else
      l += a;
  }
  return {
    listenerPosition: t,
    sourcePosition: o,
    totalPathLength: l,
    reflectionCount: r.length,
    reflections: r,
    segments: i,
    simplePath: s
  };
}
class ct {
  constructor(e) {
    this.position = m.clone(e);
  }
}
class ut {
  constructor(e, t, o) {
    this.source = t, this.solver = new st(e, t.position, o);
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
function ht() {
  const s = new ge();
  s.setPoints([]);
  const e = new ve({
    lineWidth: 0.1,
    color: 16711680,
    sizeAttenuation: 1
  });
  return new g.Mesh(s, e);
}
const dt = ne.scale(["#ff8a0b", "#000080"]).mode("lch");
function L(s, e) {
  const t = e + 1, o = dt.colors(t), r = Math.min(s, t - 1), i = ne(o[r]);
  return parseInt(i.hex().slice(1), 16);
}
const ft = {
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
  headRoll: 0,
  edgeDiffractionEnabled: !1,
  lateReverbTailEnabled: !1,
  tailCrossfadeTime: 0,
  tailCrossfadeDuration: 0.05
};
class mt extends pe {
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
  // Edge diffraction
  edgeDiffractionEnabled;
  _edgeGraph = null;
  _raycaster = new g.Raycaster();
  // Late reverberation tail
  lateReverbTailEnabled;
  tailCrossfadeTime;
  tailCrossfadeDuration;
  _energyHistogram = null;
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
  // Response by intensity (per-frequency decay analysis)
  responseByIntensity;
  // Quick estimate
  quickEstimateResults = [];
  estimatedT30 = null;
  _quickEstimateInterval = null;
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
    const t = { ...ft, ...e };
    if (this.kind = "beam-trace", this.uuid = t.uuid || H(), this.name = t.name, this.roomID = t.roomID, this.sourceIDs = t.sourceIDs, this.receiverIDs = t.receiverIDs, this.maxReflectionOrder = t.maxReflectionOrder, this.frequencies = t.frequencies, this.hrtfSubjectId = t.hrtfSubjectId, this.headYaw = t.headYaw, this.headPitch = t.headPitch, this.headRoll = t.headRoll, this.edgeDiffractionEnabled = t.edgeDiffractionEnabled, this.lateReverbTailEnabled = t.lateReverbTailEnabled, this.tailCrossfadeTime = t.tailCrossfadeTime, this.tailCrossfadeDuration = t.tailCrossfadeDuration, this._visualizationMode = t.visualizationMode, this._showAllBeams = t.showAllBeams, this._visibleOrders = t.visibleOrders.length > 0 ? t.visibleOrders : Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this._plotFrequency = 1e3, this._plotOrders = Array.from({ length: t.maxReflectionOrder + 1 }, (o, r) => r), this.levelTimeProgression = t.levelTimeProgression || H(), this.impulseResponseResult = t.impulseResponseResult || H(), !this.roomID) {
      const o = Pe();
      o.length > 0 && (this.roomID = o[0].uuid);
    }
    k("ADD_RESULT", {
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
    }), k("ADD_RESULT", {
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
    }), this.selectedPath = ht(), M.markup.add(this.selectedPath), this.selectedBeamsGroup = new g.Group(), this.selectedBeamsGroup.name = "selected-beams-highlight", M.markup.add(this.selectedBeamsGroup), this.virtualSourcesGroup = new g.Group(), this.virtualSourcesGroup.name = "virtual-sources", M.markup.add(this.virtualSourcesGroup);
  }
  get temperature() {
    return this.room?.temperature ?? 20;
  }
  get c() {
    return we(this.temperature);
  }
  save() {
    return {
      ...ye([
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
        "headRoll",
        "edgeDiffractionEnabled",
        "lateReverbTailEnabled",
        "tailCrossfadeTime",
        "tailCrossfadeDuration"
      ], this),
      visualizationMode: this._visualizationMode,
      showAllBeams: this._showAllBeams,
      visibleOrders: this._visibleOrders
    };
  }
  restore(e) {
    return this.name = e.name, this.uuid = e.uuid, this.autoCalculate = e.autoCalculate ?? !1, this.roomID = e.roomID, this.sourceIDs = e.sourceIDs, this.receiverIDs = e.receiverIDs, this.maxReflectionOrder = e.maxReflectionOrder, this._visualizationMode = e.visualizationMode || "rays", this._showAllBeams = e.showAllBeams ?? !1, this._visibleOrders = e.visibleOrders ?? Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.frequencies = e.frequencies, this.levelTimeProgression = e.levelTimeProgression || H(), this.impulseResponseResult = e.impulseResponseResult || H(), this.hrtfSubjectId = e.hrtfSubjectId ?? "D1", this.headYaw = e.headYaw ?? 0, this.headPitch = e.headPitch ?? 0, this.headRoll = e.headRoll ?? 0, this.edgeDiffractionEnabled = e.edgeDiffractionEnabled ?? !1, this.lateReverbTailEnabled = e.lateReverbTailEnabled ?? !1, this.tailCrossfadeTime = e.tailCrossfadeTime ?? 0, this.tailCrossfadeDuration = e.tailCrossfadeDuration ?? 0.05, this;
  }
  dispose() {
    this.clearVisualization(), this.removeClickHandler(), M.markup.remove(this.selectedPath), M.markup.remove(this.selectedBeamsGroup), M.markup.remove(this.virtualSourcesGroup), k("REMOVE_RESULT", this.levelTimeProgression), k("REMOVE_RESULT", this.impulseResponseResult);
  }
  setupClickHandler() {
    this.removeClickHandler();
    const e = M.renderer.domElement, t = (o) => {
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
      const r = t(o), i = new g.Raycaster();
      i.setFromCamera(r, M.camera);
      const l = Array.from(this.virtualSourceMap.keys());
      i.intersectObjects(l).length > 0 ? e.style.cursor = "pointer" : e.style.cursor = "default";
    }, this.clickHandler = (o) => {
      if (o.button !== 0 || this.virtualSourceMap.size === 0) return;
      const r = t(o), i = new g.Raycaster();
      i.setFromCamera(r, M.camera);
      const l = Array.from(this.virtualSourceMap.keys()), n = i.intersectObjects(l);
      if (n.length > 0) {
        const c = n[0].object, u = this.virtualSourceMap.get(c);
        u && (this.selectedVirtualSource === c ? (this.selectedVirtualSource = null, this.clearSelectedBeams()) : (this.selectedVirtualSource = c, this.highlightVirtualSourcePath(u)));
      }
    }, e.addEventListener("click", this.clickHandler), e.addEventListener("mousemove", this.hoverHandler);
  }
  // Highlight the ray path from a clicked virtual source to the receiver
  // beam contains polygonPath which is the sequence of polygon IDs for reflections
  highlightVirtualSourcePath(e) {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const t = L(e.reflectionOrder, this.maxReflectionOrder), o = new g.Vector3(e.virtualSource[0], e.virtualSource[1], e.virtualSource[2]);
    if (this.receiverIDs.length === 0) return;
    const r = T.getState().containers[this.receiverIDs[0]];
    if (!r) return;
    const i = r.position.clone(), l = new g.LineDashedMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.15
    }), n = new g.BufferGeometry().setFromPoints([o, i]), c = new g.Line(n, l);
    c.computeLineDistances(), this.selectedBeamsGroup.add(c);
    const u = new g.SphereGeometry(0.18, 16, 16), a = new g.MeshBasicMaterial({
      color: t,
      transparent: !0,
      opacity: 0.4
    }), h = new g.Mesh(u, a);
    h.position.copy(o), this.selectedBeamsGroup.add(h);
    const d = e.polygonPath;
    if (!d || d.length === 0) return;
    const f = e.reflectionOrder;
    for (const p of this.validPaths) {
      const v = p.order;
      if (v !== f) continue;
      let P = !0;
      for (let y = 0; y < d.length; y++) {
        const R = v - y;
        if (p.polygonIds[R] !== d[y]) {
          P = !1;
          break;
        }
      }
      if (P) {
        const y = p.points, R = p.order;
        for (let b = 0; b < y.length - 1; b++) {
          const I = y[b], D = y[b + 1], x = I.distanceTo(D), B = new g.Vector3().addVectors(I, D).multiplyScalar(0.5), E = R - b, q = E === 0 ? 16777215 : L(E, this.maxReflectionOrder), V = new g.CylinderGeometry(0.025, 0.025, x, 8), w = new g.MeshBasicMaterial({ color: q }), $ = new g.Mesh(V, w);
          $.position.copy(B);
          const G = new g.Vector3().subVectors(D, I).normalize(), K = new g.Quaternion();
          K.setFromUnitVectors(new g.Vector3(0, 1, 0), G), $.setRotationFromQuaternion(K), this.selectedBeamsGroup.add($);
        }
        for (let b = 1; b < p.points.length - 1; b++) {
          const I = R - b + 1, D = L(I, this.maxReflectionOrder), x = new g.SphereGeometry(0.08, 12, 12), B = new g.MeshBasicMaterial({ color: D }), E = new g.Mesh(x, B);
          E.position.copy(p.points[b]), this.selectedBeamsGroup.add(E);
        }
        M.needsToRender = !0;
        return;
      }
    }
    M.needsToRender = !0;
  }
  removeClickHandler() {
    const e = M.renderer.domElement;
    this.clickHandler && (e.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.hoverHandler && (e.removeEventListener("mousemove", this.hoverHandler), this.hoverHandler = null, e.style.cursor = "default");
  }
  // Convert room surfaces to beam-trace Polygon3D format
  extractPolygons() {
    const e = this.room;
    if (!e) return [];
    const t = [];
    return this.surfaceToPolygonIndex.clear(), this.polygonToSurface.clear(), e.allSurfaces.forEach((o) => {
      const r = this.surfaceToPolygons(o), i = t.length;
      r.forEach((l, n) => {
        this.polygonToSurface.set(i + n, o), t.push(l);
      }), this.surfaceToPolygonIndex.set(
        o.uuid,
        r.map((l, n) => i + n)
      );
    }), t;
  }
  // Convert a Surface to Polygon3D objects
  surfaceToPolygons(e) {
    const t = [], o = e.geometry, r = o.getAttribute("position");
    if (!r) return t;
    e.updateMatrixWorld(!0);
    const i = e.matrixWorld, l = o.getIndex(), n = r.array, c = (u, a, h) => {
      const d = new g.Vector3(
        n[u * 3],
        n[u * 3 + 1],
        n[u * 3 + 2]
      ).applyMatrix4(i), f = new g.Vector3(
        n[a * 3],
        n[a * 3 + 1],
        n[a * 3 + 2]
      ).applyMatrix4(i), p = new g.Vector3(
        n[h * 3],
        n[h * 3 + 1],
        n[h * 3 + 2]
      ).applyMatrix4(i), v = [
        [d.x, d.y, d.z],
        [f.x, f.y, f.z],
        [p.x, p.y, p.z]
      ], P = A.create(v);
      t.push(P);
    };
    if (l) {
      const u = l.array;
      for (let a = 0; a < u.length; a += 3)
        c(u[a], u[a + 1], u[a + 2]);
    } else {
      const u = r.count;
      for (let a = 0; a < u; a += 3)
        c(a, a + 1, a + 2);
    }
    return t;
  }
  // Check if the beam tree needs to be rebuilt (source moved, room changed, or order changed)
  needsBeamTreeRebuild() {
    if (!this.btSolver || this._lastRoomID !== this.roomID || this._lastMaxOrder !== this.maxReflectionOrder || this.sourceIDs.length === 0) return !0;
    const e = T.getState().containers[this.sourceIDs[0]];
    return !e || !this._lastSourcePos || !this._lastSourcePos.equals(e.position);
  }
  // Build/rebuild the beam-trace solver
  buildSolver() {
    if (this.sourceIDs.length === 0) {
      console.warn("BeamTraceSolver: No source selected");
      return;
    }
    const e = T.getState().containers[this.sourceIDs[0]];
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
    ], o = new ct(t);
    this.btSolver = new ut(this.polygons, o, {
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
      const o = T.getState().containers[t];
      if (!o) return;
      const r = [
        o.position.x,
        o.position.y,
        o.position.z
      ], i = this.btSolver.getPaths(r);
      this.lastMetrics = this.btSolver.getMetrics();
      const l = this.btSolver.getDetailedPaths(r);
      i.forEach((n, c) => {
        const u = c < l.length ? l[c] : void 0, a = this.convertPath(n, u);
        this.validPaths.push(a);
      });
    }), this.edgeDiffractionEnabled && this.room && this._computeDiffractionPaths(), this.validPaths.sort((t, o) => t.arrivalTime - o.arrivalTime), this.lateReverbTailEnabled && this.validPaths.length > 0 && this._buildEnergyHistogram(), this._visualizationMode) {
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
    this.calculateLTP(), this.calculateResponseByIntensity(), console.log(`BeamTraceSolver: Found ${this.validPaths.length} valid paths`), this.lastMetrics && (console.log(`  Raycasts: ${this.lastMetrics.raycastCount}`), console.log(`  Cache hits: ${this.lastMetrics.failPlaneCacheHits}`), console.log(`  Buckets skipped: ${this.lastMetrics.bucketsSkipped}`)), M.needsToRender = !0;
  }
  // Convert beam-trace path to our format
  convertPath(e, t) {
    const o = e.map((a) => new g.Vector3(a.position[0], a.position[1], a.position[2])), r = me(e), i = ot(e, this.c), l = rt(e), n = e.map((a) => a.polygonId);
    let c;
    o.length >= 2 ? c = new g.Vector3().subVectors(o[0], o[1]).normalize().negate() : c = new g.Vector3(0, 0, 1);
    const u = t?.reflections.map((a) => ({
      polygonId: a.polygonId,
      hitPoint: new g.Vector3(a.hitPoint[0], a.hitPoint[1], a.hitPoint[2]),
      incidenceAngle: a.incidenceAngle,
      surfaceNormal: new g.Vector3(a.surfaceNormal[0], a.surfaceNormal[1], a.surfaceNormal[2]),
      isGrazing: a.isGrazing
    }));
    return { points: o, order: l, length: r, arrivalTime: i, polygonIds: n, arrivalDirection: c, reflections: u };
  }
  // Calculate Level Time Progression result
  calculateLTP() {
    if (this.validPaths.length === 0) return;
    const e = [...this.validPaths].sort((r, i) => r.arrivalTime - i.arrivalTime), t = { ...Z.getState().results[this.levelTimeProgression] };
    t.data = [], t.info = {
      ...t.info,
      maxOrder: this.maxReflectionOrder,
      frequency: [this._plotFrequency]
    };
    const o = this.receiverIDs.length > 0 ? T.getState().containers[this.receiverIDs[0]] : null;
    for (let r = 0; r < e.length; r++) {
      const i = e[r], l = i.arrivalDirection, n = o ? o.getGain([l.x, l.y, l.z]) : 1, c = this.calculateArrivalPressure(t.info.initialSPL, i, n), u = U(c);
      t.data.push({
        time: i.arrivalTime,
        pressure: u,
        arrival: r + 1,
        order: i.order,
        uuid: `${this.uuid}-path-${r}`
      });
    }
    k("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: t });
  }
  // Clear LTP data
  clearLevelTimeProgressionData() {
    const e = { ...Z.getState().results[this.levelTimeProgression] };
    e.data = [], k("UPDATE_RESULT", { uuid: this.levelTimeProgression, result: e });
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
    M.markup.clearLines(), M.markup.clearPoints(), this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
  }
  drawPaths() {
    const e = this.validPaths.filter((o) => this._visibleOrders.includes(o.order));
    e.forEach((o) => {
      const r = L(o.order, this.maxReflectionOrder), i = (r >> 16 & 255) / 255, l = (r >> 8 & 255) / 255, n = (r & 255) / 255, c = [i, l, n];
      for (let u = 0; u < o.points.length - 1; u++) {
        const a = o.points[u], h = o.points[u + 1];
        M.markup.addLine(
          [a.x, a.y, a.z],
          [h.x, h.y, h.z],
          c,
          c
        );
      }
    }), e.forEach((o) => {
      if (o.bandEnergy && o.points.length === 3) {
        const r = o.points[1], i = L(o.order, this.maxReflectionOrder), l = new g.SphereGeometry(0.06, 8, 8), n = new g.MeshBasicMaterial({ color: i }), c = new g.Mesh(l, n);
        c.position.copy(r), this.virtualSourcesGroup.add(c);
      }
    });
    const t = M.markup.getUsageStats();
    this.lastMetrics && (this.lastMetrics.bufferUsage = t), t.overflowWarning ? console.error(`⚠️ Path buffer overflow! Lines: ${t.linesUsed}/${t.linesCapacity}. Reduce reflection order.`) : t.linesPercent > 80 && console.warn(`Buffer usage high: Lines ${t.linesPercent.toFixed(1)}%`);
  }
  drawBeams() {
    if (!this.btSolver) return;
    this.clearVirtualSources(), this.virtualSourceMap.clear(), this.selectedVirtualSource = null;
    const e = this.validPaths, t = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      const i = r.polygonIds.filter((l) => l !== null).join(",");
      i && t.set(i, r);
    }), this.btSolver.getBeamsForVisualization(this.maxReflectionOrder).forEach((r) => {
      if (!this._visibleOrders.includes(r.reflectionOrder))
        return;
      const i = this.beamHasValidPath(r, e);
      if (!i && !this._showAllBeams)
        return;
      const l = Math.max(0.05, 0.1 - r.reflectionOrder * 0.01), n = L(r.reflectionOrder, this.maxReflectionOrder);
      let c = n;
      if (!i) {
        const p = (n >> 16 & 255) * 0.4 + 76.8, v = (n >> 8 & 255) * 0.4 + 128 * 0.6, P = (n & 255) * 0.4 + 128 * 0.6;
        c = Math.round(p) << 16 | Math.round(v) << 8 | Math.round(P);
      }
      const u = new g.Vector3(r.virtualSource[0], r.virtualSource[1], r.virtualSource[2]), a = new g.SphereGeometry(l, 12, 12), h = new g.MeshStandardMaterial({
        color: c,
        transparent: !i,
        opacity: i ? 1 : 0.4,
        roughness: 0.6,
        metalness: 0.1
      }), d = new g.Mesh(a, h);
      d.position.copy(u), this.virtualSourcesGroup.add(d), i && this.virtualSourceMap.set(d, {
        ...r,
        polygonPath: r.polygonPath || []
      });
      const f = r.apertureVertices;
      if (f && f.length >= 3) {
        const p = f.map(
          (w) => new g.Vector3(w[0], w[1], w[2])
        ), v = new g.BufferGeometry(), P = new Float32Array(p.length * 3);
        for (let w = 0; w < p.length; w++)
          P[w * 3] = p[w].x, P[w * 3 + 1] = p[w].y, P[w * 3 + 2] = p[w].z;
        v.setAttribute("position", new g.BufferAttribute(P, 3));
        const y = [];
        for (let w = 1; w < p.length - 1; w++)
          y.push(0, w, w + 1);
        v.setIndex(y), v.computeVertexNormals();
        const R = new g.MeshBasicMaterial({
          color: c,
          side: g.DoubleSide,
          transparent: !0,
          opacity: i ? 0.2 : 0.08,
          depthWrite: !1
        }), b = new g.Mesh(v, R);
        this.virtualSourcesGroup.add(b);
        const I = new g.BufferGeometry().setFromPoints(p), D = new g.LineBasicMaterial({
          color: c,
          transparent: !0,
          opacity: i ? 0.5 : 0.2
        }), x = new g.LineLoop(I, D);
        this.virtualSourcesGroup.add(x);
        const B = [];
        for (const w of p)
          B.push(u.clone(), w);
        const E = new g.BufferGeometry().setFromPoints(B), q = new g.LineBasicMaterial({
          color: c,
          transparent: !0,
          opacity: i ? 0.35 : 0.12
        }), V = new g.LineSegments(E, q);
        this.virtualSourcesGroup.add(V);
      }
    }), this.setupClickHandler(), M.needsToRender = !0;
  }
  // Check if a beam has a valid path to the receiver
  beamHasValidPath(e, t) {
    const o = e.polygonPath;
    if (!o || o.length === 0) return !1;
    const r = e.reflectionOrder;
    for (const i of t) {
      if (i.order !== r) continue;
      let l = !0;
      for (let n = 0; n < o.length; n++) {
        const c = r - n;
        if (i.polygonIds[c] !== o[n]) {
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
    for (; this.virtualSourcesGroup.children.length > 0; ) {
      const e = this.virtualSourcesGroup.children[0];
      if (this.virtualSourcesGroup.remove(e), e instanceof g.Mesh || e instanceof g.Line) {
        e.geometry?.dispose();
        const t = e.material;
        if (Array.isArray(t))
          for (const o of t)
            o instanceof g.Material && o.dispose();
        else t instanceof g.Material && t.dispose();
      }
    }
  }
  /**
   * Compute first-order UTD edge diffraction paths and add them to validPaths.
   */
  _computeDiffractionPaths() {
    if (!this.room) return;
    const e = T.getState().containers;
    if (this._edgeGraph = _e(this.room.allSurfaces), this._edgeGraph.edges.length === 0) return;
    const t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    for (const n of this.sourceIDs) {
      const c = e[n];
      if (c) {
        t.set(n, [c.position.x, c.position.y, c.position.z]);
        const u = c.directivityHandler;
        if (u) {
          const a = new Array(this.frequencies.length);
          for (let h = 0; h < this.frequencies.length; h++)
            a[h] = u.getPressureAtPosition(0, this.frequencies[h], 0, 0);
          o.set(n, { handler: u, refPressures: a });
        }
      }
    }
    const r = /* @__PURE__ */ new Map();
    for (const n of this.receiverIDs) {
      const c = e[n];
      c && r.set(n, [c.position.x, c.position.y, c.position.z]);
    }
    const i = [];
    this.room.surfaces.traverse((n) => {
      n.kind && n.kind === "surface" && i.push(n.mesh);
    });
    const l = ke(
      this._edgeGraph,
      t,
      r,
      this.frequencies,
      this.c,
      this.temperature,
      this._raycaster,
      i
    );
    for (const n of l) {
      const c = o.get(n.sourceId);
      if (c) {
        const I = t.get(n.sourceId), D = n.diffractionPoint[0] - I[0], x = n.diffractionPoint[1] - I[1], B = n.diffractionPoint[2] - I[2], E = Math.sqrt(D * D + x * x + B * B);
        if (E > 1e-10) {
          const q = Math.acos(Math.max(-1, Math.min(1, x / E))) * (180 / Math.PI), V = Math.atan2(B, D) * (180 / Math.PI);
          for (let w = 0; w < this.frequencies.length; w++)
            try {
              const $ = c.handler.getPressureAtPosition(0, this.frequencies[w], Math.abs(V), q), G = c.refPressures[w];
              typeof $ == "number" && typeof G == "number" && G > 0 && (n.bandEnergy[w] *= ($ / G) ** 2);
            } catch {
            }
        }
      }
      const u = r.get(n.receiverId), a = u[0] - n.diffractionPoint[0], h = u[1] - n.diffractionPoint[1], d = u[2] - n.diffractionPoint[2], f = Math.sqrt(a * a + h * h + d * d), p = f > 1e-10 ? new g.Vector3(a / f, h / f, d / f) : new g.Vector3(0, 0, 1), v = t.get(n.sourceId), P = new g.Vector3(u[0], u[1], u[2]), y = new g.Vector3(n.diffractionPoint[0], n.diffractionPoint[1], n.diffractionPoint[2]), R = new g.Vector3(v[0], v[1], v[2]), b = {
        points: [P, y, R],
        order: 0,
        // diffraction is a "direct-like" path
        length: n.totalDistance,
        arrivalTime: n.time,
        polygonIds: [null, null, null],
        arrivalDirection: p,
        reflections: [],
        bandEnergy: n.bandEnergy
      };
      this.validPaths.push(b);
    }
    l.length > 0 && console.log(`BeamTraceSolver: Found ${l.length} diffraction paths`);
  }
  /**
   * Build per-band energy histograms from all computed paths (for tail synthesis).
   */
  _buildEnergyHistogram() {
    const e = this.frequencies.length;
    this._energyHistogram = [];
    for (let i = 0; i < e; i++)
      this._energyHistogram.push(new Float32Array(ee));
    const o = Array(e).fill(100), r = this.receiverIDs.length > 0 ? T.getState().containers[this.receiverIDs[0]] : null;
    for (const i of this.validPaths) {
      const l = Math.floor(i.arrivalTime / W);
      if (l < 0 || l >= ee) continue;
      const n = i.arrivalDirection, c = r ? r.getGain([n.x, n.y, n.z]) : 1, u = this.calculateArrivalPressure(o, i, c);
      for (let a = 0; a < e; a++)
        this._energyHistogram[a][l] += u[a] * u[a];
    }
  }
  // Calculate impulse response
  async calculateImpulseResponse() {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const e = C.sampleRate, o = Array(this.frequencies.length).fill(100), r = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05, i = Math.floor(e * r) * 2, l = [];
    for (let h = 0; h < this.frequencies.length; h++)
      l.push(new Float32Array(i));
    const n = this.receiverIDs.length > 0 ? T.getState().containers[this.receiverIDs[0]] : null;
    for (const h of this.validPaths) {
      const d = Math.random() > 0.5 ? 1 : -1, f = h.arrivalDirection, p = n ? n.getGain([f.x, f.y, f.z]) : 1, v = this.calculateArrivalPressure(o, h, p), P = Math.floor(h.arrivalTime * e);
      for (let y = 0; y < this.frequencies.length; y++)
        P < l[y].length && (l[y][P] += v[y] * d);
    }
    let c = l;
    if (this.lateReverbTailEnabled && this._energyHistogram) {
      const h = te(
        this._energyHistogram,
        this.frequencies,
        this.tailCrossfadeTime,
        W
      ), { tailSamples: d, tailStartSample: f } = se(h, e), p = Math.floor(this.tailCrossfadeDuration * e);
      c = oe(l, d, f, p);
    }
    const a = new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((h, d) => {
      a.postMessage({ samples: c }), a.onmessage = (f) => {
        const p = f.data.samples, v = new Float32Array(p[0].length >> 1);
        let P = 0;
        for (let I = 0; I < p.length; I++)
          for (let D = 0; D < v.length; D++)
            v[D] += p[I][D], Math.abs(v[D]) > P && (P = Math.abs(v[D]));
        const y = J(v), R = C.createOfflineContext(1, v.length, e), b = C.createBufferSource(y, R);
        b.connect(R.destination), b.start(), C.renderContextAsync(R).then((I) => {
          this.impulseResponse = I, this.updateImpulseResponseResult(I, e), h(I);
        }).catch(d).finally(() => a.terminate());
      }, a.onerror = (f) => {
        a.terminate(), d(f);
      };
    });
  }
  // Calculate arrival pressure for a path
  calculateArrivalPressure(e, t, o = 1) {
    if (t.bandEnergy) {
      const a = Q(j(e)), h = new Array(this.frequencies.length);
      for (let d = 0; d < this.frequencies.length; d++) {
        const f = a[d] * t.bandEnergy[d];
        h[d] = X([f])[0] * o;
      }
      return h;
    }
    const r = Q(j(e)), i = t.points.length - 1;
    if (i >= 1 && this.sourceIDs.length > 0) {
      const a = T.getState().containers[this.sourceIDs[0]];
      if (a?.directivityHandler) {
        const h = t.points[i], d = t.points[i - 1], p = new g.Vector3().subVectors(d, h).normalize().clone().applyEuler(
          new g.Euler(-a.rotation.x, -a.rotation.y, -a.rotation.z, a.rotation.order)
        ), v = p.length();
        if (v > 1e-10) {
          const P = Math.acos(Math.min(1, Math.max(-1, p.z / v))), R = (Math.atan2(p.y, p.x) * 180 / Math.PI % 360 + 360) % 360, b = P * 180 / Math.PI;
          for (let I = 0; I < this.frequencies.length; I++) {
            const D = a.directivityHandler.getPressureAtPosition(0, this.frequencies[I], R, b), x = a.directivityHandler.getPressureAtPosition(0, this.frequencies[I], 0, 0);
            typeof D == "number" && typeof x == "number" && x > 0 && (r[I] *= (D / x) ** 2);
          }
        }
      }
    }
    let l = 0;
    t.polygonIds.forEach((a, h) => {
      if (a === null) return;
      const d = this.polygonToSurface.get(a);
      if (!d) {
        l++;
        return;
      }
      let f = 0;
      if (t.reflections && l < t.reflections.length)
        f = t.reflections[l].incidenceAngle;
      else if (h > 0 && h < t.points.length - 1) {
        const p = new g.Vector3().subVectors(t.points[h + 1], t.points[h]).normalize(), v = new g.Vector3().subVectors(t.points[h - 1], t.points[h]).normalize(), P = Math.min(1, Math.max(-1, p.dot(v)));
        f = Math.acos(P) / 2;
      }
      l++;
      for (let p = 0; p < this.frequencies.length; p++) {
        const v = Math.abs(d.reflectionFunction(this.frequencies[p], f));
        r[p] *= v;
      }
    });
    const n = U(X(r)), c = De(this.frequencies, this.temperature);
    for (let a = 0; a < this.frequencies.length; a++)
      n[a] -= c[a] * t.length;
    const u = j(n);
    if (o !== 1)
      for (let a = 0; a < u.length; a++)
        u[a] *= o;
    return u;
  }
  // Update the IR result with calculated data
  updateImpulseResponseResult(e, t) {
    const o = T.getState().containers, r = this.sourceIDs.length > 0 && o[this.sourceIDs[0]]?.name || "source", i = this.receiverIDs.length > 0 && o[this.receiverIDs[0]]?.name || "receiver", l = e.getChannelData(0), n = [], c = Math.max(1, Math.floor(l.length / 2e3));
    for (let a = 0; a < l.length; a += c)
      n.push({
        time: a / t,
        amplitude: l[a]
      });
    console.log(`BeamTraceSolver: Updating IR result with ${n.length} samples, duration: ${(l.length / t).toFixed(3)}s`);
    const u = {
      kind: N.ImpulseResponse,
      data: n,
      info: {
        sampleRate: t,
        sourceName: r,
        receiverName: i,
        sourceId: this.sourceIDs[0] || "",
        receiverId: this.receiverIDs[0] || ""
      },
      name: `IR: ${r} → ${i}`,
      uuid: this.impulseResponseResult,
      from: this.uuid
    };
    k("UPDATE_RESULT", { uuid: this.impulseResponseResult, result: u });
  }
  async playImpulseResponse() {
    const e = await Te(
      this.impulseResponse,
      () => this.calculateImpulseResponse(),
      this.uuid,
      "BEAMTRACE_SET_PROPERTY"
    );
    this.impulseResponse = e.impulseResponse;
  }
  async downloadImpulseResponse(e, t = C.sampleRate) {
    const o = await xe(
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
    const t = C.sampleRate, r = Array(this.frequencies.length).fill(100), i = this.validPaths[this.validPaths.length - 1].arrivalTime + 0.05;
    if (i <= 0) throw new Error("Invalid impulse response duration");
    const l = Math.floor(t * i) * 2;
    if (l < 2) throw new Error("Impulse response too short to process");
    const n = Le(e), c = [];
    for (let h = 0; h < this.frequencies.length; h++) {
      c.push([]);
      for (let d = 0; d < n; d++)
        c[h].push(new Float32Array(l));
    }
    const u = this.receiverIDs.length > 0 ? T.getState().containers[this.receiverIDs[0]] : null;
    for (const h of this.validPaths) {
      const d = Math.random() > 0.5 ? 1 : -1, f = h.arrivalDirection, p = u ? u.getGain([f.x, f.y, f.z]) : 1, v = this.calculateArrivalPressure(r, h, p), P = Math.floor(h.arrivalTime * t);
      if (P >= l) continue;
      const y = new Float32Array(1);
      for (let R = 0; R < this.frequencies.length; R++) {
        y[0] = v[R] * d;
        const b = Fe(y, f.x, f.y, f.z, e, "threejs");
        for (let I = 0; I < n; I++)
          c[R][I][P] += b[I][0];
      }
    }
    if (this.lateReverbTailEnabled && this._energyHistogram) {
      const h = te(
        this._energyHistogram,
        this.frequencies,
        this.tailCrossfadeTime,
        W
      ), { tailSamples: d, tailStartSample: f } = se(h, t), p = Math.floor(this.tailCrossfadeDuration * t), v = [];
      for (let y = 0; y < this.frequencies.length; y++)
        v.push(c[y][0]);
      const P = oe(v, d, f, p);
      for (let y = 0; y < this.frequencies.length; y++)
        c[y][0] = P[y];
    }
    const a = () => new Worker(new URL(
      /* @vite-ignore */
      "/assets/filter.worker-CKhUfGRZ.js",
      import.meta.url
    ));
    return new Promise((h, d) => {
      const f = async (p) => new Promise((v) => {
        const P = [];
        for (let R = 0; R < this.frequencies.length; R++)
          P.push(c[R][p]);
        const y = a();
        y.postMessage({ samples: P }), y.onmessage = (R) => {
          const b = R.data.samples, I = new Float32Array(b[0].length >> 1);
          for (let D = 0; D < b.length; D++)
            for (let x = 0; x < I.length; x++)
              I[x] += b[D][x];
          y.terminate(), v(I);
        };
      });
      Promise.all(
        Array.from({ length: n }, (p, v) => f(v))
      ).then((p) => {
        let v = 0;
        for (const b of p)
          for (let I = 0; I < b.length; I++)
            Math.abs(b[I]) > v && (v = Math.abs(b[I]));
        if (v > 0)
          for (const b of p)
            for (let I = 0; I < b.length; I++)
              b[I] /= v;
        const P = p[0].length;
        if (P === 0) {
          d(new Error("Filtered signal has zero length"));
          return;
        }
        const R = C.createOfflineContext(n, P, t).createBuffer(n, P, t);
        for (let b = 0; b < n; b++)
          R.copyToChannel(new Float32Array(p[b]), b);
        this.ambisonicImpulseResponse = R, this.ambisonicOrder = e, h(R);
      }).catch(d);
    });
  }
  async downloadAmbisonicImpulseResponse(e, t = 1) {
    const o = await Ae(
      this.ambisonicImpulseResponse,
      (r) => this.calculateAmbisonicImpulseResponse(r),
      this.ambisonicOrder,
      t,
      e
    );
    this.ambisonicImpulseResponse = o.ambisonicImpulseResponse, this.ambisonicOrder = o.ambisonicOrder;
  }
  async calculateBinauralImpulseResponse(e = 1) {
    return (!this.ambisonicImpulseResponse || this.ambisonicOrder !== e) && (this.ambisonicImpulseResponse = await this.calculateAmbisonicImpulseResponse(e), this.ambisonicOrder = e), this.binauralImpulseResponse = await Ce({
      ambisonicImpulseResponse: this.ambisonicImpulseResponse,
      order: e,
      hrtfSubjectId: this.hrtfSubjectId,
      headYaw: this.headYaw,
      headPitch: this.headPitch,
      headRoll: this.headRoll
    }), this.binauralImpulseResponse;
  }
  async playBinauralImpulseResponse(e = 1) {
    const t = await Be(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(e),
      this.uuid,
      "BEAMTRACE_SET_PROPERTY"
    );
    this.binauralImpulseResponse = t.binauralImpulseResponse;
  }
  async downloadBinauralImpulseResponse(e, t = 1) {
    const o = await Ee(
      this.binauralImpulseResponse,
      () => this.calculateBinauralImpulseResponse(t),
      e
    );
    this.binauralImpulseResponse = o.binauralImpulseResponse;
  }
  /**
   * Calculate per-frequency intensity response with T20/T30/T60 decay estimates.
   * Uses existing calculateArrivalPressure() to convert beam-trace paths into
   * the same RayPathResult format the raytracer uses, then delegates to the
   * shared resampleResponseByIntensity() for decay-time fitting.
   */
  calculateResponseByIntensity() {
    if (this.validPaths.length === 0 || this.receiverIDs.length === 0 || this.sourceIDs.length === 0) return;
    const e = this.receiverIDs[0], t = this.sourceIDs[0], r = Array(this.frequencies.length).fill(100), i = T.getState().containers[e], l = [...this.validPaths].sort((u, a) => u.arrivalTime - a.arrivalTime), n = [];
    for (const u of l) {
      const a = u.arrivalDirection, h = i ? i.getGain([a.x, a.y, a.z]) : 1, d = this.calculateArrivalPressure(r, u, h), f = U(d);
      n.push({
        time: u.arrivalTime,
        bounces: u.order,
        level: f
      });
    }
    const c = {
      [e]: {
        [t]: {
          freqs: this.frequencies,
          response: n
        }
      }
    };
    this.responseByIntensity = Oe(c, ze);
  }
  /**
   * Export per-octave-band impulse responses as individual WAV files.
   * Skips the filter worker — writes one WAV per frequency band directly.
   */
  downloadOctaveBandIR(e, t = C.sampleRate) {
    if (this.validPaths.length === 0)
      throw new Error("No paths calculated yet. Run calculate() first.");
    const r = Array(this.frequencies.length).fill(100), i = [...this.validPaths].sort((a, h) => a.arrivalTime - h.arrivalTime), l = i[i.length - 1].arrivalTime + 0.05, n = Math.floor(t * l), c = [];
    for (let a = 0; a < this.frequencies.length; a++)
      c.push(new Float32Array(n));
    const u = this.receiverIDs.length > 0 ? T.getState().containers[this.receiverIDs[0]] : null;
    for (const a of i) {
      const h = Math.random() > 0.5 ? 1 : -1, d = a.arrivalDirection, f = u ? u.getGain([d.x, d.y, d.z]) : 1, p = this.calculateArrivalPressure(r, a, f), v = Math.floor(a.arrivalTime * t);
      for (let P = 0; P < this.frequencies.length; P++)
        v < c[P].length && (c[P][v] += p[P] * h);
    }
    for (let a = 0; a < this.frequencies.length; a++) {
      const h = Me([J(c[a])], { sampleRate: t, bitDepth: 32 });
      Ie.saveAs(h, `${this.frequencies[a]}_${e}.wav`);
    }
  }
  /**
   * Quick RT60 estimate by shooting random rays through the room geometry.
   * Runs in batches via setInterval to avoid blocking the UI.
   */
  startQuickEstimate(e = 500) {
    if (this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.sourceIDs.length === 0) return;
    const t = T.getState().containers[this.sourceIDs[0]];
    if (!t) return;
    const o = this.room;
    if (!o) return;
    const r = [];
    if (o.surfaces.traverse((n) => {
      n.isMesh && r.push(n);
    }), r.length === 0) return;
    this.quickEstimateResults = [], this.estimatedT30 = null;
    let i = 0;
    const l = 10;
    this._quickEstimateInterval = window.setInterval(() => {
      for (let n = 0; n < l && i < e; n++, i++) {
        const c = $e(
          this._raycaster,
          r,
          t.position,
          t.initialIntensity,
          this.frequencies,
          this.temperature
        );
        this.quickEstimateResults.push(c);
      }
      if (i >= e) {
        window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null;
        const n = this.frequencies.length, c = Array(n).fill(0);
        let u = Array(n).fill(0);
        for (const a of this.quickEstimateResults)
          for (let h = 0; h < n; h++)
            a.rt60s[h] > 0 && (c[h] += a.rt60s[h], u[h]++);
        for (let a = 0; a < n; a++)
          c[a] = u[a] > 0 ? c[a] / u[a] : 0;
        this.estimatedT30 = c, k("BEAMTRACE_QUICK_ESTIMATE_COMPLETE", this.uuid);
      }
    }, 5);
  }
  // Clear results
  reset() {
    this.validPaths = [], this.clearVisualization(), this.btSolver = null, this.lastMetrics = null, this.responseByIntensity = void 0, this._quickEstimateInterval !== null && (window.clearInterval(this._quickEstimateInterval), this._quickEstimateInterval = null), this.quickEstimateResults = [], this.estimatedT30 = null, this.clearLevelTimeProgressionData(), this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), M.needsToRender = !0;
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
    return T.getState().containers[this.roomID];
  }
  get sources() {
    return this.sourceIDs.map((e) => T.getState().containers[e]).filter(Boolean);
  }
  get receivers() {
    return this.receiverIDs.map((e) => T.getState().containers[e]).filter(Boolean);
  }
  get numValidPaths() {
    return this.validPaths.length;
  }
  set maxReflectionOrderReset(e) {
    this.maxReflectionOrder = Math.max(0, Math.floor(e)), this._plotOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this._visibleOrders = Array.from({ length: this.maxReflectionOrder + 1 }, (t, o) => o), this.sourceIDs.length > 0 && this.receiverIDs.length > 0 ? (this.calculate(), k("BEAMTRACE_CALCULATE_COMPLETE", this.uuid)) : this.reset();
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
    M.needsToRender = !0;
  }
  // Show all beams toggle (including invalid/orphaned beams)
  get showAllBeams() {
    return this._showAllBeams;
  }
  set showAllBeams(e) {
    this._showAllBeams = e, (this._visualizationMode === "beams" || this._visualizationMode === "both") && (this.clearVisualization(), this._visualizationMode === "both" && this.validPaths.length > 0 && this.drawPaths(), this.btSolver && this.drawBeams(), M.needsToRender = !0);
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
    M.needsToRender = !0;
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
    const t = T.getState().containers[this.receiverIDs[0]];
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
    const e = T.getState().containers[this.receiverIDs[0]];
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
    const t = [...this.validPaths].sort((l, n) => l.arrivalTime - n.arrivalTime);
    if (e < 0 || e >= t.length) {
      console.warn("BeamTraceSolver: Path index out of bounds:", e);
      return;
    }
    const o = t[e];
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams();
    const r = L(o.order, this.maxReflectionOrder), i = new g.LineBasicMaterial({
      color: r,
      linewidth: 2,
      transparent: !1
    });
    for (let l = 0; l < o.points.length - 1; l++) {
      const n = new g.BufferGeometry().setFromPoints([
        o.points[l],
        o.points[l + 1]
      ]), c = new g.Line(n, i);
      this.selectedBeamsGroup.add(c);
    }
    if (this.btSolver && this.receiverIDs.length > 0) {
      const l = T.getState().containers[this.receiverIDs[0]];
      if (l) {
        const n = this.btSolver.getBeamsForVisualization(this.maxReflectionOrder), c = o.polygonIds[o.order];
        if (c !== null) {
          const u = n.find(
            (a) => a.polygonId === c && a.reflectionOrder === o.order
          );
          if (u) {
            const a = new g.LineDashedMaterial({
              color: r,
              linewidth: 1,
              dashSize: 0.3,
              gapSize: 0.15,
              transparent: !0,
              opacity: 0.7
            }), h = new g.Vector3(
              u.virtualSource[0],
              u.virtualSource[1],
              u.virtualSource[2]
            ), d = l.position.clone(), f = new g.BufferGeometry().setFromPoints([h, d]), p = new g.Line(f, a);
            p.computeLineDistances(), this.selectedBeamsGroup.add(p);
          }
        }
      }
    }
    console.log(`BeamTraceSolver: Highlighting path ${e} with order ${o.order}, arrival time ${o.arrivalTime.toFixed(4)}s`), M.needsToRender = !0;
  }
  // Clear the current path highlight
  clearPathHighlight() {
    this.selectedPath.geometry.setPoints([]), this.clearSelectedBeams(), M.needsToRender = !0;
  }
}
_("BEAMTRACE_SET_PROPERTY", Se);
_("REMOVE_BEAMTRACE", be);
_("ADD_BEAMTRACE", Re(mt));
_("BEAMTRACE_CALCULATE", (s) => {
  F.getState().solvers[s].calculate(), setTimeout(() => k("BEAMTRACE_CALCULATE_COMPLETE", s), 0);
});
_("BEAMTRACE_RESET", (s) => {
  F.getState().solvers[s].reset();
});
_("BEAMTRACE_PLAY_IR", (s) => {
  F.getState().solvers[s].playImpulseResponse().catch((t) => {
    window.alert(t.message || "Failed to play impulse response");
  });
});
_("BEAMTRACE_DOWNLOAD_IR", (s) => {
  const e = F.getState().solvers[s], t = T.getState().containers, o = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", r = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-${o}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  e.downloadImpulseResponse(i).catch((l) => {
    window.alert(l.message || "Failed to download impulse response");
  });
});
_("BEAMTRACE_DOWNLOAD_AMBISONIC_IR", ({ uuid: s, order: e }) => {
  const t = F.getState().solvers[s], o = T.getState().containers, r = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", i = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", l = `ir-beamtrace-ambi-${r}-${i}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadAmbisonicImpulseResponse(l, e).catch((n) => {
    window.alert(n.message || "Failed to download ambisonic impulse response");
  });
});
_("BEAMTRACE_PLAY_BINAURAL_IR", ({ uuid: s, order: e }) => {
  F.getState().solvers[s].playBinauralImpulseResponse(e).catch((o) => {
    window.alert(o.message || "Failed to play binaural impulse response");
  });
});
_("BEAMTRACE_DOWNLOAD_BINAURAL_IR", ({ uuid: s, order: e }) => {
  const t = F.getState().solvers[s], o = T.getState().containers, r = t.sourceIDs.length > 0 && o[t.sourceIDs[0]]?.name || "source", i = t.receiverIDs.length > 0 && o[t.receiverIDs[0]]?.name || "receiver", l = `ir-beamtrace-${r}-${i}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  t.downloadBinauralImpulseResponse(l, e).catch((n) => {
    window.alert(n.message || "Failed to download binaural impulse response");
  });
});
_("BEAMTRACE_DOWNLOAD_OCTAVE_IR", (s) => {
  const e = F.getState().solvers[s], t = T.getState().containers, o = e.sourceIDs.length > 0 && t[e.sourceIDs[0]]?.name || "source", r = e.receiverIDs.length > 0 && t[e.receiverIDs[0]]?.name || "receiver", i = `ir-beamtrace-${o}-${r}`.replace(/[^a-zA-Z0-9-_]/g, "_");
  try {
    e.downloadOctaveBandIR(i);
  } catch (l) {
    window.alert(l.message || "Failed to download octave-band impulse responses");
  }
});
_("BEAMTRACE_QUICK_ESTIMATE", (s) => {
  F.getState().solvers[s].startQuickEstimate();
});
_("SHOULD_ADD_BEAMTRACE", () => {
  k("ADD_BEAMTRACE", void 0);
});
export {
  mt as BeamTraceSolver
};
//# sourceMappingURL=index-DXhbflUz.mjs.map
