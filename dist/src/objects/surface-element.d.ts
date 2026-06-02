import { Float32BufferAttribute } from 'three';
export declare class SurfaceElement {
    bufferAttribute: Float32BufferAttribute;
    a: number;
    b: number;
    c: number;
    /**
     * @param bufferAttribute the buffer attribute which holds the positions
     * @param a index of the first point
     * @param b index of the second point
     * @param c index of the third point
     */
    constructor(bufferAttribute: Float32BufferAttribute, a: number, b: number, c: number);
}
export default SurfaceElement;
