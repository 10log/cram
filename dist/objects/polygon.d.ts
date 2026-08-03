import { Vector2, Shape } from 'three';
export interface PolygonProps {
    vertices?: number[][];
    close?: boolean;
}
export declare class Polygon {
    vertices: Vector2[];
    close: boolean;
    shape: Shape;
    constructor(props?: PolygonProps);
    private makeShape;
}
export default Polygon;
