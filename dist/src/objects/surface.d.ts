import { VertexNormalsHelper } from '../../../node_modules/@types/three/examples/jsm/helpers/VertexNormalsHelper.js';
import { default as Container, ContainerProps } from './container';
import { AcousticMaterial } from '../db/acoustic-material';
import { BRDF } from '../compute/raytracer/brdf';
import { default as Room } from './room';
import { TessellateModifier } from '../compute/radiance/TessellateModifier';
import * as THREE from "three";
/** Vector3 as an array (i.e. [x,y,z]) */
export type Vector3A = [number, number, number];
/** Triangle as an array (i.e. [p1,p2,p3]) */
export type TriangleA = [Vector3A, Vector3A, Vector3A];
/** Triangle Array */
export type Triangles = number[][][];
export interface SurfaceProps extends ContainerProps {
    acousticMaterial: AcousticMaterial;
    geometry: THREE.BufferGeometry;
    wireframeVisible?: boolean;
    edgesVisible?: boolean;
    fillSurface?: boolean;
    displayVertexNormals?: boolean;
    scatteringCoefficient?: number;
}
export interface BufferGeometrySaveObject {
    metadata?: {
        version: number;
        type: string;
        generator: string;
    };
    uuid?: string;
    type?: string;
    name?: string;
    data?: {
        attributes: Record<string, {
            itemSize: number;
            type: string;
            array: number[];
            normalized: boolean;
        }>;
        boundingSphere?: {
            center: number[];
            radius: number;
        };
    };
}
export interface SurfaceSaveObject {
    kind: string;
    name: string;
    uuid: string;
    position: number[];
    rotation: number[];
    scale: number[];
    acousticMaterial: AcousticMaterial;
    geometry: BufferGeometrySaveObject;
    visible: boolean;
    wireframeVisible: boolean;
    edgesVisible: boolean;
    fillSurface: boolean;
    displayVertexNormals: boolean;
    scatteringCoefficient: number;
}
type poly3type = {
    vertices: any;
    plane: any;
};
declare class Surface extends Container {
    mesh: THREE.Mesh;
    wire: THREE.Mesh;
    edges: THREE.LineSegments;
    center: THREE.Vector3;
    triangles: Triangles;
    fillSurface: boolean;
    vertexNormals: VertexNormalsHelper;
    _triangles: THREE.Triangle[];
    selectedMaterial: THREE.MeshLambertMaterial;
    normalMaterial: THREE.MeshLambertMaterial;
    normalColor: THREE.Color;
    /** tessellation of this surface (used for ART) */
    tessellatedMesh: THREE.Mesh | null;
    numHits: number;
    absorption: number[];
    absorptionFunction: (freq: number) => number;
    reflection: number[];
    reflectionFunction: (freq: number, theta: number) => number;
    _scatteringCoefficient: number;
    scatteringFunction: (f: number) => number;
    _acousticMaterial: AcousticMaterial;
    brdf: BRDF[];
    area: number;
    isPlanar: boolean;
    edgeLoop: THREE.Vector3[];
    polygon: poly3type;
    normal: THREE.Vector3;
    eventDestructors: Array<() => void>;
    constructor(name: string, props?: SurfaceProps);
    destroyEvents(): void;
    init(props: SurfaceProps, fromConstructor?: boolean): void;
    dispose(): void;
    save(): SurfaceSaveObject;
    restore(surfaceState: SurfaceSaveObject): this;
    select(): void;
    deselect(): void;
    hover(): void;
    unhover(): void;
    resetHits(): void;
    getArea(): number;
    getEdges(): THREE.LineSegments<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
    calculateEdgeLoop(): THREE.Vector3[];
    mergeSurfaces(surfaces: Surface[]): Surface;
    tessellate(tessellateModifier: TessellateModifier): THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
    get edgesVisible(): boolean;
    set edgesVisible(visible: boolean);
    get acousticMaterial(): AcousticMaterial;
    set acousticMaterial(material: AcousticMaterial);
    get displayVertexNormals(): boolean;
    set displayVertexNormals(displayVertexNormals: boolean);
    get geometry(): THREE.BufferGeometry;
    get faces(): THREE.Triangle[];
    get wireframeVisible(): boolean;
    set wireframeVisible(visible: boolean);
    get tessellatedMeshVisible(): boolean;
    set tessellatedMeshVisible(visible: boolean);
    get isTessellated(): boolean;
    get room(): Room;
    get brief(): {
        uuid: string;
        name: string;
        selected: boolean;
        kind: string;
        children: never[];
    };
    get scatteringCoefficient(): number;
    set scatteringCoefficient(coef: number);
}
declare function mergeSurfaces(surfaces: Surface[]): Surface;
export { Surface, mergeSurfaces };
declare global {
    interface EventTypes {
        ADD_SURFACE: Surface | undefined;
        SURFACE_SET_PROPERTY: SetPropertyPayload<Surface>;
        REMOVE_SURFACE: string;
        SURFACE_HOVER: string;
        SURFACE_UNHOVER: string;
    }
}
export default Surface;
