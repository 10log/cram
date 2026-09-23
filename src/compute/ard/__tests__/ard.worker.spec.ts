/**
 * Tests for the ARD worker host (plan Phase 6).
 *
 * Not the physics — `simulation.spec.ts` covers that. These are about the
 * chunked loop's one hazard: it yields with `setTimeout`, so between chunks the
 * worker is idle and will dispatch whatever message arrives next. A run's
 * cancel state therefore cannot live at module scope, and a second `start` must
 * not be allowed to interleave with a first.
 */

import { decompose } from '../decompose';
import { Cell, type VoxelGrid } from '../voxelize';
import type { ArdWorkerRequest, ArdWorkerResponse } from '../ard.worker';

/** A stand-in for `DedicatedWorkerGlobalScope`, recording what it is sent. */
class FakeWorkerScope {
  readonly sent: ArdWorkerResponse[] = [];
  private listener: ((event: MessageEvent<ArdWorkerRequest>) => void) | null = null;

  addEventListener(_type: string, listener: (event: MessageEvent<ArdWorkerRequest>) => void) {
    this.listener = listener;
  }

  postMessage(message: ArdWorkerResponse) {
    this.sent.push(message);
  }

  deliver(request: ArdWorkerRequest) {
    if (!this.listener) throw new Error('worker registered no message listener');
    this.listener({ data: request } as MessageEvent<ArdWorkerRequest>);
  }

  of<T extends ArdWorkerResponse['type']>(type: T) {
    return this.sent.filter((m) => m.type === type) as Array<
      Extract<ArdWorkerResponse, { type: T }>
    >;
  }
}

/** A small rigid air box — walls off, so no calibration curves are built. */
function tinyGrid(): VoxelGrid {
  const air = 10;
  const n = air + 2;
  const cells = new Uint8Array(n * n * n);
  let airCount = 0;
  for (let k = 1; k <= air; k++) {
    for (let j = 1; j <= air; j++) {
      for (let i = 1; i <= air; i++) {
        cells[i + n * (j + n * k)] = Cell.Air;
        airCount++;
      }
    }
  }
  return {
    nx: n, ny: n, nz: n,
    dx: 0.1,
    origin: { x: 0, y: 0, z: 0 },
    cells,
    surfaceOf: new Int32Array(n * n * n).fill(-1),
    airCount,
    solidCount: n * n * n - airCount,
    leaked: false,
    warnings: [],
  };
}

function startRequest(steps: number, chunkSize: number): ArdWorkerRequest {
  const grid = tinyGrid();
  return {
    type: 'start',
    chunkSize,
    config: {
      grid,
      decomposition: decompose(grid),
      c: 343,
      courant: 0.4,
      walls: false,
      sources: [{ cell: [5, 5, 5], signal: new Float32Array(steps) }],
      receivers: [{ cell: [7, 6, 4] }],
      steps,
    },
  };
}

/** Let every pending `setTimeout(_, 0)` chunk run. */
async function drain(scope: FakeWorkerScope, until: () => boolean) {
  for (let spin = 0; spin < 500 && !until(); spin++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

async function loadWorker(): Promise<FakeWorkerScope> {
  const scope = new FakeWorkerScope();
  vi.resetModules();
  vi.stubGlobal('self', scope);
  await import('../ard.worker');
  return scope;
}

describe('ard worker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('runs a chunked simulation to completion, reporting progress on the way', async () => {
    const scope = await loadWorker();
    scope.deliver(startRequest(48, 16));
    await drain(scope, () => scope.of('done').length > 0);

    expect(scope.of('error')).toHaveLength(0);
    expect(scope.of('progress').length).toBe(3); // 48 steps, 16 to a chunk
    const [done] = scope.of('done');
    expect(done).toBeDefined();
    expect(done.irs).toHaveLength(1);
    expect(done.irs[0]).toHaveLength(48);
    expect(done.dt).toBeGreaterThan(0);

    // The run token is released on completion, so the worker takes another
    // job. Leaving it set makes a worker good for exactly one simulation.
    scope.deliver(startRequest(16, 16));
    await drain(scope, () => scope.of('done').length > 1);
    expect(scope.of('done')).toHaveLength(2);
    expect(scope.of('error')).toHaveLength(0);
  });

  it('refuses a second start while one is in flight, and finishes the first', async () => {
    // The hazard: with a module-level cancel flag, a second `start` resets it
    // and both loops then run interleaved off the same flag — a later `cancel`
    // stops both, and both post their own `done`. Exactly one run at a time.
    const scope = await loadWorker();
    scope.deliver(startRequest(64, 8));
    scope.deliver(startRequest(64, 8)); // arrives between chunks

    await drain(scope, () => scope.of('done').length > 0);

    expect(scope.of('error')).toHaveLength(1);
    expect(scope.of('error')[0].message).toMatch(/already in progress/);
    // One run, one completion — not two.
    expect(scope.of('done')).toHaveLength(1);
    expect(scope.of('cancelled')).toHaveLength(0);
  });

  it('cancels the run in flight and then accepts a new one', async () => {
    const scope = await loadWorker();
    scope.deliver(startRequest(4000, 8));
    // One chunk has already run synchronously; cancel lands before the next.
    scope.deliver({ type: 'cancel' });
    await drain(scope, () => scope.of('cancelled').length > 0);

    expect(scope.of('cancelled')).toHaveLength(1);
    expect(scope.of('cancelled')[0].step).toBeLessThan(4000);
    expect(scope.of('done')).toHaveLength(0);

    // The run token was released, so the worker is usable again. A module-level
    // flag left at `true` would cancel this one on its first chunk.
    scope.deliver(startRequest(16, 16));
    await drain(scope, () => scope.of('done').length > 0);
    expect(scope.of('done')).toHaveLength(1);
    expect(scope.of('cancelled')).toHaveLength(1);
  });

  it('reports an error thrown mid-run instead of going silent', async () => {
    // A chunk after the first runs on a timer callback, outside the `start`
    // handler's `try`. Without a `try` of its own a throw there escapes to the
    // worker's error event: no `error` message, no `done`, and the run token
    // still held — the worker goes quiet and stays busy forever.
    const scope = await loadWorker();
    const request = startRequest(64, 8);
    if (request.type !== 'start') throw new Error('unreachable');

    // The driver re-reads `source.signal` on every step, so a getter that
    // fails partway through throws from inside a chunk rather than from the
    // synchronous setup.
    const signal = new Float32Array(64);
    let reads = 0;
    request.config.sources = [
      {
        cell: [5, 5, 5],
        get signal() {
          if (++reads > 20) throw new Error('signal went away mid-run');
          return signal;
        },
      } as (typeof request.config.sources)[number],
    ];

    scope.deliver(request);
    await drain(scope, () => scope.of('error').length > 0);

    expect(scope.of('error')).toHaveLength(1);
    expect(scope.of('error')[0].message).toMatch(/went away mid-run/);
    expect(scope.of('done')).toHaveLength(0);
    // The failure released the run token, so the worker still works.
    scope.deliver(startRequest(16, 16));
    await drain(scope, () => scope.of('done').length > 0);
    expect(scope.of('done')).toHaveLength(1);
  });

  it('reports a configuration error instead of going silent', async () => {
    const scope = await loadWorker();
    const request = startRequest(8, 8);
    if (request.type !== 'start') throw new Error('unreachable');
    request.config.receivers = [{ cell: [0, 0, 0] }]; // inside the shell

    scope.deliver(request);
    await drain(scope, () => scope.of('error').length > 0);

    expect(scope.of('error')[0].message).toMatch(/inside a wall/);
    // And the worker is not left marked busy by the failure.
    scope.deliver(startRequest(16, 16));
    await drain(scope, () => scope.of('done').length > 0);
    expect(scope.of('done')).toHaveLength(1);
  });
});
