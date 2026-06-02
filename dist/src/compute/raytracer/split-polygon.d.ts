/**
 * Polygon splitting utilities for raytracing
 * Updated to use @jscad/modeling v2 instead of @jscad/csg
 */
export declare const splitLineSegmentByPlane: (splane: number[], p1: number[], p2: number[]) => number[];
export declare const SPLIT_POLYGON_RESULT_TYPE: {
    readonly COPLANAR_FRONT: "COPLANAR_FRONT";
    readonly COPLANAR_BACK: "COPLANAR_BACK";
    readonly FRONT: "FRONT";
    readonly BACK: "BACK";
    readonly SPANNING: "SPANNING";
    readonly NULL: "NULL";
};
/**
 * Split a polygon by a plane
 * @param splane split plane [nx, ny, nz, w]
 * @param polygon polygon to split (V2 format with vertices array)
 */
export declare const splitPolygonByPlane: (splane: number[], polygon: any) => {
    type: keyof typeof SPLIT_POLYGON_RESULT_TYPE;
    front: any;
    back: any;
};
