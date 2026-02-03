//@ts-nocheck
/**
 * @jscad/modeling v2 API with V1 compatibility wrappers
 *
 * Key differences from V1:
 * - Functional API instead of method chaining
 * - Radians for rotation (V1 used degrees in some places)
 * - Renamed functions (difference -> subtract, cube -> cuboid)
 * - Primitives centered by default
 */

// Use dynamic import with top-level await to ensure jscad-modeling-bundle is fully
// loaded and initialized before any other code runs. This prevents TDZ errors
// from circular dependencies when bundlers reorder module code.
// The full URL is constructed at runtime to prevent Rollup from statically analyzing
// and processing the import, which would strip esbuild's __commonJS wrappers.
const bundleUrl = (typeof window !== 'undefined' ? window.location.origin : '') + '/compute/modeling/jscad-modeling-bundle.js';
const modeling = await import(/* @vite-ignore */ bundleUrl).then(m => m.default);

// =============================================================================
// MATH MODULE
// =============================================================================
const { maths } = modeling;
const { vec2: v2Vec2, vec3: v3Vec3, mat4: v2Mat4, plane: v2Plane, line2: v2Line2, line3: v2Line3 } = maths;

// Wrap vec2 with compatibility methods
const vec2 = {
  ...v2Vec2,
  // V1 compatibility: create from array or numbers
  create: (arr?: number[]) => arr ? v2Vec2.fromValues(arr[0] || 0, arr[1] || 0) : v2Vec2.create(),
  fromArray: (arr: number[]) => v2Vec2.fromValues(arr[0], arr[1]),
  fromValues: v2Vec2.fromValues,
  clone: v2Vec2.clone,
  add: v2Vec2.add,
  subtract: v2Vec2.subtract,
  scale: v2Vec2.scale,
  dot: v2Vec2.dot,
  cross: v2Vec2.cross,
  length: v2Vec2.length,
  normalize: v2Vec2.normalize,
  distance: v2Vec2.distance,
  equals: v2Vec2.equals,
  transform: v2Vec2.transform,
  negate: v2Vec2.negate,
  rotate: v2Vec2.rotate,
  angle: v2Vec2.angle,
  lerp: v2Vec2.lerp,
  min: v2Vec2.min,
  max: v2Vec2.max,
  abs: v2Vec2.abs,
  squaredLength: v2Vec2.squaredLength,
  squaredDistance: v2Vec2.squaredDistance,
};

// Wrap vec3 with compatibility methods
const vec3 = {
  ...v3Vec3,
  create: (arr?: number[]) => arr ? v3Vec3.fromValues(arr[0] || 0, arr[1] || 0, arr[2] || 0) : v3Vec3.create(),
  fromArray: (arr: number[]) => v3Vec3.fromValues(arr[0], arr[1], arr[2]),
  fromValues: v3Vec3.fromValues,
  clone: v3Vec3.clone,
  add: v3Vec3.add,
  subtract: v3Vec3.subtract,
  scale: v3Vec3.scale,
  dot: v3Vec3.dot,
  cross: v3Vec3.cross,
  length: v3Vec3.length,
  normalize: v3Vec3.normalize,
  distance: v3Vec3.distance,
  equals: v3Vec3.equals,
  transform: v3Vec3.transform,
  negate: v3Vec3.negate,
  angle: v3Vec3.angle,
  lerp: v3Vec3.lerp,
  min: v3Vec3.min,
  max: v3Vec3.max,
  abs: v3Vec3.abs,
  squaredLength: v3Vec3.squaredLength,
  squaredDistance: v3Vec3.squaredDistance,
  // V1 compatibility aliases
  unit: v3Vec3.normalize,
};

// Wrap mat4 with compatibility methods
const mat4 = {
  ...v2Mat4,
  create: v2Mat4.create,
  clone: v2Mat4.clone,
  identity: v2Mat4.identity,
  fromValues: v2Mat4.fromValues,
  fromTranslation: v2Mat4.fromTranslation,
  fromScaling: v2Mat4.fromScaling,
  fromRotation: v2Mat4.fromRotation,
  fromXRotation: v2Mat4.fromXRotation,
  fromYRotation: v2Mat4.fromYRotation,
  fromZRotation: v2Mat4.fromZRotation,
  fromTaitBryanRotation: v2Mat4.fromTaitBryanRotation,
  multiply: v2Mat4.multiply,
  translate: v2Mat4.translate,
  rotate: v2Mat4.rotate,
  rotateX: v2Mat4.rotateX,
  rotateY: v2Mat4.rotateY,
  rotateZ: v2Mat4.rotateZ,
  scale: v2Mat4.scale,
  invert: v2Mat4.invert,
  equals: v2Mat4.equals,
  mirrorByPlane: v2Mat4.mirrorByPlane,
  transform: v2Mat4.transform,
};

// Wrap plane with compatibility methods
const plane = {
  ...v2Plane,
  create: v2Plane.create,
  clone: v2Plane.clone,
  equals: v2Plane.equals,
  flip: v2Plane.flip,
  fromPoints: v2Plane.fromPoints,
  fromNormalAndPoint: v2Plane.fromNormalAndPoint,
  signedDistanceToPoint: v2Plane.signedDistanceToPoint,
  transform: v2Plane.transform,
  // V1 compatibility
  fromPointsRandom: (a: number[], b: number[], c: number[]) => v2Plane.fromPoints(v2Plane.create(), a, b, c),
};

// Wrap line2 and line3
const line2 = {
  ...v2Line2,
  create: v2Line2.create,
  clone: v2Line2.clone,
  equals: v2Line2.equals,
  fromPoints: v2Line2.fromPoints,
  direction: v2Line2.direction,
  origin: v2Line2.origin,
  closestPoint: v2Line2.closestPoint,
  distanceToPoint: v2Line2.distanceToPoint,
  transform: v2Line2.transform,
};

const line3 = {
  ...v2Line3,
  create: v2Line3.create,
  clone: v2Line3.clone,
  equals: v2Line3.equals,
  fromPoints: v2Line3.fromPoints,
  direction: v2Line3.direction,
  origin: v2Line3.origin,
  closestPoint: v2Line3.closestPoint,
  distanceToPoint: v2Line3.distanceToPoint,
  transform: v2Line3.transform,
};

export const math = {
  vec2,
  vec3,
  mat4,
  plane,
  line2,
  line3,
  // Constants
  constants: maths.constants,
};

// =============================================================================
// GEOMETRY MODULE
// =============================================================================
const { geometries } = modeling;
const { geom2: v2Geom2, geom3: v2Geom3, path2: v2Path2, poly3: v2Poly3 } = geometries;

// Wrap geometry types with compatibility methods
const geom2 = {
  ...v2Geom2,
  create: v2Geom2.create,
  clone: v2Geom2.clone,
  isA: v2Geom2.isA,
  toOutlines: v2Geom2.toOutlines,
  toPoints: v2Geom2.toPoints,
  transform: v2Geom2.transform,
  reverse: v2Geom2.reverse,
};

const geom3 = {
  ...v2Geom3,
  create: v2Geom3.create,
  clone: v2Geom3.clone,
  isA: v2Geom3.isA,
  toPolygons: v2Geom3.toPolygons,
  transform: v2Geom3.transform,
  // V1 compatibility: fromPolygons
  fromPolygons: (polygons: any[]) => {
    const polys = polygons.map(p => {
      if (v2Poly3.isA(p)) return p;
      // Handle V1 polygon format with vertices array
      if (p.vertices) {
        return v2Poly3.create(p.vertices);
      }
      return v2Poly3.create(p);
    });
    return v2Geom3.create(polys);
  },
};

const path2 = {
  ...v2Path2,
  create: v2Path2.create,
  clone: v2Path2.clone,
  isA: v2Path2.isA,
  toPoints: v2Path2.toPoints,
  transform: v2Path2.transform,
  close: v2Path2.close,
  concat: v2Path2.concat,
  fromPoints: v2Path2.fromPoints,
  appendPoints: v2Path2.appendPoints,
  appendArc: v2Path2.appendArc,
  appendBezier: v2Path2.appendBezier,
  equals: v2Path2.equals,
  reverse: v2Path2.reverse,
};

const poly3 = {
  ...v2Poly3,
  create: v2Poly3.create,
  clone: v2Poly3.clone,
  isA: v2Poly3.isA,
  fromPoints: v2Poly3.fromPoints,
  toPoints: (polygon: any) => polygon.vertices || v2Poly3.toVertices(polygon),
  // Compatibility: toVertices alias
  toVertices: v2Poly3.toVertices,
  transform: v2Poly3.transform,
  // V1 compatibility methods
  plane: (polygon: any) => {
    // V2 stores plane in the polygon
    if (polygon.plane) return polygon.plane;
    // Calculate plane from vertices
    const vertices = polygon.vertices || v2Poly3.toVertices(polygon);
    if (vertices.length >= 3) {
      return v2Plane.fromPoints(v2Plane.create(), vertices[0], vertices[1], vertices[2]);
    }
    return v2Plane.create();
  },
  flip: (polygon: any) => {
    const vertices = polygon.vertices || v2Poly3.toVertices(polygon);
    const flippedVertices = vertices.slice().reverse();
    const flippedPlane = polygon.plane ? v2Plane.flip(v2Plane.create(), polygon.plane) : null;
    return {
      vertices: flippedVertices,
      plane: flippedPlane
    };
  },
  // V1 compatibility: fromPointsAndPlane
  fromPointsAndPlane: (vertices: number[][], planeVal: number[]) => {
    return {
      vertices: vertices,
      plane: planeVal
    };
  },
  // V1 compatibility: measureBoundingSphere
  measureBoundingSphere: (polygon: any): [number[], number] => {
    const vertices = polygon.vertices || v2Poly3.toVertices(polygon);
    if (vertices.length === 0) {
      return [[0, 0, 0], 0];
    }

    // Calculate center (centroid)
    const center = [0, 0, 0];
    for (const v of vertices) {
      center[0] += v[0];
      center[1] += v[1];
      center[2] += v[2];
    }
    center[0] /= vertices.length;
    center[1] /= vertices.length;
    center[2] /= vertices.length;

    // Calculate radius (max distance from center)
    let maxDistSq = 0;
    for (const v of vertices) {
      const dx = v[0] - center[0];
      const dy = v[1] - center[1];
      const dz = v[2] - center[2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > maxDistSq) maxDistSq = distSq;
    }

    return [center, Math.sqrt(maxDistSq)];
  },
};

export const geometry = {
  geom2,
  geom3,
  path2,
  poly3,
};

// =============================================================================
// PRIMITIVES MODULE
// =============================================================================
const { primitives: v2Primitives } = modeling;

// Flatten helper
const flatten = (arr: any[]): any[] => {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
};

// Wrap primitives with V1-compatible options
const cube = (options: { size?: number | number[], center?: number[] } = {}) => {
  const size = options.size ?? 1;
  const sizeArr = Array.isArray(size) ? size : [size, size, size];
  const center = options.center;
  let result = v2Primitives.cuboid({ size: sizeArr });
  if (center) {
    result = modeling.transforms.translate(center, result);
  }
  return result;
};

const sphere = (options: { radius?: number, r?: number, center?: number[], resolution?: number, segments?: number } = {}) => {
  const radius = options.radius ?? options.r ?? 1;
  const segments = options.segments ?? options.resolution ?? 32;
  const center = options.center;
  let result = v2Primitives.sphere({ radius, segments });
  if (center) {
    result = modeling.transforms.translate(center, result);
  }
  return result;
};

const cylinder = (options: {
  radius?: number, r?: number, r1?: number, r2?: number,
  height?: number, h?: number,
  center?: number[],
  resolution?: number, segments?: number
} = {}) => {
  const radius = options.radius ?? options.r ?? 1;
  const height = options.height ?? options.h ?? 1;
  const segments = options.segments ?? options.resolution ?? 32;
  const startRadius = options.r1 ?? radius;
  const endRadius = options.r2 ?? radius;
  const center = options.center;

  let result;
  if (startRadius !== endRadius) {
    result = v2Primitives.cylinderElliptic({
      height,
      startRadius: [startRadius, startRadius],
      endRadius: [endRadius, endRadius],
      segments
    });
  } else {
    result = v2Primitives.cylinder({ radius, height, segments });
  }

  if (center) {
    result = modeling.transforms.translate(center, result);
  }
  return result;
};

const torus = (options: {
  innerRadius?: number, ri?: number,
  outerRadius?: number, ro?: number,
  innerResolution?: number, innerSegments?: number,
  outerResolution?: number, outerSegments?: number
} = {}) => {
  const innerRadius = options.innerRadius ?? options.ri ?? 1;
  const outerRadius = options.outerRadius ?? options.ro ?? 4;
  const innerSegments = options.innerSegments ?? options.innerResolution ?? 32;
  const outerSegments = options.outerSegments ?? options.outerResolution ?? 32;
  return v2Primitives.torus({ innerRadius, outerRadius, innerSegments, outerSegments });
};

const polyhedron = (options: { points?: number[][], faces?: number[][], triangles?: number[][] } = {}) => {
  const points = options.points || [];
  const faces = options.faces || options.triangles || [];
  return v2Primitives.polyhedron({ points, faces });
};

const rectangle = (options: { size?: number[], center?: number[] } = {}) => {
  const size = options.size ?? [1, 1];
  const center = options.center;
  let result = v2Primitives.rectangle({ size });
  if (center) {
    result = modeling.transforms.translate([center[0], center[1], 0], result);
  }
  return result;
};

const circle = (options: { radius?: number, r?: number, center?: number[], resolution?: number, segments?: number } = {}) => {
  const radius = options.radius ?? options.r ?? 1;
  const segments = options.segments ?? options.resolution ?? 32;
  const center = options.center;
  let result = v2Primitives.circle({ radius, segments });
  if (center) {
    result = modeling.transforms.translate([center[0], center[1], 0], result);
  }
  return result;
};

const polygon = (options: { points?: number[][] } = {}) => {
  const points = options.points || [];
  return v2Primitives.polygon({ points });
};

export const primitives = {
  cube,
  cuboid: v2Primitives.cuboid,
  sphere,
  cylinder,
  torus,
  polyhedron,
  rectangle,
  square: rectangle,
  circle,
  ellipse: v2Primitives.ellipse,
  polygon,
  // V2 specific
  arc: v2Primitives.arc,
  ellipsoid: v2Primitives.ellipsoid,
  geodesicSphere: v2Primitives.geodesicSphere,
  roundedCuboid: v2Primitives.roundedCuboid,
  roundedCylinder: v2Primitives.roundedCylinder,
  roundedRectangle: v2Primitives.roundedRectangle,
  star: v2Primitives.star,
  line: v2Primitives.line,
};

// =============================================================================
// BOOLEANS MODULE
// =============================================================================
const { booleans: v2Booleans } = modeling;

const union = (...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  if (flattened.length === 1) return flattened[0];
  return v2Booleans.union(flattened);
};

const subtract = (...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  if (flattened.length === 1) return flattened[0];
  return v2Booleans.subtract(flattened);
};

const intersect = (...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  if (flattened.length === 1) return flattened[0];
  return v2Booleans.intersect(flattened);
};

export const booleans = {
  union,
  subtract,
  intersect,
  // V1 compatibility alias
  difference: subtract,
};

// =============================================================================
// TRANSFORMS MODULE
// =============================================================================
const { transforms: v2Transforms } = modeling;

const translate = (offset: number[], ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.translate(offset, obj));
  return results.length === 1 ? results[0] : results;
};

const translateX = (offset: number, ...objects: any[]) => translate([offset, 0, 0], ...objects);
const translateY = (offset: number, ...objects: any[]) => translate([0, offset, 0], ...objects);
const translateZ = (offset: number, ...objects: any[]) => translate([0, 0, offset], ...objects);

// Note: V2 uses RADIANS for rotation (same as V1)
const rotate = (angles: number[], ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.rotate(angles, obj));
  return results.length === 1 ? results[0] : results;
};

const rotateX = (angle: number, ...objects: any[]) => rotate([angle, 0, 0], ...objects);
const rotateY = (angle: number, ...objects: any[]) => rotate([0, angle, 0], ...objects);
const rotateZ = (angle: number, ...objects: any[]) => rotate([0, 0, angle], ...objects);

const scale = (factors: number[], ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.scale(factors, obj));
  return results.length === 1 ? results[0] : results;
};

const scaleX = (factor: number, ...objects: any[]) => scale([factor, 1, 1], ...objects);
const scaleY = (factor: number, ...objects: any[]) => scale([1, factor, 1], ...objects);
const scaleZ = (factor: number, ...objects: any[]) => scale([1, 1, factor], ...objects);

const mirror = (options: { origin?: number[], normal?: number[] }, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.mirror(options, obj));
  return results.length === 1 ? results[0] : results;
};

const mirrorX = (...objects: any[]) => mirror({ normal: [1, 0, 0] }, ...objects);
const mirrorY = (...objects: any[]) => mirror({ normal: [0, 1, 0] }, ...objects);
const mirrorZ = (...objects: any[]) => mirror({ normal: [0, 0, 1] }, ...objects);

const center = (options: { axes?: boolean[] } = {}, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.center(options, obj));
  return results.length === 1 ? results[0] : results;
};

const centerX = (...objects: any[]) => center({ axes: [true, false, false] }, ...objects);
const centerY = (...objects: any[]) => center({ axes: [false, true, false] }, ...objects);
const centerZ = (...objects: any[]) => center({ axes: [false, false, true] }, ...objects);

const transform = (matrix: any, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Transforms.transform(matrix, obj));
  return results.length === 1 ? results[0] : results;
};

export const transforms = {
  translate,
  translateX,
  translateY,
  translateZ,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  scaleX,
  scaleY,
  scaleZ,
  mirror,
  mirrorX,
  mirrorY,
  mirrorZ,
  center,
  centerX,
  centerY,
  centerZ,
  transform,
  align: v2Transforms.align,
};

// =============================================================================
// MEASUREMENTS MODULE
// =============================================================================
const { measurements: v2Measurements } = modeling;

export const measurements = {
  measureArea: v2Measurements.measureArea,
  measureBoundingBox: v2Measurements.measureBoundingBox,
  measureBoundingSphere: v2Measurements.measureBoundingSphere,
  measureCenter: v2Measurements.measureCenter,
  measureCenterOfMass: v2Measurements.measureCenterOfMass,
  measureDimensions: v2Measurements.measureDimensions,
  measureVolume: v2Measurements.measureVolume,
  measureAggregateArea: v2Measurements.measureAggregateArea,
  measureAggregateVolume: v2Measurements.measureAggregateVolume,
  measureAggregateBoundingBox: v2Measurements.measureAggregateBoundingBox,
  measureEpsilon: v2Measurements.measureEpsilon,
};

// =============================================================================
// EXTRUSIONS MODULE
// =============================================================================
const { extrusions: v2Extrusions } = modeling;

const extrudeLinear = (options: { height?: number, twist?: number, slices?: number }, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Extrusions.extrudeLinear(options, obj));
  return results.length === 1 ? results[0] : results;
};

const extrudeRotate = (options: { angle?: number, startAngle?: number, segments?: number }, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Extrusions.extrudeRotate(options, obj));
  return results.length === 1 ? results[0] : results;
};

export const extrusions = {
  extrudeLinear,
  extrudeRotate,
  extrudeRectangular: v2Extrusions.extrudeRectangular,
  extrudeFromSlices: v2Extrusions.extrudeFromSlices,
  extrudeHelical: v2Extrusions.extrudeHelical,
};

// =============================================================================
// EXPANSIONS MODULE
// =============================================================================
const { expansions: v2Expansions } = modeling;

const expand = (options: { delta?: number, corners?: string, segments?: number }, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  const results = flattened.map(obj => v2Expansions.expand(options, obj));
  return results.length === 1 ? results[0] : results;
};

const offset = (options: { delta?: number, corners?: string, segments?: number }, ...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom2.create();
  const results = flattened.map(obj => v2Expansions.offset(options, obj));
  return results.length === 1 ? results[0] : results;
};

export const expansions = {
  expand,
  offset,
};

// =============================================================================
// HULLS MODULE
// =============================================================================
const { hulls: v2Hulls } = modeling;

const hull = (...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  return v2Hulls.hull(flattened);
};

const hullChain = (...objects: any[]) => {
  const flattened = flatten(objects);
  if (flattened.length === 0) return geom3.create();
  return v2Hulls.hullChain(flattened);
};

export const hulls = {
  hull,
  hullChain,
};

// =============================================================================
// TEXT MODULE
// =============================================================================
const { text: v2Text } = modeling;

export const text = {
  vectorText: v2Text.vectorText,
  vectorChar: v2Text.vectorChar,
};

// =============================================================================
// COLORS MODULE
// =============================================================================
const { colors: v2Colors } = modeling;

// CSS colors from V1
const cssColors = {
  black: [0, 0, 0],
  silver: [192/255, 192/255, 192/255],
  gray: [128/255, 128/255, 128/255],
  white: [1, 1, 1],
  maroon: [128/255, 0, 0],
  red: [1, 0, 0],
  purple: [128/255, 0, 128/255],
  fuchsia: [1, 0, 1],
  green: [0, 128/255, 0],
  lime: [0, 1, 0],
  olive: [128/255, 128/255, 0],
  yellow: [1, 1, 0],
  navy: [0, 0, 128/255],
  blue: [0, 0, 1],
  teal: [0, 128/255, 128/255],
  aqua: [0, 1, 1],
};

const color = (colorVal: number[] | string, ...objects: any[]) => {
  let rgba: number[];
  if (typeof colorVal === 'string') {
    const rgb = cssColors[colorVal.toLowerCase()] || v2Colors.colorNameToRgb(colorVal);
    rgba = [...rgb, 1];
  } else {
    rgba = colorVal.length === 3 ? [...colorVal, 1] : colorVal;
  }

  const flattened = flatten(objects);
  const results = flattened.map(obj => v2Colors.colorize(rgba, obj));
  return results.length === 1 ? results[0] : results;
};

export const colorModule = {
  color,
  cssColors,
  colorize: v2Colors.colorize,
  colorNameToRgb: v2Colors.colorNameToRgb,
  hexToRgb: v2Colors.hexToRgb,
  hslToRgb: v2Colors.hslToRgb,
  hsvToRgb: v2Colors.hsvToRgb,
  rgbToHex: v2Colors.rgbToHex,
  rgbToHsl: v2Colors.rgbToHsl,
  rgbToHsv: v2Colors.rgbToHsv,
};

// Alias for backwards compatibility
export { colorModule as color };

// =============================================================================
// UTILS MODULE
// =============================================================================
const { utils: v2Utils } = modeling;

export const utils = {
  flatten,
  degToRad: v2Utils.degToRad,
  radToDeg: v2Utils.radToDeg,
};

// =============================================================================
// CONNECTORS MODULE (V1 compatibility - simplified)
// =============================================================================
class Connector {
  point: number[];
  axisvector: number[];
  normalvector: number[];

  constructor(point: number[], axisvector: number[], normalvector: number[]) {
    this.point = point;
    this.axisvector = vec3.normalize(vec3.create(), axisvector);
    this.normalvector = vec3.normalize(vec3.create(), normalvector);
  }

  normalized() {
    return new Connector(
      this.point,
      vec3.normalize(vec3.create(), this.axisvector),
      vec3.normalize(vec3.create(), this.normalvector)
    );
  }

  transform(matrix: any) {
    const point = vec3.transform(vec3.create(), this.point, matrix);
    const axisvector = vec3.transform(vec3.create(), this.axisvector, matrix);
    const normalvector = vec3.transform(vec3.create(), this.normalvector, matrix);
    return new Connector(point, axisvector, normalvector);
  }
}

export const connectors = {
  Connector,
  create: (point: number[], axisvector: number[], normalvector: number[]) =>
    new Connector(point, axisvector, normalvector),
};
