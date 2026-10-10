// Type declarations for modules without types

declare module 'three.meshline' {
  import * as THREE from 'three';

  export class MeshLine extends THREE.BufferGeometry {
    setGeometry(geometry: THREE.BufferGeometry | Float32Array | THREE.Vector3[]): void;

    /**
     * Flat [x,y,z, x,y,z, ...] vertex positions.
     *
     * three.meshline also accepts a THREE.Vector3[] at runtime, deliberately not
     * declared. It is guarded by `points[0] instanceof THREE.Vector3`, and the THREE
     * that guard closes over is whatever the library's require('three') returns. Up to
     * three r185 that was the separate CommonJS build, so the check always failed and
     * the array fell through to the flat-number branch — silently producing NaN
     * positions instead of a line:
     *
     *   setPoints([Vector3(0,0,0), Vector3(1,0,0), Vector3(1,1,0)])
     *     -> position.count 2, array [null,null,null,null,null,null]
     *
     * r186 made build/three.cjs re-export the ES module, so the Vector3 path works
     * today, but three says that CommonJS entry will be removed. Passing a Float32Array
     * avoids the guard entirely and is correct either way.
     * See src/compute/__tests__/three-meshline.spec.ts.
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
