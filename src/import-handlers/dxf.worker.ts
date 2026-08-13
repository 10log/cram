import { decodeDxf } from './dxf-decode';

/**
 * Parses DXF off the main thread. Whole-file parsing is the expensive part of a DXF
 * import and it used to run synchronously on the UI thread, freezing the app for the
 * duration on any large drawing.
 *
 * Scene objects cannot be built here — they need THREE and the renderer — so the worker
 * returns flattened triangle vertices and the caller assembles the Room.
 */

const ctx: Worker = self as any;

export {};

export type DxfWorkerRequest = { data: string };

export type DxfWorkerResponse =
  | { ok: true; meshes: Array<{ layer: string; positions: Float32Array }>; offset: [number, number, number] | null }
  | { ok: false; message: string };

ctx.addEventListener("message", (event: MessageEvent<DxfWorkerRequest>) => {
  try {
    const { meshes, offset } = decodeDxf(event.data.data);

    // Positions are already recentred, so float32 holds them without loss — and the
    // buffers can then be transferred rather than copied.
    const payload = meshes.map(({ layer, positions }) => ({
      layer,
      positions: new Float32Array(positions),
    }));

    const response: DxfWorkerResponse = { ok: true, meshes: payload, offset };
    ctx.postMessage(response, payload.map(mesh => mesh.positions.buffer));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.postMessage({ ok: false, message } satisfies DxfWorkerResponse);
  }
});
