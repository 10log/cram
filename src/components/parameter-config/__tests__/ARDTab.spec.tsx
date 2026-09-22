/**
 * ARDTab component tests (plan Phase 8).
 *
 * The tab's own job beyond wiring inputs is the cost line: ARD is `O(fMax⁴)`
 * and a careless `fMax` turns a ten-second run into an hour, so the numbers
 * have to be there, correct, and above the button rather than below it.
 */

import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';

import ARDTab from '../ARDTab';

const mocks = vi.hoisted(() => ({
  emitted: [] as { event: string; payload: unknown }[],
  listeners: new Map<string, Set<(payload: unknown) => void>>(),
  containers: {} as Record<string, unknown>,
  solvers: {} as Record<string, unknown>,
}));

vi.mock('../../../messenger', () => ({
  emit: (event: string, payload: unknown) => {
    mocks.emitted.push({ event, payload });
    for (const listener of mocks.listeners.get(event) ?? []) listener(payload);
  },
  on: (event: string, listener: (payload: unknown) => void) => {
    if (!mocks.listeners.has(event)) mocks.listeners.set(event, new Set());
    mocks.listeners.get(event)!.add(listener);
    return () => mocks.listeners.get(event)!.delete(listener);
  },
  messenger: { on: vi.fn(), emit: vi.fn() },
}));

vi.mock('../../../store', () => ({
  useContainer: (selector: (state: unknown) => unknown) =>
    selector({ containers: mocks.containers, version: 0 }),
  useSolver: (selector: (state: unknown) => unknown) =>
    selector({ solvers: mocks.solvers, version: 0 }),
  addSolver: vi.fn(),
  removeSolver: vi.fn(),
  setSolverProperty: vi.fn(),
  useResult: { getState: () => ({ results: {} }) },
}));

vi.mock('../../../render/renderer', () => ({
  renderer: { add: vi.fn(), remove: vi.fn(), requestRender: vi.fn() },
}));


/** A stand-in for the solver, exposing only what the tab reads. */
function fakeSolver(overrides: Record<string, unknown> = {}) {
  return {
    uuid: 'ard-1',
    kind: 'ard',
    name: 'Adaptive Rectangular Decomposition',
    roomID: 'room-1',
    sourceIDs: ['s1'],
    receiverIDs: ['r1'],
    fMax: 500,
    wallThickness: 8,
    cancel: vi.fn(),
    estimatedGrid: { x: 33, y: 29, z: 27 },
    estimatedCellCount: 33 * 29 * 27,
    estimatedSimulatedCells: 41_000,
    estimatedSteps: 2_600,
    estimatedStepsPerRun: 2_600,
    estimatedRuns: 1,
    estimatedSeconds: 79,
    bands: [500],
    referenceFrequency: 500,
    cellSize: 0.264,
    dimensions: 3,
    slice: 'xz',
    sliceCoordinate: null,
    ...overrides,
  };
}

function setUp(solver: Record<string, unknown> = fakeSolver()) {
  mocks.emitted.length = 0;
  mocks.listeners.clear();
  mocks.containers = {
    'room-1': { uuid: 'room-1', kind: 'room', name: 'Studio' },
    s1: { uuid: 's1', kind: 'source', name: 'Source 1' },
    r1: { uuid: 'r1', kind: 'receiver', name: 'Receiver 1' },
  };
  mocks.solvers = { 'ard-1': solver };
  return solver;
}

describe('ARDTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setUp();
  });

  it('shows the cost of the run before it is started', () => {
    render(<ARDTab uuid="ard-1" />);

    expect(screen.getByText('Estimated Cost')).toBeInTheDocument();
    expect(screen.getByText('33 x 29 x 27 @ 26.4 cm')).toBeInTheDocument();
    expect(screen.getByText('41,000')).toBeInTheDocument(); // cells stepped
    expect(screen.getByText('2,600')).toBeInTheDocument(); // steps
    expect(screen.getByText('79 s')).toBeInTheDocument();
  });

  it('spells out every multiplier on the steps row', () => {
    // "10,400" hides both the thing the user controls (how many sources) and
    // the thing they toggled (per-band runs). The point of the cost line is
    // that it can be acted on, which means showing where the number came from.
    setUp(fakeSolver({
      bands: [125, 250, 500, 1000],
      estimatedSteps: 20_800,
      estimatedStepsPerRun: 2_600,
      estimatedRuns: 8,
      sourceIDs: ['s1', 's2'],
    }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('2,600 x 2 sources x 4 bands')).toBeInTheDocument();
  });

  it('leaves out multipliers that are one', () => {
    setUp(fakeSolver({ bands: [125, 250], estimatedStepsPerRun: 2_600 }));
    const single = render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('2,600 x 2 bands')).toBeInTheDocument();
    single.unmount();

    setUp(fakeSolver({ sourceIDs: ['s1', 's2', 's3'] }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('2,600 x 3 sources')).toBeInTheDocument();
  });

  it('scales the time estimate into readable units', () => {
    setUp(fakeSolver({ estimatedSeconds: 0.4 }));
    const { unmount } = render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('< 1 s')).toBeInTheDocument();
    unmount();

    setUp(fakeSolver({ estimatedSeconds: 600 }));
    const second = render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('10 min')).toBeInTheDocument();
    second.unmount();

    setUp(fakeSolver({ estimatedSeconds: 9000 }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('2.5 h')).toBeInTheDocument();
  });

  it('shows nothing rather than NaN when there is no room to estimate from', () => {
    setUp(fakeSolver({
      estimatedGrid: { x: 0, y: 0, z: 0 },
      estimatedCellCount: 0,
      estimatedSimulatedCells: 0,
      estimatedSeconds: 0,
      cellSize: 0.264,
    }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).toBeNull();
  });

  it('runs on the play button and cancels on the second press', () => {
    const solver = setUp();
    render(<ARDTab uuid="ard-1" />);

    fireEvent.click(screen.getByRole('button', { name: /run/i }));
    expect(mocks.emitted.filter((e) => e.event === 'CALCULATE_ARD')).toHaveLength(1);

    // A run reports progress; the button becomes the cancel.
    act(() => {
      for (const listener of mocks.listeners.get('ARD_PROGRESS') ?? []) {
        listener({ uuid: 'ard-1', progress: 0.4 });
      }
    });
    expect(screen.getByText('40%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(solver.cancel).toHaveBeenCalledTimes(1);
    // And it did not queue a second run, which the solver would refuse anyway.
    expect(mocks.emitted.filter((e) => e.event === 'CALCULATE_ARD')).toHaveLength(1);
  });

  it('ignores progress from another solver', () => {
    render(<ARDTab uuid="ard-1" />);
    act(() => {
      for (const listener of mocks.listeners.get('ARD_PROGRESS') ?? []) {
        listener({ uuid: 'someone-else', progress: 0.7 });
      }
    });
    expect(screen.queryByText('70%')).toBeNull();
  });

  it('cannot be run without a room and a source-receiver pair', () => {
    setUp(fakeSolver({ sourceIDs: [], receiverIDs: [] }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByRole('button', { name: /run/i })).toBeDisabled();
  });

  it('offers the plane control only in two dimensions', () => {
    const threeD = render(<ARDTab uuid="ard-1" />);
    expect(screen.queryByDisplayValue('xz')).toBeNull();
    threeD.unmount();

    setUp(fakeSolver({ dimensions: 2 }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByDisplayValue('xz')).toBeInTheDocument();
  });

  it('names the plane in the cost line rather than a grid that is one cell deep', () => {
    setUp(fakeSolver({ dimensions: 2, slice: 'xy' }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('xy plane @ 26.4 cm')).toBeInTheDocument();
    expect(screen.queryByText(/33 x 29 x 27/)).toBeNull();
  });

  it('lets the cut height be set, which is what makes the fallback reachable', () => {
    // `sliceCoordinate` is saved and restored; without a control the clamp and
    // widest-layer paths could only be reached by editing project JSON.
    setUp(fakeSolver({ dimensions: 2 }));
    const bySource = render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('Cut at Source')).toBeInTheDocument();
    // No height row while the source owns the plane.
    expect(screen.queryByText('Cut at Y (m)')).toBeNull();
    bySource.unmount();

    setUp(fakeSolver({ dimensions: 2, sliceCoordinate: 1.2 }));
    render(<ARDTab uuid="ard-1" />);
    expect(screen.getByText('Cut at Y (m)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.2')).toBeInTheDocument();
  });

  it('names the cut axis after the plane', () => {
    setUp(fakeSolver({ dimensions: 2, slice: 'xy', sliceCoordinate: 0.5 }));
    render(<ARDTab uuid="ard-1" />);
    // A section collapses world Z, not world Y.
    expect(screen.getByText('Cut at Z (m)')).toBeInTheDocument();
    expect(screen.queryByText('Cut at Y (m)')).toBeNull();
  });

  it('hides the cut controls entirely in three dimensions', () => {
    render(<ARDTab uuid="ard-1" />);
    expect(screen.queryByText('Cut at Source')).toBeNull();
    expect(screen.queryByText('Cut at Y (m)')).toBeNull();
  });

  it('turns the cut height on and off through the checkbox', () => {
    // The number input cannot emit null, so the checkbox owns that half of the
    // state. Turning it off has to hand over a usable starting height.
    setUp(fakeSolver({ dimensions: 2 }));
    const { unmount } = render(<ARDTab uuid="ard-1" />);
    const setOf = (property: string) =>
      mocks.emitted.filter(
        (e) =>
          e.event === 'ARD_SET_PROPERTY' &&
          (e.payload as { property: string }).property === property,
      );

    fireEvent.click(screen.getByRole('checkbox', { checked: true }));
    expect((setOf('sliceCoordinate')[0].payload as { value: unknown }).value).toBe(1.2);
    unmount();

    // A section starts at the centre instead.
    setUp(fakeSolver({ dimensions: 2, slice: 'xy' }));
    render(<ARDTab uuid="ard-1" />);
    fireEvent.click(screen.getByRole('checkbox', { checked: true }));
    expect((setOf('sliceCoordinate')[0].payload as { value: unknown }).value).toBe(0);
  });

  it('sends the dimension change as a number, not a string', () => {
    // `PropertyRowSelect` deals in strings; `ARD.dimensions` is 2 | 3, and a
    // solver whose dimensions are "2" takes the 3D branch everywhere.
    render(<ARDTab uuid="ard-1" />);
    fireEvent.change(screen.getByDisplayValue('3'), { target: { value: '2' } });

    const set = mocks.emitted.filter(
      (e) =>
        e.event === 'ARD_SET_PROPERTY' &&
        (e.payload as { property: string }).property === 'dimensions',
    );
    expect(set).toHaveLength(1);
    expect((set[0].payload as { value: unknown }).value).toBe(2);
  });

  it('sends parameter edits as ARD_SET_PROPERTY', () => {
    render(<ARDTab uuid="ard-1" />);
    const input = screen.getByDisplayValue('500');
    fireEvent.change(input, { target: { value: '1000' } });
    fireEvent.blur(input);

    const set = mocks.emitted.filter((e) => e.event === 'ARD_SET_PROPERTY');
    expect(set.length).toBeGreaterThan(0);
    expect((set[set.length - 1].payload as { uuid: string }).uuid).toBe('ard-1');
  });
});
