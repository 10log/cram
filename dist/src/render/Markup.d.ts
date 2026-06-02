import { default as Container, ContainerProps } from '../objects/container';
import * as THREE from 'three';
export interface MarkupProps extends ContainerProps {
    maxlines: number;
    pointScale: number;
    maxpoints: number;
}
export declare const defaultMarkupProps: {
    maxlines: number;
    maxpoints: number;
    pointScale: number;
};
export interface MarkupUsageStats {
    linesUsed: number;
    linesCapacity: number;
    linesPercent: number;
    pointsUsed: number;
    pointsCapacity: number;
    pointsPercent: number;
    overflowWarning: boolean;
}
export declare class Markup extends Container {
    linesBufferGeometry: THREE.BufferGeometry;
    pointsBufferGeometry: THREE.BufferGeometry;
    maxlines: number;
    maxpoints: number;
    linesBufferAttribute: THREE.Float32BufferAttribute;
    pointsBufferAttribute: THREE.Float32BufferAttribute;
    lines: THREE.LineSegments;
    points: THREE.Points;
    colorBufferAttribute: THREE.Float32BufferAttribute;
    lineColorBufferAttribute: THREE.Float32BufferAttribute;
    linePositionIndex: number;
    pointsPositionIndex: number;
    pointScale: number;
    boxes: Container;
    private linesOverflowed;
    private pointsOverflowed;
    private overflowWarningLogged;
    constructor(props?: MarkupProps);
    addLine(p1: [number, number, number], p2: [number, number, number], c1?: [number, number, number], c2?: [number, number, number]): boolean;
    addPoint(p1: [number, number, number], color: [number, number, number]): boolean;
    clearPoints(): void;
    clearLines(): void;
    /** Get current buffer usage statistics */
    getUsageStats(): MarkupUsageStats;
    /** Check if any buffer has overflowed */
    hasOverflow(): boolean;
    addBox(min: [number, number, number], max: [number, number, number], color?: [number, number, number]): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
}
