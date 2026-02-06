// Mock Three.js for testing

// Vector classes
export class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  toArray() {
    return [this.x, this.y];
  }
  fromArray(arr: number[]) {
    this.x = arr[0] ?? 0;
    this.y = arr[1] ?? 0;
    return this;
  }
}

export class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  setX(x: number) {
    this.x = x;
    return this;
  }
  setY(y: number) {
    this.y = y;
    return this;
  }
  setZ(z: number) {
    this.z = z;
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  copy(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  fromArray(arr: number[]) {
    this.x = arr[0] ?? 0;
    this.y = arr[1] ?? 0;
    this.z = arr[2] ?? 0;
    return this;
  }
  applyMatrix4(m: Matrix4) {
    return this;
  }
  normalize() {
    const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (len > 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  add(v: Vector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  addScaledVector(v: Vector3, s: number) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }
  sub(v: Vector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subVectors(a: Vector3, b: Vector3) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  crossVectors(a: Vector3, b: Vector3) {
    this.x = a.y * b.z - a.z * b.y;
    this.y = a.z * b.x - a.x * b.z;
    this.z = a.x * b.y - a.y * b.x;
    return this;
  }
  multiplyScalar(s: number) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  divideScalar(s: number) {
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }
  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v: Vector3) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  equals(v: Vector3) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }
  distanceTo(v: Vector3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
}

// Euler class for rotations
export class Euler {
  x: number;
  y: number;
  z: number;
  order: string;
  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  set(x: number, y: number, z: number, order?: string) {
    this.x = x;
    this.y = y;
    this.z = z;
    if (order) this.order = order;
    return this;
  }
  toArray() {
    return [this.x, this.y, this.z, this.order];
  }
  fromArray(arr: [number, number, number, string?]) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];
    if (arr[3]) this.order = arr[3];
    return this;
  }
}

// Matrix4 class
export class Matrix4 {
  elements: number[] = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  fromArray(arr: number[]) {
    this.elements = arr.slice(0, 16);
    return this;
  }
  identity() {
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return this;
  }
}

// Quaternion class
export class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

// Color class
export class Color {
  r: number;
  g: number;
  b: number;
  private _hex: number;
  constructor(r: number | string = 1, g = 1, b = 1) {
    if (typeof r === 'number' && arguments.length === 1) {
      this._hex = r;
      this.r = ((r >> 16) & 255) / 255;
      this.g = ((r >> 8) & 255) / 255;
      this.b = (r & 255) / 255;
    } else {
      this.r = typeof r === 'number' ? r : 1;
      this.g = g;
      this.b = b;
      this._hex = 0xffffff;
    }
  }
  set(color: number | string | Color) {
    return this;
  }
  setHex(hex: number) {
    this._hex = hex;
    return this;
  }
  setStyle(style: string) {
    return this;
  }
  getHex() {
    return this._hex;
  }
  getHexString() {
    return this._hex.toString(16).padStart(6, '0');
  }
}

// Triangle class
export class Triangle {
  a: Vector3;
  b: Vector3;
  c: Vector3;
  constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  getArea() {
    // Calculate area using cross product
    const ab = new Vector3(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z);
    const ac = new Vector3(this.c.x - this.a.x, this.c.y - this.a.y, this.c.z - this.a.z);
    const crossX = ab.y * ac.z - ab.z * ac.y;
    const crossY = ab.z * ac.x - ab.x * ac.z;
    const crossZ = ab.x * ac.y - ab.y * ac.x;
    return 0.5 * Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
  }
  getNormal(target: Vector3) {
    // Calculate normal using cross product of edges
    const ab = new Vector3(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z);
    const ac = new Vector3(this.c.x - this.a.x, this.c.y - this.a.y, this.c.z - this.a.z);
    target.x = ab.y * ac.z - ab.z * ac.y;
    target.y = ab.z * ac.x - ab.x * ac.z;
    target.z = ab.x * ac.y - ab.y * ac.x;
    // Normalize
    const len = Math.sqrt(target.x * target.x + target.y * target.y + target.z * target.z);
    if (len > 0) {
      target.x /= len;
      target.y /= len;
      target.z /= len;
    }
    return target;
  }
  getMidpoint(target: Vector3) {
    target.x = (this.a.x + this.b.x + this.c.x) / 3;
    target.y = (this.a.y + this.b.y + this.c.y) / 3;
    target.z = (this.a.z + this.b.z + this.c.z) / 3;
    return target;
  }
}

// Box3 class
export class Box3 {
  min: Vector3;
  max: Vector3;
  constructor(min = new Vector3(-Infinity, -Infinity, -Infinity), max = new Vector3(Infinity, Infinity, Infinity)) {
    this.min = min;
    this.max = max;
  }
  setFromObject(object: Object3D) {
    return this;
  }
  getCenter(target: Vector3) {
    return target;
  }
  getSize(target: Vector3) {
    return target;
  }
}

// Object3D base class
let objectIdCounter = 0;
export class Object3D {
  uuid: string;
  name: string;
  parent: Object3D | null;
  children: Object3D[];
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  visible: boolean;
  userData: Record<string, any>;
  type: string;

  constructor() {
    this.uuid = `obj-${++objectIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
    this.name = '';
    this.parent = null;
    this.children = [];
    this.position = new Vector3();
    this.rotation = new Euler();
    this.scale = new Vector3(1, 1, 1);
    this.visible = true;
    this.userData = {};
    this.type = 'Object3D';
  }

  add(...objects: Object3D[]) {
    for (const obj of objects) {
      if (obj.parent) {
        obj.parent.remove(obj);
      }
      obj.parent = this;
      this.children.push(obj);
    }
    return this;
  }

  remove(...objects: Object3D[]) {
    for (const obj of objects) {
      const index = this.children.indexOf(obj);
      if (index !== -1) {
        obj.parent = null;
        this.children.splice(index, 1);
      }
    }
    return this;
  }

  traverse(callback: (obj: Object3D) => void) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }

  traverseVisible(callback: (obj: Object3D) => void) {
    if (!this.visible) return;
    callback(this);
    for (const child of this.children) {
      child.traverseVisible(callback);
    }
  }

  clone(recursive?: boolean) {
    return new Object3D();
  }
}

// Group class
export class Group extends Object3D {
  type = 'Group';
}

// Mesh class
export class Mesh extends Object3D {
  geometry: any;
  material: any;
  type = 'Mesh';

  constructor(geometry?: any, material?: any) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}

// Scene class
export class Scene extends Object3D {
  type = 'Scene';
  background: Color | null = null;
}

// Camera classes
export class Camera extends Object3D {
  type = 'Camera';
  matrixWorldInverse = new Matrix4();
  projectionMatrix = new Matrix4();
}

export class PerspectiveCamera extends Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  type = 'PerspectiveCamera';

  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  updateProjectionMatrix() {}
}

export class OrthographicCamera extends Camera {
  type = 'OrthographicCamera';
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2000) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }

  updateProjectionMatrix() {}
}

// Light classes
export class Light extends Object3D {
  color: Color;
  intensity: number;
  type = 'Light';

  constructor(color?: number, intensity?: number) {
    super();
    this.color = new Color();
    this.intensity = intensity ?? 1;
  }
}

export class AmbientLight extends Light {
  type = 'AmbientLight';
}

export class DirectionalLight extends Light {
  type = 'DirectionalLight';
  target = new Object3D();
}

export class PointLight extends Light {
  type = 'PointLight';
  distance = 0;
  decay = 2;
}

// Geometry classes
export class BufferGeometry {
  uuid = `geom-${++objectIdCounter}`;
  attributes: Record<string, any> = {};
  index: any = null;
  name = '';
  boundingBox: Box3 | null = null;
  boundingSphere: { center: Vector3; radius: number } | null = null;

  setAttribute(name: string, attribute: any) {
    this.attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  setIndex(index: any) {
    this.index = index;
    return this;
  }

  dispose() {}

  computeBoundingBox() {
    this.boundingBox = new Box3();
  }
  computeBoundingSphere() {
    this.boundingSphere = { center: new Vector3(), radius: 0 };
  }
  computeVertexNormals() {
    // Set a mock normal attribute
    const position = this.attributes['position'];
    if (position) {
      const normals = new Float32Array(position.array.length);
      for (let i = 0; i < normals.length; i += 3) {
        normals[i] = 0;
        normals[i + 1] = 0;
        normals[i + 2] = 1;
      }
      this.attributes['normal'] = new BufferAttribute(normals, 3);
    }
  }

  toJSON() {
    const data: any = {
      metadata: { version: 4.5, type: 'BufferGeometry', generator: 'Mock' },
      uuid: this.uuid,
      type: 'BufferGeometry',
      name: this.name,
      data: { attributes: {} },
    };

    for (const key in this.attributes) {
      const attr = this.attributes[key];
      data.data.attributes[key] = {
        itemSize: attr.itemSize,
        type: 'Float32Array',
        array: Array.from(attr.array),
        normalized: false,
      };
    }

    return data;
  }
}

export class BoxGeometry extends BufferGeometry {}
export class SphereGeometry extends BufferGeometry {}
export class PlaneGeometry extends BufferGeometry {}

// IcosahedronGeometry - generates proper icosahedron vertices for BRDF hemisphere sampling
export class IcosahedronGeometry extends BufferGeometry {
  constructor(radius: number = 1, detail: number = 0) {
    super();
    const t = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
      [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
      [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len * radius, y / len * radius, z / len * radius];
    });

    const baseFaces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    let faces = baseFaces.map(f => f.slice());
    let vertices = baseVertices.map(v => v.slice());

    for (let d = 0; d < detail; d++) {
      const newFaces: number[][] = [];
      const midCache: Map<string, number> = new Map();
      const getMidpoint = (a: number, b: number): number => {
        const key = Math.min(a, b) + ':' + Math.max(a, b);
        if (midCache.has(key)) return midCache.get(key)!;
        const va = vertices[a], vb = vertices[b];
        const mx = (va[0] + vb[0]) / 2, my = (va[1] + vb[1]) / 2, mz = (va[2] + vb[2]) / 2;
        const len = Math.sqrt(mx * mx + my * my + mz * mz);
        const idx = vertices.length;
        vertices.push([mx / len * radius, my / len * radius, mz / len * radius]);
        midCache.set(key, idx);
        return idx;
      };
      for (const [a, b, c] of faces) {
        const ab = getMidpoint(a, b);
        const bc = getMidpoint(b, c);
        const ca = getMidpoint(c, a);
        newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
      }
      faces = newFaces;
    }

    const positions = new Float32Array(faces.length * 9);
    for (let i = 0; i < faces.length; i++) {
      const [a, b, c] = faces[i];
      positions[i * 9]     = vertices[a][0]; positions[i * 9 + 1] = vertices[a][1]; positions[i * 9 + 2] = vertices[a][2];
      positions[i * 9 + 3] = vertices[b][0]; positions[i * 9 + 4] = vertices[b][1]; positions[i * 9 + 5] = vertices[b][2];
      positions[i * 9 + 6] = vertices[c][0]; positions[i * 9 + 7] = vertices[c][1]; positions[i * 9 + 8] = vertices[c][2];
    }
    this.setAttribute('position', new Float32BufferAttribute(positions, 3));
  }
}

// Material classes
export class Material {
  uuid = `mat-${++objectIdCounter}`;
  side = 0;
  transparent = false;
  opacity = 1;
  visible = true;

  dispose() {}
}

export class MeshBasicMaterial extends Material {
  color = new Color();
  wireframe = false;
}

export class MeshStandardMaterial extends Material {
  color = new Color();
  roughness = 1;
  metalness = 0;
}

export class MeshPhongMaterial extends Material {
  color = new Color();
  shininess = 30;
}

export class LineBasicMaterial extends Material {
  color = new Color();
  linewidth = 1;
}

export class ShaderMaterial extends Material {
  uniforms: Record<string, any> = {};
  vertexShader = '';
  fragmentShader = '';
}

export class MeshLambertMaterial extends Material {
  color = new Color();
  emissive = new Color(0);
  needsUpdate = false;
}

export class MeshMatcapMaterial extends Material {
  color = new Color();
  matcap: Texture | null = null;
  needsUpdate = false;
}

// BufferAttribute
export class BufferAttribute {
  array: ArrayLike<number>;
  itemSize: number;
  count: number;
  needsUpdate = false;
  usage = 0;

  constructor(array: ArrayLike<number>, itemSize: number, normalized = false) {
    this.array = array;
    this.itemSize = itemSize;
    this.count = array.length / itemSize;
  }

  setXYZ(index: number, x: number, y: number, z: number) {
    return this;
  }

  setXY(index: number, x: number, y: number) {
    return this;
  }

  getX(index: number) {
    return this.array[index * this.itemSize];
  }

  getY(index: number) {
    return this.array[index * this.itemSize + 1];
  }

  getZ(index: number) {
    return this.array[index * this.itemSize + 2];
  }
}

export class Float32BufferAttribute extends BufferAttribute {
  constructor(array: number[] | Float32Array, itemSize: number) {
    super(array, itemSize);
  }
}

// Raycaster
export class Raycaster {
  ray = { origin: new Vector3(), direction: new Vector3() };
  near = 0;
  far = Infinity;

  set(origin: Vector3, direction: Vector3) {}
  setFromCamera(coords: Vector2, camera: Camera) {}
  intersectObject(object: Object3D, recursive?: boolean): any[] {
    return [];
  }
  intersectObjects(objects: Object3D[], recursive?: boolean): any[] {
    return [];
  }
}

// WebGLRenderer
export class WebGLRenderer {
  domElement = typeof document !== 'undefined' ? document.createElement('canvas') : {};
  info = {
    memory: { geometries: 0, textures: 0 },
    render: { calls: 0, triangles: 0 },
  };

  constructor(params?: any) {}
  setSize(width: number, height: number) {}
  setPixelRatio(ratio: number) {}
  setClearColor(color: any, alpha?: number) {}
  render(scene: Scene, camera: Camera) {}
  dispose() {}
  getContext() {
    return {};
  }
}

// Clock
export class Clock {
  autoStart = true;
  startTime = 0;
  oldTime = 0;
  elapsedTime = 0;
  running = false;

  start() {}
  stop() {}
  getElapsedTime() {
    return 0;
  }
  getDelta() {
    return 0.016;
  }
}

// Constants
export const DoubleSide = 2;
export const FrontSide = 0;
export const BackSide = 1;
export const DynamicDrawUsage = 35048;
export const StaticDrawUsage = 35044;

// Texture
export class Texture {
  uuid = `tex-${++objectIdCounter}`;
  image: any = null;
  needsUpdate = false;

  dispose() {}
}

export class DataTexture extends Texture {}
export class CanvasTexture extends Texture {}

// Loaders
export class Loader {
  load(url: string, onLoad?: any, onProgress?: any, onError?: any) {}
}

export class TextureLoader extends Loader {}
export class FileLoader extends Loader {}

// LineSegments
export class LineSegments extends Object3D {
  geometry: BufferGeometry;
  material: any;
  type = 'LineSegments';

  constructor(geometry?: BufferGeometry, material?: any) {
    super();
    this.geometry = geometry || new BufferGeometry();
    this.material = material;
  }
}

// Line
export class Line extends Object3D {
  geometry: BufferGeometry;
  material: any;
  type = 'Line';

  constructor(geometry?: BufferGeometry, material?: any) {
    super();
    this.geometry = geometry || new BufferGeometry();
    this.material = material;
  }
}

// EdgesGeometry
export class EdgesGeometry extends BufferGeometry {}

// ShaderMaterial additional properties
export class RawShaderMaterial extends Material {
  uniforms: Record<string, any> = {};
  vertexShader = '';
  fragmentShader = '';
}

// Export everything as default as well
const THREE = {
  Vector2,
  Vector3,
  Vector4,
  Euler,
  Matrix4,
  Quaternion,
  Color,
  Triangle,
  Box3,
  Object3D,
  Group,
  Mesh,
  Scene,
  Camera,
  PerspectiveCamera,
  OrthographicCamera,
  Light,
  AmbientLight,
  DirectionalLight,
  PointLight,
  BufferGeometry,
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  IcosahedronGeometry,
  Material,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  LineBasicMaterial,
  ShaderMaterial,
  BufferAttribute,
  Float32BufferAttribute,
  Raycaster,
  WebGLRenderer,
  Clock,
  Texture,
  DataTexture,
  CanvasTexture,
  Loader,
  TextureLoader,
  FileLoader,
  DoubleSide,
  FrontSide,
  BackSide,
  DynamicDrawUsage,
  StaticDrawUsage,
  LineSegments,
  Line,
  EdgesGeometry,
  RawShaderMaterial,
};

export default THREE;
