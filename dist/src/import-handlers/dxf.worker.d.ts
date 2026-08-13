export {};
export type DxfWorkerRequest = {
    data: string;
};
export type DxfWorkerResponse = {
    ok: true;
    meshes: Array<{
        layer: string;
        positions: Float32Array;
    }>;
    offset: [number, number, number] | null;
} | {
    ok: false;
    message: string;
};
