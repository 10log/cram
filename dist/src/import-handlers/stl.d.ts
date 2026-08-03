import * as THREE from "three";
interface STLGeometry extends THREE.BufferGeometry {
    hasColors?: boolean;
    alpha?: number;
}
export declare class STLLoader {
    parse(data: ArrayBuffer | string): STLGeometry;
    parseBinary(data: ArrayBuffer): STLGeometry;
    parseASCII(data: string): STLGeometry;
    ensureString(buf: ArrayBuffer | string): string;
    ensureBinary(buf: ArrayBuffer | string): ArrayBuffer;
}
export {};
