/**
 * @author Daosheng Mu / https://github.com/DaoshengMu/
 * @author mrdoob / http://mrdoob.com/
 * @author takahirox / https://github.com/takahirox/
 * modified by https://github.com/gregzanch
 */
import * as THREE from "three";
export declare class TGALoader extends THREE.Loader {
    load(url: string, onLoad?: (texture: THREE.Texture) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: unknown) => void): THREE.Texture;
    parse(buffer: ArrayBuffer): HTMLCanvasElement | ImageBitmap;
}
