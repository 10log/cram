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

  // Detailed reflection information
  export interface ReflectionDetail3D {
    polygon: Polygon3D;
    polygonId: number;
    hitPoint: Vector3;
    incidenceAngle: number;
    reflectionAngle: number;
    incomingDirection: Vector3;
    outgoingDirection: Vector3;
    surfaceNormal: Vector3;
    reflectionOrder: number;
    cumulativeDistance: number;
    incomingSegmentLength: number;
    isGrazing: boolean;
  }

  export interface SegmentDetail3D {
    startPoint: Vector3;
    endPoint: Vector3;
    length: number;
    segmentIndex: number;
  }

  export interface DetailedReflectionPath3D {
    listenerPosition: Vector3;
    sourcePosition: Vector3;
    totalPathLength: number;
    reflectionCount: number;
    reflections: ReflectionDetail3D[];
    segments: SegmentDetail3D[];
    simplePath: ReflectionPath3D;
  }

  export interface BeamVisualizationData {
    reflectionOrder: number;
    virtualSource: Point3D;
    apertureVertices: Point3D[];
    polygonId: number;
    polygonPath: number[];
  }

  export interface PerformanceMetrics3D {
    validPathCount: number;
    raycastCount: number;
    failPlaneCacheHits: number;
    failPlaneCacheMisses: number;
    bucketsSkipped: number;
    bucketsTotal: number;
    bucketsChecked: number;
    totalLeafNodes: number;
    skipSphereCount: number;
  }

  export interface OptimizedSolver3DConfig {
    maxReflectionOrder?: number;
    bucketSize?: number;
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
    getDetailedPaths(listener: Listener3D | Vector3): DetailedReflectionPath3D[];
    getMetrics(): PerformanceMetrics3D;
    clearCache(): void;
    getLeafNodeCount(): number;
    getMaxReflectionOrder(): number;
    getBeamsForVisualization(maxOrder?: number): BeamVisualizationData[];
    debugBeamPath(listener: Listener3D | Vector3, polygonPath: number[]): void;
  }

  // Debug functions
  export function setBSPDebug(enabled: boolean): void;

  // Utility functions
  export function computePathLength(path: ReflectionPath3D): number;
  export function computeArrivalTime(path: ReflectionPath3D, speedOfSound?: number): number;
  export function getPathReflectionOrder(path: ReflectionPath3D): number;
  export function createShoeboxRoom(width: number, depth: number, height: number): Polygon3D[];
  export function createRoom(width: number, depth: number, height: number): Polygon3D[];
}
