/**
 * Per-solver image-source overlay. The global Markup point/line buffers
 * are shared across solvers; this group is owned and cleared locally (#128).
 */
import * as THREE from "three";

export class SolverOverlay {
  readonly group: THREE.Group;
  private points: THREE.Object3D[] = [];
  private lines: THREE.Object3D[] = [];
  private parent: THREE.Object3D | null;

  constructor(parent?: THREE.Object3D | null) {
    this.group = new THREE.Group();
    this.group.name = "image-source-overlay";
    this.parent = parent ?? null;
    this.parent?.add(this.group);
  }

  addPoint(p: [number, number, number], color = 0x000000): void {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p[0], p[1], p[2])]);
    const mesh = new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.12 }));
    this.points.push(mesh);
    this.group.add(mesh);
  }

  addLine(a: [number, number, number], b: [number, number, number], color = 0x292929): void {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a[0], a[1], a[2]),
      new THREE.Vector3(b[0], b[1], b[2]),
    ]);
    const mesh = new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
    this.lines.push(mesh);
    this.group.add(mesh);
  }

  clearPoints(): void {
    this.disposeObjects(this.points);
    this.points = [];
  }

  clearLines(): void {
    this.disposeObjects(this.lines);
    this.lines = [];
  }

  get pointCount(): number {
    return this.points.length;
  }

  get lineCount(): number {
    return this.lines.length;
  }

  dispose(): void {
    this.clearPoints();
    this.clearLines();
    this.parent?.remove(this.group);
    this.parent = null;
  }

  private disposeObjects(objs: THREE.Object3D[]): void {
    for (const obj of objs) {
      this.group.remove(obj);
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    }
  }
}
