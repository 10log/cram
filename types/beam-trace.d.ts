// Type declarations for beam-trace package 3D functionality

declare module 'beam-trace' {
  // Core types
  export type Point3D = [number, number, number];
  export type Vector3 = Point3D;

  export interface PathPoint3D {
    position: Point3D;
    polygonId: number | null;
  }

  export type ReflectionPath3D = PathPoint3D[];

  export interface BeamVisualizationData {
    reflectionOrder: number;
    virtualSource: Point3D;
    apertureVertices: Point3D[];
    polygonId: number;
  }

  export interface PerformanceMetrics3D {
    validPathCount: number;
    raycastCount: number;
    failPlaneCacheHits: number;
    bucketsSkipped: number;
  }

  export interface OptimizedSolver3DConfig {
    maxReflectionOrder?: number;
  }

  // Polygon3D class
  export class Polygon3D {
    readonly vertices: Point3D[];
    readonly plane: { normal: Point3D; d: number };
    readonly centroid: Point3D;

    static create(vertices: Point3D[]): Polygon3D;
  }

  // Source3D class
  export class Source3D {
    readonly position: Vector3;
    constructor(position: Vector3);
  }

  // Listener3D class
  export class Listener3D {
    position: Vector3;
    constructor(position: Vector3);
    moveTo(position: Vector3): void;
  }

  // Solver3D class
  export class Solver3D {
    readonly source: Source3D;

    constructor(polygons: Polygon3D[], source: Source3D, config?: OptimizedSolver3DConfig);

    getPaths(listener: Listener3D | Vector3): ReflectionPath3D[];
    getMetrics(): PerformanceMetrics3D;
    clearCache(): void;
    getLeafNodeCount(): number;
    getMaxReflectionOrder(): number;
    getBeamsForVisualization(maxOrder?: number): BeamVisualizationData[];
  }

  // Utility functions
  export function computePathLength(path: ReflectionPath3D): number;
  export function computeArrivalTime(path: ReflectionPath3D, speedOfSound?: number): number;
  export function getPathReflectionOrder(path: ReflectionPath3D): number;
  export function createShoeboxRoom(width: number, depth: number, height: number): Polygon3D[];
  export function createRoom(width: number, depth: number, height: number): Polygon3D[];
}
