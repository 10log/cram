// Type declarations for modules without types

declare module 'react-splitter-layout-react-v18' {
  import { Component, ReactNode } from 'react';

  export interface SplitterLayoutProps {
    children?: ReactNode;
    customClassName?: string;
    vertical?: boolean;
    percentage?: boolean;
    primaryIndex?: number;
    primaryMinSize?: number;
    secondaryMinSize?: number;
    secondaryInitialSize?: number;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onSecondaryPaneSizeChange?: (size: number) => void;
  }

  export default class SplitterLayout extends Component<SplitterLayoutProps> {}
}

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
