/**
 * Per-solver image-source overlay. The global Markup point/line buffers
 * are shared across solvers; this group is owned and cleared locally (#128).
 */
import * as THREE from "three";
export declare class SolverOverlay {
    readonly group: THREE.Group;
    private points;
    private lines;
    private parent;
    constructor(parent?: THREE.Object3D | null);
    addPoint(p: [number, number, number], color?: number): void;
    addLine(a: [number, number, number], b: [number, number, number], color?: number): void;
    clearPoints(): void;
    clearLines(): void;
    get pointCount(): number;
    get lineCount(): number;
    dispose(): void;
    private disposeObjects;
}
