/**
 * Worker host for the ARD simulation.
 *
 * The time loop blocks for seconds to minutes (plan §5), which on the main
 * thread freezes the editor and stalls the render loop. That — not parallelism
 * — is why this exists: one worker, partitions stepped sequentially inside it.
 * `SharedArrayBuffer` is unavailable because CRAM ships as a library and cannot
 * impose COOP/COEP on the applications that embed it (plan D2), so a worker
 * pool is not on the table either.
 *
 * Steps run in bounded chunks with a yield between them, so `postMessage`
 * interleaves and progress actually reaches the UI while a long run is in
 * flight. Message shape follows `src/import-handlers/dxf.worker.ts`.
 *
 * The config crosses by structured clone, which carries the typed arrays of the
 * voxel grid and decomposition but not class instances — the simulation is
 * built here, inside the worker, from plain data. That is also why `DctPlan`
 * and the partitions are documented as non-transferable.
 */

import { createArdSimulation, type ArdSimulationConfig } from './simulation';

const ctx: Worker = self as unknown as Worker;

export {};

export type ArdWorkerRequest =
  | {
      type: 'start';
      /** Everything `createArdSimulation` needs. Structured-cloneable only. */
      config: Omit<ArdSimulationConfig, 'absorptionFor'>;
      /** Absorption per surface index, as a plain array — functions do not clone. */
      absorption?: number[];
      /** Steps per chunk before yielding. Smaller means smoother progress. */
      chunkSize?: number;
    }
  | { type: 'cancel' };

export type ArdWorkerResponse =
  | {
      type: 'progress';
      step: number;
      total: number;
      /** One sample per receiver at this step. */
      receiverSamples: Float32Array;
      slice?: Float32Array;
    }
  | {
      type: 'done';
      /** One impulse response per receiver. */
      irs: Float32Array[];
      dt: number;
      courant: number;
      cellCount: { room: number; walls: number };
      warnings: string[];
    }
  | { type: 'cancelled'; step: number }
  | { type: 'error'; message: string };

const DEFAULT_CHUNK_SIZE = 64;

/**
 * The run currently in flight, or `null`.
 *
 * A chunked loop yields with `setTimeout`, so between chunks the worker is idle
 * and will happily dispatch another message. A module-level `cancelled` flag
 * cannot survive that: a second `start` resets it to `false`, and now two loops
 * are interleaved on one flag — a `cancel` aimed at the second stops both, and
 * both post their own `done`. The token is therefore created per run and closed
 * over by that run's chunks, and a second `start` is refused while one is live
 * rather than quietly racing the first.
 */
let activeRun: { cancelled: boolean } | null = null;

ctx.addEventListener('message', (event: MessageEvent<ArdWorkerRequest>) => {
  const request = event.data;

  if (request.type === 'cancel') {
    if (activeRun) activeRun.cancelled = true;
    return;
  }

  if (activeRun) {
    ctx.postMessage({
      type: 'error',
      message:
        'An ARD run is already in progress in this worker. Send { type: "cancel" } and wait ' +
        'for the "cancelled" reply before starting another, or use a second worker.',
    } satisfies ArdWorkerResponse);
    return;
  }

  const run = { cancelled: false };
  activeRun = run;

  const fail = (error: unknown) => {
    if (activeRun === run) activeRun = null;
    ctx.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    } satisfies ArdWorkerResponse);
  };

  try {
    const { config, absorption, chunkSize = DEFAULT_CHUNK_SIZE } = request;
    const simulation = createArdSimulation({
      ...config,
      absorptionFor: (surfaceIndex: number) =>
        absorption && surfaceIndex >= 0 ? (absorption[surfaceIndex] ?? 0) : 0,
    });

    const total = simulation.steps;
    const irs = config.receivers.map(() => new Float32Array(total));

    const runChunk = () => {
      try {
        if (run.cancelled) {
          activeRun = null;
          simulation.dispose();
          ctx.postMessage({
            type: 'cancelled',
            step: simulation.currentStep,
          } satisfies ArdWorkerResponse);
          return;
        }

        const until = Math.min(simulation.currentStep + chunkSize, total);
        let last: ReturnType<typeof simulation.step> | null = null;
        while (simulation.currentStep < until) {
          last = simulation.step();
          for (let n = 0; n < irs.length; n++) irs[n][last.step] = last.receiverSamples[n];
        }

        if (last) {
          // One progress message per chunk, not per step: at 64 steps a chunk a
          // long run still reports often enough to animate, without flooding the
          // main thread with messages it has to deserialize.
          const progress: ArdWorkerResponse = {
            type: 'progress',
            step: last.step,
            total,
            receiverSamples: last.receiverSamples,
            slice: last.slice,
          };
          const transfers: ArrayBuffer[] = [last.receiverSamples.buffer as ArrayBuffer];
          if (last.slice) transfers.push(last.slice.buffer as ArrayBuffer);
          ctx.postMessage(progress, transfers);
        }

        if (simulation.currentStep < total) {
          // Yield so a cancel message can land between chunks.
          setTimeout(runChunk, 0);
          return;
        }

        const done: ArdWorkerResponse = {
          type: 'done',
          irs,
          dt: simulation.dt,
          courant: simulation.courant,
          cellCount: simulation.cellCount,
          warnings: [...simulation.warnings],
        };
        activeRun = null;
        simulation.dispose();
        ctx.postMessage(done, irs.map((ir) => ir.buffer as ArrayBuffer));
      } catch (error) {
        // A throw inside a chunk runs on a timer callback, outside the `start`
        // handler's try — without this the worker would go silent mid-run and
        // stay marked busy forever.
        simulation.dispose();
        fail(error);
      }
    };

    runChunk();
  } catch (error) {
    fail(error);
  }
});
