import { EdgeGraph } from './types';
interface SurfaceLike {
    uuid: string;
    edgeLoop: {
        x: number;
        y: number;
        z: number;
    }[];
    normal: {
        x: number;
        y: number;
        z: number;
    };
}
/**
 * Build the edge graph from room surfaces.
 *
 * @param surfaces - Array of surfaces with edgeLoop and normal properties
 * @param tolerance - Vertex matching tolerance in world units
 * @returns EdgeGraph containing only convex diffracting edges
 */
export declare function buildEdgeGraph(surfaces: SurfaceLike[], tolerance?: number): EdgeGraph;
export {};
