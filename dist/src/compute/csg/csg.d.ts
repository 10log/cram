export declare const math: {
    constants: {
        EPS: number;
        spatialResolution: number;
    };
    line2: {
        clone: (...params: any[]) => any;
        closestPoint: (point: any, line: any) => Float32Array<ArrayBuffer>;
        create: () => Float32Array<ArrayBuffer>;
        direction: (line: any) => any;
        distanceToPoint: (point: any, line: any) => number;
        equals: (line1: any, line2: any) => boolean;
        fromPoints: (p1: any, p2: any) => Float32Array<ArrayBuffer>;
        fromValues: (x: any, y: any, w: any) => Float32Array<ArrayBuffer>;
        intersectPointOfLines: (line1: any, line2: any) => any;
        origin: (line: any) => any;
        reverse: (...params: any[]) => any;
        toString: (line: any) => string;
        transform: (...params: any[]) => any;
        xAtY: (y: any, line: any) => number;
    };
    line3: {
        clone: (...params: any[]) => any;
        closestPoint: (point: any, line: any) => any;
        create: () => any[];
        direction: (line: any) => any;
        distanceToPoint: (point: any, line: any) => number;
        equals: (line1: any, line2: any) => boolean;
        fromPlanes: (plane1: any, plane2: any) => any[];
        fromPointAndDirection: (point: any, direction: any) => any[];
        fromPoints: (p1: any, p2: any) => any[];
        intersectPointOfLineAndPlane: (plane: any, line: any) => any;
        origin: (line: any) => any;
        reverse: (...params: any[]) => any;
        toString: (line: any) => string;
        transform: (...params: any[]) => any;
    };
    mat4: {
        add: (...params: any[]) => any;
        clone: (...params: any[]) => any;
        create: () => Float32Array<ArrayBuffer>;
        equals: (a: any, b: any) => boolean;
        fromRotation: (...params: any[]) => any;
        fromScaling: (...params: any[]) => any;
        fromTaitBryanRotation: (yaw: any, pitch: any, roll: any) => any;
        fromTranslation: (...params: any[]) => any;
        fromValues: (m00: any, m01: any, m02: any, m03: any, m10: any, m11: any, m12: any, m13: any, m20: any, m21: any, m22: any, m23: any, m30: any, m31: any, m32: any, m33: any) => Float32Array<ArrayBuffer>;
        fromXRotation: (...params: any[]) => any;
        fromYRotation: (...params: any[]) => any;
        fromZRotation: (...params: any[]) => any;
        identity: (...params: any[]) => any;
        isMirroring: (mat: any) => boolean;
        mirror: (...params: any[]) => any;
        mirrorByPlane: (...params: any[]) => any;
        multiply: (...params: any[]) => any;
        rightMultiplyVec2: (vector: any, matrix: any) => Float32Array<ArrayBuffer>;
        rightMultiplyVec3: (vector: any, matrix: any) => Float32Array<ArrayBuffer>;
        rotate: (...params: any[]) => any;
        rotateX: (...params: any[]) => any;
        rotateY: (...params: any[]) => any;
        rotateZ: (...params: any[]) => any;
        scale: (...params: any[]) => any;
        subtract: (...params: any[]) => any;
        toString: (mat: any) => string;
        translate: (...params: any[]) => any;
    };
    plane: {
        clone: (...params: any[]) => any;
        create: () => Float32Array<ArrayBuffer>;
        equals: (a: any, b: any) => boolean;
        flip: (...params: any[]) => any;
        fromNormalAndPoint: (normal: any, point: any) => Float32Array<ArrayBuffer>;
        fromValues: (x: any, y: any, z: any, w: any) => Float32Array<ArrayBuffer>;
        fromPoints: (a: any, b: any, c: any) => Float32Array<ArrayBuffer>;
        fromPointsRandom: (a: any, b: any, c: any) => Float32Array<ArrayBuffer>;
        signedDistanceToPoint: (plane: any, vector: any) => number;
        splitLineSegmentByPlane: (plane: any, p1: any, p2: any) => any;
        toString: (vec: any) => string;
        transform: (matrix: any, plane: any) => Float32Array<ArrayBuffer>;
    };
    utils: {
        area: (points: any) => number;
        clamp: (value: any, min: any, max: any) => number;
        degToRad: (degrees: any) => number;
        intersect: (p1: any, p2: any, p3: any, p4: any) => any[] | undefined;
        radToDeg: (radians: any) => number;
        solve2Linear: (a: any, b: any, c: any, d: any, u: any, v: any) => number[];
    };
    vec2: {
        abs: (...params: any[]) => any;
        add: (...params: any[]) => any;
        angle: (vector: any) => number;
        angleDegrees: (vector: any) => number;
        angleRadians: (vector: any) => number;
        canonicalize: (vector: any) => Float32Array<ArrayBuffer>;
        clone: (...params: any[]) => any;
        create: () => Float32Array<ArrayBuffer>;
        cross: (...params: any[]) => any;
        distance: (a: any, b: any) => number;
        divide: (...params: any[]) => any;
        dot: (a: any, b: any) => number;
        equals: (a: any, b: any) => boolean;
        fromAngle: (radians: any) => Float32Array<ArrayBuffer>;
        fromAngleDegrees: (degrees: any) => Float32Array<ArrayBuffer>;
        fromAngleRadians: (radians: any) => Float32Array<ArrayBuffer>;
        fromArray: (data: any) => Float32Array<ArrayBuffer>;
        fromScalar: (scalar: any) => Float32Array<ArrayBuffer>;
        fromValues: (x: any, y: any) => Float32Array<ArrayBuffer>;
        length: (a: any) => number;
        lerp: (...params: any[]) => any;
        max: (...params: any[]) => any;
        min: (...params: any[]) => any;
        multiply: (...params: any[]) => any;
        negate: (...params: any[]) => any;
        normal: (...params: any[]) => any;
        normalize: (...params: any[]) => any;
        rotate: (...params: any[]) => any;
        scale: (...params: any[]) => any;
        squaredDistance: (a: any, b: any) => number;
        squaredLength: (a: any) => number;
        subtract: (...params: any[]) => any;
        toString: (vec: any) => string;
        transform: (...params: any[]) => any;
    };
    vec3: {
        abs: (...params: any[]) => any;
        add: (...params: any[]) => any;
        angle: (a: any, b: any) => number;
        canonicalize: (vector: any) => Float32Array<ArrayBuffer>;
        clone: (...params: any[]) => any;
        create: () => Float32Array<ArrayBuffer>;
        cross: (...params: any[]) => any;
        distance: (a: any, b: any) => number;
        divide: (...params: any[]) => any;
        dot: (a: any, b: any) => number;
        equals: (a: any, b: any) => boolean;
        fromArray: (data: any) => Float32Array<ArrayBuffer>;
        fromScalar: (scalar: any) => Float32Array<ArrayBuffer>;
        fromValues: (x: any, y: any, z: any) => Float32Array<ArrayBuffer>;
        fromVec2: (vec2: any, z?: number) => Float32Array<ArrayBuffer>;
        length: (a: any) => number;
        lerp: (...params: any[]) => any;
        max: (...params: any[]) => any;
        min: (...params: any[]) => any;
        multiply: (...params: any[]) => any;
        negate: (...params: any[]) => any;
        normalize: (...params: any[]) => any;
        random: (...params: any[]) => any;
        rotateX: (...params: any[]) => any;
        rotateY: (...params: any[]) => any;
        rotateZ: (...params: any[]) => any;
        scale: (...params: any[]) => any;
        squaredDistance: (a: any, b: any) => number;
        squaredLength: (a: any) => number;
        subtract: (...params: any[]) => any;
        toString: (vec: any) => string;
        transform: (...params: any[]) => any;
        unit: (...params: any[]) => any;
    };
    vec4: {
        clone: (...params: any[]) => any;
        create: () => Float32Array<ArrayBuffer>;
        fromScalar: (scalar: any) => Float32Array<ArrayBuffer>;
        fromValues: (x: any, y: any, z: any, w: any) => Float32Array<ArrayBuffer>;
        toString: (vec: any) => string;
        transform: (...params: any[]) => any;
    };
};
export declare const connectors: {
    create: () => {
        point: Float32Array<ArrayBuffer>;
        axis: any;
        normal: any;
    };
    fromPointAxisNormal: (point: any, axis: any, normal: any) => {
        point: Float32Array<ArrayBuffer>;
        axis: any;
        normal: any;
    };
    toString: (connector: any) => string;
    transform: (matrix: any, connector: any) => {
        point: Float32Array<ArrayBuffer>;
        axis: any;
        normal: any;
    };
    transformationBetween: (options: any, from: any, to: any) => any;
};
export declare const geometry: {
    geom2: {
        clone: (geometry: any) => {
            sides: any;
            transforms: any;
        };
        create: (sides: any) => {
            sides: any;
            transforms: any;
        };
        fromPoints: (points: any) => {
            sides: any;
            transforms: any;
        };
        isA: (object: any) => boolean;
        reverse: (geometry: any) => {
            sides: any;
            transforms: any;
        };
        toOutlines: (geometry: any) => any[][];
        toPoints: (geometry: any) => any;
        toSides: (geometry: any) => any;
        toString: (geometry: any) => string;
        transform: (matrix: any, geometry: any) => {
            sides: any;
            transforms: any;
        };
    };
    geom3: {
        clone: (geometry: any) => {
            polygons: any;
            isRetesselated: boolean;
            transforms: Float32Array<ArrayBuffer>;
        };
        create: (polygons: any) => {
            polygons: any;
            isRetesselated: boolean;
            transforms: Float32Array<ArrayBuffer>;
        };
        fromPoints: (listofpoints: any) => {
            polygons: any;
            isRetesselated: boolean;
            transforms: Float32Array<ArrayBuffer>;
        };
        isA: (object: any) => boolean;
        toPoints: (geometry: any) => any;
        toPolygons: (geometry: any) => any;
        toString: (geometry: any) => string;
        transform: (matrix: any, geometry: any) => {
            polygons: any;
            isRetesselated: boolean;
            transforms: Float32Array<ArrayBuffer>;
        };
    };
    path2: {
        appendArc: (options: any, geometry: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        appendBezier: (options: any, geometry: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        appendPoints: (points: any, geometry: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        clone: (geometry: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        close: (geometry: any) => any;
        concat: (...paths: any[]) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        create: (points: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        eachPoint: (options: any, thunk: any, path: any) => void;
        equals: (a: any, b: any) => boolean;
        fromPoints: (options: any, points: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        isA: (object: any) => boolean;
        reverse: (path: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
        toPoints: (geometry: any) => any;
        toString: (geometry: any) => string;
        transform: (matrix: any, geometry: any) => {
            points: any;
            isClosed: boolean;
            transforms: any;
        };
    };
    poly2: {
        arePointsInside: (points: any, polygon: any) => 0 | 1;
        create: (vertices: any) => {
            vertices: any;
        };
        flip: (polygon: any) => {
            vertices: any;
        };
        measureArea: (polygon: any) => number;
    };
    poly3: {
        clone: (...params: any[]) => any;
        /**
        * Represents a convex polygon. The vertices used to initialize a polygon must
        *   be coplanar and form a convex loop. They do not have to be `vec3`
        *   instances but they must behave similarly.
        *
        * Each convex polygon has a `shared` property, which is shared between all
        *   polygons that are clones of each other or were split from the same polygon.
        *   This can be used to define per-polygon properties (such as surface color).
        *
        * The plane of the polygon is calculated from the vertex coordinates if not provided.
        *   The plane can alternatively be passed as the third argument to avoid calculations.
        *
        * @constructor
        * @param {vec3[]} vertices - list of vertices
        * @param {shared} [shared=defaultShared] - shared property to apply
        * @param {plane} [plane] - plane of the polygon
        *
        * @example
        * const vertices = [ [0, 0, 0], [0, 10, 0], [0, 10, 10] ]
        * let observed = poly3.fromPoints(vertices)
        */
        /**
         * Creates a new poly3 (polygon) with initial values
         *
         * @returns {poly3} a new poly3
         */
        create: (vertices: any) => {
            vertices: any;
            plane: Float32Array<ArrayBuffer>;
        };
        flip: (polygon: any) => {
            vertices: any;
            plane: Float32Array<ArrayBuffer>;
        };
        /**
        * Create a polygon from the given points.
        *
        * @param {Array[]} points - list of points
        *
        * @example
        * const points = [
        *   [0,  0, 0],
        *   [0, 10, 0],
        *   [0, 10, 10]
        * ]
        * const polygon = fromPoints(points)
        */
        fromPoints: (points: any, planeof: any) => {
            vertices: any;
            plane: Float32Array<ArrayBuffer>;
        };
        /**
         * @param {Array[]} vertices - list of vertices
         * @param {plane} [plane] - plane of the polygon
         */
        fromPointsAndPlane: (vertices: any, plane: any) => {
            vertices: any;
            plane: any;
        };
        isA: (object: any) => boolean;
        isConvex: (poly3: any) => boolean;
        measureArea: (poly3: any) => number;
        measureBoundingBox: (poly3: any) => any[];
        measureBoundingSphere: (poly3: any) => any[];
        measureSignedVolume: (poly3: any) => number;
        toPoints: (geometry: any) => any;
        toString: (poly3: any) => string;
        transform: (matrix: any, poly3: any) => {
            vertices: any;
            plane: Float32Array<ArrayBuffer>;
        };
    };
};
export declare const primitives: {
    arc: (options: any) => {
        points: any;
        isClosed: boolean;
        transforms: any;
    };
    circle: (options: any) => {
        sides: any;
        transforms: any;
    };
    cube: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    cuboid: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    cylinder: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    cylinderElliptic: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    ellipse: (options: any) => {
        sides: any;
        transforms: any;
    };
    ellipsoid: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    geodesicSphere: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    line: (points: any) => {
        points: any;
        isClosed: boolean;
        transforms: any;
    };
    polygon: (options: any) => {
        sides: any;
        transforms: any;
    };
    polyhedron: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    rectangle: (options: any) => {
        sides: any;
        transforms: any;
    };
    roundedCuboid: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    roundedCylinder: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    roundedRectangle: (options: any) => {
        sides: any;
        transforms: any;
    };
    sphere: (options: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    square: (options: any) => {
        sides: any;
        transforms: any;
    };
    star: (options: any) => {
        sides: any;
        transforms: any;
    };
};
/** Represents a character as segments
* @typedef {Object} VectorCharObject
* @property {Float} width - character width
* @property {Float} height - character height (uppercase)
* @property {Array} segments - character segments [[[x, y], ...], ...]
*/
/** Construct a {@link VectorCharObject} from a ascii character whose code is between 31 and 127,
* if the character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii character
* @param {Float} [options.xOffset=0] - x offset
* @param {Float} [options.yOffset=0] - y offset
* @param {Float} [options.height=21] - font size (uppercase height)
* @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
* @param {String} [options.input='?'] - ascii character (ignored/overwrited if provided as seconds parameter)
* @param {String} [char='?'] - ascii character
* @returns {VectorCharObject}
*
* @example
* let vectorCharObject = vectorChar()
* or
* let vectorCharObject = vectorChar('A')
* or
* let vectorCharObject = vectorChar({ xOffset: 57 }, 'C')
* or
* let vectorCharObject = vectorChar({ xOffset: 78, input: '!' })
*/
declare function vectorChar(options: any, char: any): {
    width: number;
    height: any;
    segments: any[][][];
};
/** Represents a character as segments
* @typedef {Object} VectorCharObject
* @property {Float} width - character width
* @property {Float} height - character height (uppercase)
* @property {Array} segments - character segments [[[x, y], ...], ...]
*/
/** Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
* if one character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii string
* @param {Float} [options.xOffset=0] - x offset
* @param {Float} [options.yOffset=0] - y offset
* @param {Float} [options.height=21] - font size (uppercase height)
* @param {Float} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
* @param {Float} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size
* @param {String} [options.align='left'] - multi-line text alignement: left, center or right
* @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
* @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
* @param {String} [text='?'] - ascii string
* @returns {Array} characters segments [[[x, y], ...], ...]
*
* @example
* let textSegments = vectorText()
* or
* let textSegments = vectorText('OpenJSCAD')
* or
* let textSegments = vectorText({ yOffset: -50 }, 'OpenJSCAD')
* or
* let textSegments = vectorText({ yOffset: -80, input: 'OpenJSCAD' })
*/
declare function vectorText(options: any, text: any): any[];
export declare const text: {
    vectorChar: typeof vectorChar;
    vectorText: typeof vectorText;
};
export declare const booleans: {
    intersect: (...geometries: any[]) => any;
    subtract: (...geometries: any[]) => any;
    union: (...geometries: any[]) => any;
};
export declare const expansions: {
    expand: (options: any, ...objects: any[]) => any;
    offset: (options: any, ...objects: any[]) => any;
};
export declare const extrusions: {
    extrudeFromSlices: (options: any, base: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    extrudeLinear: (options: any, ...objects: any[]) => any;
    extrudeRectangular: (options: any, ...objects: any[]) => any;
    extrudeRotate: (options: any, geometry: any) => {
        polygons: any;
        isRetesselated: boolean;
        transforms: Float32Array<ArrayBuffer>;
    };
    slice: {
        calculatePlane: (slice: any) => Float32Array<ArrayBuffer>;
        clone: (...params: any[]) => any;
        create: (edges: any) => {
            edges: any;
        };
        equals: (a: any, b: any) => any;
        fromPoints: (points: any) => {
            edges: any;
        };
        fromSides: (sides: any) => {
            edges: any;
        };
        isA: (object: any) => boolean;
        reverse: (...params: any[]) => any;
        toEdges: (slice: any) => any;
        toPolygons: (slice: any) => any;
        toString: (slice: any) => string;
        transform: (matrix: any, slice: any) => {
            edges: any;
        };
    };
};
export declare const hulls: {
    hull: (...geometries: any[]) => any;
    hullChain: (...geometries: any[]) => any;
};
export declare const measurements: {
    measureArea: (...geometries: any[]) => any;
    measureBounds: (...geometries: any[]) => any[];
    measureVolume: (...geometries: any[]) => any;
};
export declare const transforms: {
    center: (options: any, ...geometries: any[]) => any;
    centerX: (...objects: any[]) => any;
    centerY: (...objects: any[]) => any;
    centerZ: (...objects: any[]) => any;
    mirror: (options: any, ...objects: any[]) => any;
    mirrorX: (...objects: any[]) => any;
    mirrorY: (...objects: any[]) => any;
    mirrorZ: (...objects: any[]) => any;
    rotate: (angles: any, ...objects: any[]) => any;
    rotateX: (angle: any, ...objects: any[]) => any;
    rotateY: (angle: any, ...objects: any[]) => any;
    rotateZ: (angle: any, ...objects: any[]) => any;
    scale: (factors: any, ...objects: any[]) => any;
    scaleX: (offset: any, ...objects: any[]) => any;
    scaleY: (offset: any, ...objects: any[]) => any;
    scaleZ: (offset: any, ...objects: any[]) => any;
    transform: (matrix: any, ...objects: any[]) => any;
    translate: (offsets: any, ...objects: any[]) => any;
    translateX: (offset: any, ...objects: any[]) => any;
    translateY: (offset: any, ...objects: any[]) => any;
    translateZ: (offset: any, ...objects: any[]) => any;
};
export declare const extra: {
    color: {
        color: (color: any, ...objects: any[]) => any;
        colorNameToRgb: (s: any) => any;
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
            aliceblue: number[];
            antiquewhite: number[];
            aquamarine: number[];
            azure: number[];
            beige: number[];
            bisque: number[];
            blanchedalmond: number[];
            blueviolet: number[];
            brown: number[];
            burlywood: number[];
            cadetblue: number[];
            chartreuse: number[];
            chocolate: number[];
            coral: number[];
            cornflowerblue: number[];
            cornsilk: number[];
            crimson: number[];
            cyan: number[];
            darkblue: number[];
            darkcyan: number[];
            darkgoldenrod: number[];
            darkgray: number[];
            darkgreen: number[];
            darkgrey: number[];
            darkkhaki: number[];
            darkmagenta: number[];
            darkolivegreen: number[];
            darkorange: number[];
            darkorchid: number[];
            darkred: number[];
            darksalmon: number[];
            darkseagreen: number[];
            darkslateblue: number[];
            darkslategray: number[];
            darkslategrey: number[];
            darkturquoise: number[];
            darkviolet: number[];
            deeppink: number[];
            deepskyblue: number[];
            dimgray: number[];
            dimgrey: number[];
            dodgerblue: number[];
            firebrick: number[];
            floralwhite: number[];
            forestgreen: number[];
            gainsboro: number[];
            ghostwhite: number[];
            gold: number[];
            goldenrod: number[];
            greenyellow: number[];
            grey: number[];
            honeydew: number[];
            hotpink: number[];
            indianred: number[];
            indigo: number[];
            ivory: number[];
            khaki: number[];
            lavender: number[];
            lavenderblush: number[];
            lawngreen: number[];
            lemonchiffon: number[];
            lightblue: number[];
            lightcoral: number[];
            lightcyan: number[];
            lightgoldenrodyellow: number[];
            lightgray: number[];
            lightgreen: number[];
            lightgrey: number[];
            lightpink: number[];
            lightsalmon: number[];
            lightseagreen: number[];
            lightskyblue: number[];
            lightslategray: number[];
            lightslategrey: number[];
            lightsteelblue: number[];
            lightyellow: number[];
            limegreen: number[];
            linen: number[];
            magenta: number[];
            mediumaquamarine: number[];
            mediumblue: number[];
            mediumorchid: number[];
            mediumpurple: number[];
            mediumseagreen: number[];
            mediumslateblue: number[];
            mediumspringgreen: number[];
            mediumturquoise: number[];
            mediumvioletred: number[];
            midnightblue: number[];
            mintcream: number[];
            mistyrose: number[];
            moccasin: number[];
            navajowhite: number[];
            oldlace: number[];
            olivedrab: number[];
            orange: number[];
            orangered: number[];
            orchid: number[];
            palegoldenrod: number[];
            palegreen: number[];
            paleturquoise: number[];
            palevioletred: number[];
            papayawhip: number[];
            peachpuff: number[];
            peru: number[];
            pink: number[];
            plum: number[];
            powderblue: number[];
            rosybrown: number[];
            royalblue: number[];
            saddlebrown: number[];
            salmon: number[];
            sandybrown: number[];
            seagreen: number[];
            seashell: number[];
            sienna: number[];
            skyblue: number[];
            slateblue: number[];
            slategray: number[];
            slategrey: number[];
            snow: number[];
            springgreen: number[];
            steelblue: number[];
            tan: number[];
            thistle: number[];
            tomato: number[];
            turquoise: number[];
            violet: number[];
            wheat: number[];
            whitesmoke: number[];
            yellowgreen: number[];
        };
        hexToRgb: (notation: any) => number[];
        hslToRgb: (values: any) => any[];
        hsvToRgb: (values: any) => any[];
        hueToColorComponent: (p: any, q: any, t: any) => any;
        rgbToHex: (values: any) => string;
        rgbToHsl: (values: any) => any[];
        rgbToHsv: (values: any) => any[];
    };
    utils: {
        areAllShapesTheSameType: (shapes: any) => boolean;
        flatten: (arr: any) => any;
        fnNumberSort: (a: any, b: any) => number;
        insertSorted: (array: any, element: any, comparefunc: any) => void;
        interpolateBetween2DPointsForY: (point1: any, point2: any, y: any) => any;
    };
};
export declare const split: {
    lineSegmentByPlane: (plane: any, p1: any, p2: any) => any;
    polygonByPlane: (splane: any, polygon: any) => {
        type: number;
        front: {
            vertices: any;
            plane: any;
        };
        back: {
            vertices: any;
            plane: any;
        };
    };
};
export declare const bsp: {
    Tree: (polygons: any) => void;
    PolygonTreeNode: () => void;
    Node: (parent: any) => void;
};
export {};
