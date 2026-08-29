import { BeamVisualizationData, Solver3D } from 'beam-trace';
import { default as Receiver } from '../../objects/receiver';
import { renderer } from '../../render/renderer';
import { BeamTracePath, VisualizationMode } from './paths';
import * as THREE from "three";
export declare function getOrderColor(order: number, maxOrder: number): number;
export declare function createHighlightLine(): THREE.Mesh;
export declare function disposeObject3D(child: THREE.Object3D): void;
export declare function clearGroup(group: THREE.Group): void;
export declare function clearVisualization(virtualSourcesGroup: THREE.Group): void;
export declare function beamHasValidPath(beam: BeamVisualizationData, paths: BeamTracePath[]): boolean;
export declare function drawPaths(params: {
    validPaths: BeamTracePath[];
    visibleOrders: number[];
    maxReflectionOrder: number;
    virtualSourcesGroup: THREE.Group;
    lastMetrics: {
        bufferUsage?: ReturnType<typeof renderer.markup.getUsageStats>;
    } | null;
}): void;
export interface BeamDrawHost {
    btSolver: Solver3D | null;
    validPaths: BeamTracePath[];
    visibleOrders: number[];
    maxReflectionOrder: number;
    showAllBeams: boolean;
    virtualSourcesGroup: THREE.Group;
    virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & {
        polygonPath: number[];
    }>;
    selectedVirtualSource: THREE.Mesh | null;
}
export declare function drawBeams(host: BeamDrawHost): void;
export declare function highlightVirtualSourcePath(params: {
    beam: BeamVisualizationData & {
        polygonPath: number[];
    };
    validPaths: BeamTracePath[];
    maxReflectionOrder: number;
    receiver: Receiver | undefined;
    selectedPath: THREE.Mesh;
    selectedBeamsGroup: THREE.Group;
}): void;
export declare function highlightPathByIndex(params: {
    pathIndex: number;
    validPaths: BeamTracePath[];
    maxReflectionOrder: number;
    btSolver: Solver3D | null;
    receiver: Receiver | undefined;
    selectedPath: THREE.Mesh;
    selectedBeamsGroup: THREE.Group;
}): void;
export declare function redrawVisualization(params: {
    mode: VisualizationMode;
    validPaths: BeamTracePath[];
    btSolver: Solver3D | null;
    virtualSourcesGroup: THREE.Group;
    drawBeamsFn: () => void;
    drawPathsFn: () => void;
}): void;
export interface ClickHost {
    virtualSourceMap: Map<THREE.Mesh, BeamVisualizationData & {
        polygonPath: number[];
    }>;
    selectedVirtualSource: THREE.Mesh | null;
    clickHandler: ((event: MouseEvent) => void) | null;
    hoverHandler: ((event: MouseEvent) => void) | null;
    onSelectBeam: (beam: BeamVisualizationData & {
        polygonPath: number[];
    }) => void;
    onDeselect: () => void;
}
export declare function removeClickHandler(host: ClickHost): void;
export declare function setupClickHandler(host: ClickHost): void;
