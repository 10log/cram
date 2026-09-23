/**
 * Tests for the solver's handling of the simulation worker (plan Phase 7).
 *
 * `Worker` is absent under jsdom, so `ard-solver.spec.ts` only ever exercises
 * the inline path. These mock `worker-host` and drive the protocol by hand,
 * because the two failure modes that matter look identical from the outside
 * and must not be treated the same:
 *
 *  - a worker that never started has done no work, so running the loop inline
 *    loses nothing;
 *  - a worker that died mid-run would have the main thread redo minutes of
 *    work the UI has already shown progress for — exactly the freeze the
 *    worker exists to avoid.
 */

import { BufferAttribute, BufferGeometry, Vector3 } from 'three';

import { ARD } from '../index';

const mocks = vi.hoisted(() => ({
  emitted: [] as { event: string; payload: unknown }[],
  containers: {} as Record<string, unknown>,
  solvers: {} as Record<string, unknown>,
  results: {} as Record<string, unknown>,
  workers: [] as FakeWorker[],
  nextWorker: null as (() => FakeWorker | null) | null,
}));

/** Enough of `Worker` for the solver's protocol handling. */
class FakeWorker {
  readonly posted: unknown[] = [];
  terminated = false;
  private listeners = new Map<string, Set<(event: unknown) => void>>();

  addEventListener(type: string, listener: (event: unknown) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: (event: unknown) => void) {
    this.listeners.get(type)?.delete(listener);
  }

  postMessage(message: unknown) {
    this.posted.push(message);
  }

  terminate() {
    this.terminated = true;
  }

  /** Deliver a worker response to the solver. */
  send(message: unknown) {
    for (const listener of [...(this.listeners.get('message') ?? [])]) {
      listener({ data: message });
    }
  }

  /** Deliver an uncaught worker failure. */
  fail(message = 'boom') {
    for (const listener of [...(this.listeners.get('error') ?? [])]) listener({ message });
  }

  get listenerCount() {
    return (this.listeners.get('message')?.size ?? 0) + (this.listeners.get('error')?.size ?? 0);
  }
}

vi.mock('../worker-host', () => ({
  createArdWorker: () => {
    const worker = mocks.nextWorker ? mocks.nextWorker() : new FakeWorker();
    if (worker) mocks.workers.push(worker);
    return worker as unknown as Worker | null;
  },
}));

vi.mock('../../../render/renderer', () => ({
  renderer: { add: vi.fn(), remove: vi.fn(), requestRender: vi.fn() },
}));

vi.mock('../../../messenger', () => ({
  emit: (event: string, payload: unknown) => {
    mocks.emitted.push({ event, payload });
  },
  on: vi.fn(),
  messenger: { on: vi.fn(), emit: vi.fn() },
}));

vi.mock('../../../store', () => ({
  useContainer: {
    getState: () => ({
      containers: mocks.containers,
      getRooms: () => Object.values(mocks.containers).filter((c: any) => c.kind === 'room'),
    }),
  },
  useSolver: { getState: () => ({ solvers: mocks.solvers }) },
  useResult: { getState: () => ({ results: mocks.results }) },
  addSolver: vi.fn(),
  removeSolver: vi.fn(),
  setSolverProperty: vi.fn(),
  callSolverMethod: vi.fn(),
}));


const { containers, workers } = mocks;

function makeRoom(alpha: number) {
  const half = { x: 2, y: 1.5, z: 1.3 };
  const quads = faceQuads(half);
  return {
    uuid: 'room-1',
    kind: 'room',
    name: 'shoebox',
    temperature: 20,
    humidity: 40,
    allSurfaces: quads.map((positions, index) => {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
      return {
        uuid: `surface-${index}`,
        kind: 'surface',
        geometry,
        absorptionFunction: () => alpha,
        localToWorld: (v: Vector3) => v,
      };
    }),
    boundingBox: { getSize: (t: Vector3) => t.set(4, 3, 2.6) },
  };
}

function faceQuads(half: { x: number; y: number; z: number }): number[][] {
  const { x, y, z } = half;
  const quad = (a: number[], b: number[], c: number[], d: number[]) => [
    ...a, ...b, ...c, ...a, ...c, ...d,
  ];
  return [
    quad([-x, -y, -z], [-x, y, -z], [-x, y, z], [-x, -y, z]),
    quad([x, -y, -z], [x, -y, z], [x, y, z], [x, y, -z]),
    quad([-x, -y, -z], [-x, -y, z], [x, -y, z], [x, -y, -z]),
    quad([-x, y, -z], [x, y, -z], [x, y, z], [-x, y, z]),
    quad([-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z]),
    quad([-x, -y, z], [-x, y, z], [x, y, z], [x, -y, z]),
  ];
}

function makeSolver(props: Record<string, unknown> = {}) {
  containers['room-1'] = makeRoom(0.3);
  containers['s1'] = {
    uuid: 's1', kind: 'source', name: 's1', initialSPL: 100,
    getWorldPosition: (t: Vector3) => t.set(-1, 0, 0),
  };
  containers['r1'] = {
    uuid: 'r1', kind: 'receiver', name: 'r1',
    getWorldPosition: (t: Vector3) => t.set(0.5, 0, 0),
  };
  return new ARD({
    roomID: 'room-1', sourceIDs: ['s1'], receiverIDs: ['r1'],
    fMax: 250, irLength: 0.03, ...props,
  });
}

/** Wait for the solver to reach the worker and post its `start`. */
async function untilStarted(index = 0): Promise<FakeWorker> {
  for (let spin = 0; spin < 200; spin++) {
    if (workers[index]?.posted.length) return workers[index];
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error('the solver never posted to the worker');
}

function startMessage(worker: FakeWorker) {
  return worker.posted[0] as { type: string; config: { steps: number; receivers: unknown[] } };
}

describe('ARD worker handling', () => {
  beforeEach(() => {
    mocks.emitted.length = 0;
    mocks.workers.length = 0;
    mocks.nextWorker = null;
    for (const key of Object.keys(mocks.containers)) delete mocks.containers[key];
    for (const key of Object.keys(mocks.results)) delete mocks.results[key];
  });

  it('hands the whole run to one worker and accepts its result', async () => {
    const solver = makeSolver();
    const running = solver.run();
    const worker = await untilStarted();

    const start = startMessage(worker);
    expect(start.type).toBe('start');
    expect(start.config.steps).toBeGreaterThan(0);
    // `absorptionFor` is a function; it must not be in the cloned message.
    expect(start.config).not.toHaveProperty('absorptionFor');

    worker.send({ type: 'progress', step: 9, total: start.config.steps, receiverSamples: new Float32Array(1) });
    expect(solver.progress).toBeGreaterThan(0);

    worker.send({
      type: 'done',
      irs: [new Float32Array(start.config.steps)],
      dt: 1 / 6500,
      courant: 0.4,
      cellCount: { room: 10, walls: 5 },
      warnings: ['from the worker'],
    });

    const summary = await running;
    expect(summary.warnings).toContain('from the worker');
    expect(summary.cellCount).toEqual({ room: 10, walls: 5 });
    expect(workers).toHaveLength(1);
    expect(worker.terminated).toBe(true);
    // Listeners are removed when the run settles, not left to accumulate.
    expect(worker.listenerCount).toBe(0);
  }, 60_000);

  it('reuses one worker across bands rather than building one each', async () => {
    const solver = makeSolver({ perBandRuns: true });
    const running = solver.run();

    // fMax 250 keeps two bands, so two `start` messages on the same worker.
    const worker = await untilStarted();
    for (let band = 0; band < 2; band++) {
      for (let spin = 0; spin < 200 && worker.posted.length <= band; spin++) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      const start = worker.posted[band] as { type: string; config: { steps: number } };
      expect(start.type).toBe('start');
      worker.send({
        type: 'done',
        irs: [new Float32Array(start.config.steps)],
        dt: 1 / 6500,
        courant: 0.4,
        cellCount: { room: 10, walls: 5 },
        warnings: [],
      });
    }

    const summary = await running;
    expect(summary.runs).toBe(2);
    expect(workers).toHaveLength(1);
  }, 60_000);

  it('rejects when the worker dies mid-run instead of redoing it inline', async () => {
    // Re-running the whole time loop on the main thread here is the freeze the
    // worker exists to avoid, for a run the UI has already shown progress for.
    const solver = makeSolver();
    const running = solver.run();
    const worker = await untilStarted();

    worker.send({
      type: 'progress',
      step: 5,
      total: startMessage(worker).config.steps,
      receiverSamples: new Float32Array(1),
    });
    worker.fail('out of memory');

    await expect(running).rejects.toThrow(/died mid-run/);
    await expect(running).rejects.toThrow(/out of memory/);
    expect(solver.running).toBe(false);
  }, 60_000);

  it('falls back inline, once, when the worker never starts', async () => {
    const solver = makeSolver({ perBandRuns: true });
    const running = solver.run();
    const worker = await untilStarted();

    // Failed before producing anything: nothing is lost by running it here.
    worker.fail('module workers unsupported');

    const summary = await running;
    expect(summary.runs).toBe(2);
    // The second band did not construct another worker to fail the same way.
    expect(workers).toHaveLength(1);
    expect(summary.impulseResponses.get('s1->r1')).toBeDefined();
  }, 120_000);

  it('runs inline without trying at all when there is no worker', async () => {
    mocks.nextWorker = () => null;
    const solver = makeSolver();
    const summary = await solver.run();
    expect(workers).toHaveLength(0);
    expect(summary.impulseResponses.get('s1->r1')).toBeDefined();
  }, 120_000);

  it('forwards a cancel to the worker and surfaces its reply', async () => {
    const solver = makeSolver();
    const running = solver.run();
    const worker = await untilStarted();

    solver.cancel();
    expect(worker.posted.some((m: any) => m.type === 'cancel')).toBe(true);

    worker.send({ type: 'cancelled', step: 12 });
    await expect(running).rejects.toThrow(/cancelled/);
    expect(solver.running).toBe(false);
  }, 60_000);

  it('passes a reported worker error straight through', async () => {
    // A reported error is the worker working — it caught the throw and told
    // us. The same configuration fails the same way inline, so retrying it
    // there would only be slower.
    const solver = makeSolver();
    const running = solver.run();
    const worker = await untilStarted();

    worker.send({ type: 'error', message: 'Decomposition has no boxes' });
    await expect(running).rejects.toThrow(/Decomposition has no boxes/);
  }, 60_000);
});
