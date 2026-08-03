import { Surface } from '../../objects/surface';
import { Tree } from './trees/tree';
export declare class BSP {
    tree: Tree;
    constructor();
    construct(surfaces: Surface[]): void;
    getPointDistances(p1: {
        plane: {
            signedDistanceToPoint: (pos: unknown) => number;
        };
    }, p2: {
        vertices: {
            pos: unknown;
        }[];
    }): {
        distances: number[];
        willIntersect: boolean;
    };
}
