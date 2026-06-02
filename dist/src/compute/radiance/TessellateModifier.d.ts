import { BufferGeometry } from 'three';
/**
 * Break faces with edges longer than maxEdgeLength
 */
export declare class TessellateModifier {
    maxEdgeLength: number;
    maxIterations: number;
    constructor(maxEdgeLength?: number, maxIterations?: number);
    modify(geometry: BufferGeometry): BufferGeometry<import('three').NormalBufferAttributes, import('three').BufferGeometryEventMap>;
}
export default TessellateModifier;
