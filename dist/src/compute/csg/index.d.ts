import { connectors, geometry, math, primitives, text, booleans, expansions, extrusions, hulls, measurements, transforms, utils, Tree, PolygonTreeNode, Node, splitPolygonByPlane } from '../modeling';
declare const color: {
    color: (colorVal: number[] | string, ...objects: any[]) => any;
    cssColors: {
        black: number[];
        silver: number[];
        gray: number[];
        white: number[];
        maroon: number[];
        red: number[];
        purple: number[];
        fuchsia: number[];
        green: number[];
        lime: number[];
        olive: number[];
        yellow: number[];
        navy: number[];
        blue: number[];
        teal: number[];
        aqua: number[];
    };
    colorize: any;
    colorNameToRgb: any;
    hexToRgb: any;
    hslToRgb: any;
    hsvToRgb: any;
    rgbToHex: any;
    rgbToHsl: any;
    rgbToHsv: any;
};
declare const splitLineByPlane: (planeVal: number[], p1: number[], p2: number[]) => number[];
export { connectors, geometry, math, primitives, text, booleans, expansions, extrusions, hulls, measurements, transforms, color, utils, splitLineByPlane, splitPolygonByPlane, Tree, PolygonTreeNode, Node };
declare const _default: {
    connectors: {
        Connector: {
            new (point: number[], axisvector: number[], normalvector: number[]): {
                point: number[];
                axisvector: number[];
                normalvector: number[];
                normalized(): /*elided*/ any;
                transform(matrix: any): /*elided*/ any;
            };
        };
        create: (point: number[], axisvector: number[], normalvector: number[]) => {
            point: number[];
            axisvector: number[];
            normalvector: number[];
            normalized(): /*elided*/ any;
            transform(matrix: any): /*elided*/ any;
        };
    };
    geometry: {
        geom2: any;
        geom3: any;
        path2: any;
        poly3: any;
    };
    math: {
        vec2: any;
        vec3: any;
        mat4: any;
        plane: any;
        line2: any;
        line3: any;
        constants: any;
    };
    primitives: {
        cube: (options?: {
            size?: number | number[];
            center?: number[];
        }) => any;
        cuboid: any;
        sphere: (options?: {
            radius?: number;
            r?: number;
            center?: number[];
            resolution?: number;
            segments?: number;
        }) => any;
        cylinder: (options?: {
            radius?: number;
            r?: number;
            r1?: number;
            r2?: number;
            height?: number;
            h?: number;
            center?: number[];
            resolution?: number;
            segments?: number;
        }) => any;
        torus: (options?: {
            innerRadius?: number;
            ri?: number;
            outerRadius?: number;
            ro?: number;
            innerResolution?: number;
            innerSegments?: number;
            outerResolution?: number;
            outerSegments?: number;
        }) => any;
        polyhedron: (options?: {
            points?: number[][];
            faces?: number[][];
            triangles?: number[][];
        }) => any;
        rectangle: (options?: {
            size?: number[];
            center?: number[];
        }) => any;
        square: (options?: {
            size?: number[];
            center?: number[];
        }) => any;
        circle: (options?: {
            radius?: number;
            r?: number;
            center?: number[];
            resolution?: number;
            segments?: number;
        }) => any;
        ellipse: any;
        polygon: (options?: {
            points?: number[][];
        }) => any;
        arc: any;
        ellipsoid: any;
        geodesicSphere: any;
        roundedCuboid: any;
        roundedCylinder: any;
        roundedRectangle: any;
        star: any;
        line: any;
    };
    text: {
        vectorText: any;
        vectorChar: any;
    };
    booleans: {
        union: (...objects: any[]) => any;
        subtract: (...objects: any[]) => any;
        intersect: (...objects: any[]) => any;
        difference: (...objects: any[]) => any;
    };
    expansions: {
        expand: (options: {
            delta?: number;
            corners?: string;
            segments?: number;
        }, ...objects: any[]) => any;
        offset: (options: {
            delta?: number;
            corners?: string;
            segments?: number;
        }, ...objects: any[]) => any;
    };
    extrusions: {
        extrudeLinear: (options: {
            height?: number;
            twist?: number;
            slices?: number;
        }, ...objects: any[]) => any;
        extrudeRotate: (options: {
            angle?: number;
            startAngle?: number;
            segments?: number;
        }, ...objects: any[]) => any;
        extrudeRectangular: any;
        extrudeFromSlices: any;
        extrudeHelical: any;
    };
    hulls: {
        hull: (...objects: any[]) => any;
        hullChain: (...objects: any[]) => any;
    };
    measurements: {
        measureArea: any;
        measureBoundingBox: any;
        measureBoundingSphere: any;
        measureCenter: any;
        measureCenterOfMass: any;
        measureDimensions: any;
        measureVolume: any;
        measureAggregateArea: any;
        measureAggregateVolume: any;
        measureAggregateBoundingBox: any;
        measureEpsilon: any;
    };
    transforms: {
        translate: (offset: number[], ...objects: any[]) => any;
        translateX: (offset: number, ...objects: any[]) => any;
        translateY: (offset: number, ...objects: any[]) => any;
        translateZ: (offset: number, ...objects: any[]) => any;
        rotate: (angles: number[], ...objects: any[]) => any;
        rotateX: (angle: number, ...objects: any[]) => any;
        rotateY: (angle: number, ...objects: any[]) => any;
        rotateZ: (angle: number, ...objects: any[]) => any;
        scale: (factors: number[], ...objects: any[]) => any;
        scaleX: (factor: number, ...objects: any[]) => any;
        scaleY: (factor: number, ...objects: any[]) => any;
        scaleZ: (factor: number, ...objects: any[]) => any;
        mirror: (options: {
            origin?: number[];
            normal?: number[];
        }, ...objects: any[]) => any;
        mirrorX: (...objects: any[]) => any;
        mirrorY: (...objects: any[]) => any;
        mirrorZ: (...objects: any[]) => any;
        center: (options?: {
            axes?: boolean[];
        }, ...objects: any[]) => any;
        centerX: (...objects: any[]) => any;
        centerY: (...objects: any[]) => any;
        centerZ: (...objects: any[]) => any;
        transform: (matrix: any, ...objects: any[]) => any;
        align: any;
    };
    color: {
        color: (colorVal: number[] | string, ...objects: any[]) => any;
        cssColors: {
            black: number[];
            silver: number[];
            gray: number[];
            white: number[];
            maroon: number[];
            red: number[];
            purple: number[];
            fuchsia: number[];
            green: number[];
            lime: number[];
            olive: number[];
            yellow: number[];
            navy: number[];
            blue: number[];
            teal: number[];
            aqua: number[];
        };
        colorize: any;
        colorNameToRgb: any;
        hexToRgb: any;
        hslToRgb: any;
        hsvToRgb: any;
        rgbToHex: any;
        rgbToHsl: any;
        rgbToHsv: any;
    };
    utils: {
        flatten: (arr: any[]) => any[];
        degToRad: any;
        radToDeg: any;
    };
    splitLineByPlane: (planeVal: number[], p1: number[], p2: number[]) => number[];
    splitPolygonByPlane: (splane: number[], polygon: any) => {
        type: number;
        front: any;
        back: any;
    };
    Tree: typeof Tree;
    PolygonTreeNode: typeof PolygonTreeNode;
    Node: typeof Node;
};
export default _default;
