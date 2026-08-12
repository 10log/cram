// Type declarations for modules without types

declare module 'complex' {
  export default class Complex {
    real: number;
    imag: number;
    constructor(real?: number, imag?: number);
    static from(obj: { real: number; imag: number }): Complex;
    add(other: Complex): Complex;
    sub(other: Complex): Complex;
    mul(other: Complex): Complex;
    div(other: Complex): Complex;
    abs(): number;
    arg(): number;
    conjugate(): Complex;
  }
}

declare module 'three.meshline' {
  import * as THREE from 'three';

  export class MeshLine extends THREE.BufferGeometry {
    setGeometry(geometry: THREE.BufferGeometry | Float32Array | THREE.Vector3[]): void;

    /**
     * Flat [x,y,z, x,y,z, ...] vertex positions.
     *
     * three.meshline accepts a THREE.Vector3[] at runtime, but that path is unusable
     * here and is deliberately not declared. It is guarded by
     * `points[0] instanceof THREE.Vector3`, and the THREE that guard closes over is the
     * CommonJS build the library pulls in via require(), while CRAM imports the ESM
     * build. three's exports map makes those two different modules with two different
     * Vector3 classes, so the check always fails and the array falls through to the
     * flat-number branch — silently producing NaN positions instead of a line:
     *
     *   setPoints([Vector3(0,0,0), Vector3(1,0,0), Vector3(1,1,0)])
     *     -> position.count 2, array [null,null,null,null,null,null]
     *
     * Passing a Float32Array avoids the guard entirely and is correct.
     */
    setPoints(points: Float32Array): void;
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
