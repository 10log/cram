// Type declarations for modules without types

declare module 'three.meshline' {
  import * as THREE from 'three';

  export class MeshLine extends THREE.BufferGeometry {
    setGeometry(geometry: THREE.BufferGeometry | Float32Array | THREE.Vector3[]): void;
    setPoints(points: Float32Array | THREE.Vector3[]): void;
  }

  export class MeshLineMaterial extends THREE.ShaderMaterial {
    constructor(parameters?: {
      color?: THREE.Color | string | number;
      opacity?: number;
      resolution?: THREE.Vector2;
      sizeAttenuation?: number;
      lineWidth?: number;
      near?: number;
      far?: number;
      depthWrite?: boolean;
      depthTest?: boolean;
      transparent?: boolean;
      dashArray?: number;
      dashOffset?: number;
      dashRatio?: number;
    });
  }
}
