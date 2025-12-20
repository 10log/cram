import * as THREE from 'three';
import Container, { ContainerProps } from '../objects/container';
import PointShader from "./shaders/points";

export interface MarkupProps extends ContainerProps{
  maxlines: number;
  pointScale: number;
  maxpoints: number;
}

// Buffer capacity for beam-trace visualization at different reflection orders:
// Order 3: ~8,000 lines, Order 4: ~28,000, Order 5: ~56,000, Order 6: ~112,000
// Using 5e5 (500,000) vertices = 250,000 line segments for comfortable order 6+ support
// Points buffer reduced since beam visualization is line-heavy
// Memory usage: 2 buffers × 500,000 × 3 × 4 + 2 buffers × 50,000 × 3 × 4 = ~13.2 MB
export const defaultMarkupProps = {
  maxlines: 5e5,
  maxpoints: 5e4,
  pointScale: 7
}

export interface MarkupUsageStats {
  linesUsed: number;
  linesCapacity: number;
  linesPercent: number;
  pointsUsed: number;
  pointsCapacity: number;
  pointsPercent: number;
  overflowWarning: boolean;
}
export class Markup extends Container{
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

  // Overflow tracking
  private linesOverflowed: boolean = false;
  private pointsOverflowed: boolean = false;
  private overflowWarningLogged: boolean = false;
  constructor(props?: MarkupProps) {
    super("markup", props);
    
    this.maxlines = (props && props.maxlines) || defaultMarkupProps.maxlines;
    this.maxpoints = (props && props.maxpoints) || defaultMarkupProps.maxpoints;
    this.pointScale = (props && props.pointScale) || defaultMarkupProps.pointScale;
    
    this.linePositionIndex = 0;
    this.pointsPositionIndex = 0;
    
    this.linesBufferGeometry = new THREE.BufferGeometry();
    this.pointsBufferGeometry = new THREE.BufferGeometry();
    
    this.linesBufferGeometry.name = "markup-linesBufferGeometry";
    this.pointsBufferGeometry.name = "markup-pointsBufferGeometry";
    
    // Buffer size = maxlines * 3 floats per vertex (x, y, z)
    // Each line segment needs 2 vertices, so maxlines vertices = maxlines/2 line segments
    this.linesBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxlines * 3), 3);
    this.pointsBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxpoints * 3), 3);
    
    this.linesBufferAttribute.setUsage(THREE.DynamicDrawUsage);
    this.pointsBufferAttribute.setUsage(THREE.DynamicDrawUsage);
    
    this.linesBufferGeometry.setAttribute("position", this.linesBufferAttribute);
    this.pointsBufferGeometry.setAttribute("position", this.pointsBufferAttribute);
    
    this.linesBufferGeometry.setDrawRange(0, this.maxlines);
    this.pointsBufferGeometry.setDrawRange(0, this.maxpoints);
    
    this.colorBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxpoints * 3), 3);
    this.colorBufferAttribute.setUsage(THREE.DynamicDrawUsage);

    this.lineColorBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(this.maxlines * 3), 3);
    this.lineColorBufferAttribute.setUsage(THREE.DynamicDrawUsage);
    
    this.linesBufferGeometry.setAttribute("color", this.lineColorBufferAttribute);
    this.pointsBufferGeometry.setAttribute("color", this.colorBufferAttribute);
    
    this.lines = new THREE.LineSegments(
      this.linesBufferGeometry,
      new THREE.LineBasicMaterial({
        fog: false,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        premultipliedAlpha: true,
        blending: THREE.NormalBlending,
        depthFunc: THREE.AlwaysDepth,
        name: "markup-material",
        linewidth: 2
        // depthTest: false
      })
    );
    this.lines.renderOrder = -0.5;
    this.lines.frustumCulled = false;
    this.add(this.lines);
    
    
    this.points = new THREE.Points(
      this.pointsBufferGeometry,
      new THREE.ShaderMaterial({
      fog: false,
      vertexShader: PointShader.vs,
      fragmentShader: PointShader.fs,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        pointScale: { value: this.pointScale }
      },
      blending: THREE.NormalBlending,
      name: "markup-points-material"
    }));
    this.points.frustumCulled = false;
    this.add(this.points);
    
    this.boxes = new Container("boxes");
    this.add(this.boxes);
    
  }
  addLine(p1: [number, number, number], p2: [number, number, number], c1: [number, number, number] = [0.16, 0.16, 0.16], c2: [number, number, number] = [0.16,0.16,0.16]): boolean {
    // Check for buffer overflow (need 2 vertices per line segment)
    if (this.linePositionIndex + 2 > this.maxlines) {
      if (!this.linesOverflowed) {
        this.linesOverflowed = true;
        if (!this.overflowWarningLogged) {
          console.warn(`Markup: Line buffer overflow! Capacity: ${this.maxlines} vertices (${this.maxlines / 2} line segments). Consider reducing reflection order.`);
          this.overflowWarningLogged = true;
        }
      }
      return false;
    }

    // set p1
    this.linesBufferAttribute.setXYZ(this.linePositionIndex++, p1[0], p1[1], p1[2]);

    // set the color
    this.lineColorBufferAttribute.setXYZ(this.linePositionIndex, ...c1);

    // set p2
    this.linesBufferAttribute.setXYZ(this.linePositionIndex++, p2[0], p2[1], p2[2]);

    // set the color
    this.lineColorBufferAttribute.setXYZ(this.linePositionIndex, ...c2);

    //update the draw range
    this.linesBufferGeometry.setDrawRange(0, this.linePositionIndex);

    // update three.js
    this.linesBufferAttribute.needsUpdate = true;

    //update version
    this.linesBufferAttribute.version++;

    // update three.js
    this.lineColorBufferAttribute.needsUpdate = true;

    //update version
    this.lineColorBufferAttribute.version++;

    return true;
  }
  addPoint(p1: [number, number, number], color: [number, number, number]): boolean {
    // Check for buffer overflow
    if (this.pointsPositionIndex + 1 > this.maxpoints) {
      if (!this.pointsOverflowed) {
        this.pointsOverflowed = true;
        if (!this.overflowWarningLogged) {
          console.warn(`Markup: Points buffer overflow! Capacity: ${this.maxpoints} points. Consider reducing reflection order.`);
          this.overflowWarningLogged = true;
        }
      }
      return false;
    }

    // set p1
    this.pointsBufferAttribute.setXYZ(this.pointsPositionIndex++, p1[0], p1[1], p1[2]);

    // set the color
    this.colorBufferAttribute.setXYZ(this.pointsPositionIndex, color[0], color[1], color[2]);

    //update the draw range
    this.pointsBufferGeometry.setDrawRange(0, this.pointsPositionIndex);

    // update three.js
    this.pointsBufferAttribute.needsUpdate = true;

    //update version
    this.pointsBufferAttribute.version++;

    // update three.js
    this.colorBufferAttribute.needsUpdate = true;

    //update version
    this.colorBufferAttribute.version++;

    return true;
  }
  clearPoints(){
    this.pointsBufferGeometry.dispose();
    this.pointsBufferAttribute.needsUpdate = true;
    this.colorBufferAttribute.needsUpdate = true;
    this.pointsPositionIndex = 0;
    this.pointsBufferGeometry.setDrawRange(0,this.pointsPositionIndex);
    this.pointsOverflowed = false;
  }
  clearLines(){
    this.linesBufferGeometry.dispose();
    this.linesBufferAttribute.needsUpdate = true;
    this.lineColorBufferAttribute.needsUpdate = true;
    this.linePositionIndex = 0;
    this.linesBufferGeometry.setDrawRange(0,this.linePositionIndex);
    this.linesOverflowed = false;
    this.overflowWarningLogged = false;
  }

  /** Get current buffer usage statistics */
  getUsageStats(): MarkupUsageStats {
    const linesPercent = (this.linePositionIndex / this.maxlines) * 100;
    const pointsPercent = (this.pointsPositionIndex / this.maxpoints) * 100;
    return {
      linesUsed: this.linePositionIndex,
      linesCapacity: this.maxlines,
      linesPercent,
      pointsUsed: this.pointsPositionIndex,
      pointsCapacity: this.maxpoints,
      pointsPercent,
      overflowWarning: this.linesOverflowed || this.pointsOverflowed
    };
  }

  /** Check if any buffer has overflowed */
  hasOverflow(): boolean {
    return this.linesOverflowed || this.pointsOverflowed;
  }
  addBox(min: [number, number, number], max: [number, number, number], color: [number, number, number]=[Math.random(), Math.random(), Math.random()]) {
    // const box = new THREE.Box3(new THREE.Vector3().fromArray(min), new THREE.Vector3().fromArray(max));
    const length = Math.abs(max[0] - min[0]);
    const width = Math.abs(max[1] - min[1]);
    const height = Math.abs(max[2] - min[2]);
    const geom = new THREE.BoxGeometry(length, width, height);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color[0], color[1], color[2]),
      transparent: true,
      opacity: 0.2
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.translateX(length / 2 + min[0]);
    mesh.translateY(width / 2 + min[1]);
    mesh.translateZ(height / 2 + min[2]);
    this.boxes.add(mesh);
    return mesh;
  }
}