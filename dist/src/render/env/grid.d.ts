import { default as Container } from '../../objects/container';
import { ModifiedGridHelper } from './modified-grid-helper.js';
import * as THREE from 'three';
export interface GridProps {
    size?: number;
    cellSize?: number;
    majorLinesEvery?: number;
    color1?: number;
    color2?: number;
    fill?: boolean;
}
export default class Grid extends Container {
    gridHelper: ModifiedGridHelper;
    majorGridHelper: ModifiedGridHelper;
    constructor(name?: string, props?: GridProps);
    get mesh(): THREE.Object3D<THREE.Object3DEventMap>;
    /**
     * Update grid line colors and opacity for theme changes
     */
    updateColors(minorColor: number, majorColor: number, minorOpacity: number, majorOpacity: number): void;
}
