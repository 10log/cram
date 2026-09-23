/**
 * SolverCard's handling of the ARD solver (plan Phase 8).
 *
 * Two things the card gets wrong if nobody checks: it can enable a run the
 * solver will immediately refuse, and it can latch into "calculating" with no
 * way out — the header disables Calculate while calculating, so a state that
 * never clears cannot be cleared from the control that would clear it.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';

import SolverCard from '../SolverCard';

const mocks = vi.hoisted(() => ({
  emitted: [] as { event: string; payload: unknown }[],
  listeners: new Map<string, Set<(payload: unknown) => void>>(),
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

vi.mock('../../../store/solver-store', () => ({
  useSolver: (selector: (state: unknown) => unknown) =>
    selector({ solvers: mocks.solvers, version: 0 }),
  removeSolver: vi.fn(),
}));

vi.mock('../../../render/renderer', () => ({
  renderer: { add: vi.fn(), remove: vi.fn(), requestRender: vi.fn() },
}));

// The parameter tabs pull in MUI trees and whole solver modules that have
// nothing to do with what is under test here. `vi.mock` factories are hoisted
// above every declaration in the file, so each one has to build its own stub.
vi.mock('../../parameter-config/ARDTab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/image-source-tab/ImageSourceTab', () => ({
  ImageSourceTab: () => <div />,
}));
vi.mock('../../parameter-config/RayTracerTab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/RT60Tab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/FDTD_2DTab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/EnergyDecayTab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/ARTTab', () => ({ default: () => <div /> }));
vi.mock('../../parameter-config/BeamTraceTab', () => ({ default: () => <div /> }));


function setUp(overrides: Record<string, unknown> = {}) {
  mocks.emitted.length = 0;
  mocks.listeners.clear();
  mocks.solvers = {
    'ard-1': {
      uuid: 'ard-1',
      kind: 'ard',
      name: 'Adaptive Rectangular Decomposition',
      roomID: 'room-1',
      sourceIDs: ['s1'],
      receiverIDs: ['r1'],
      ...overrides,
    },
  };
}

/**
 * The header's Calculate control.
 *
 * It is a styled `Box`, not a `<button>`, and "disabled" is
 * `pointer-events: none` rather than the attribute — so neither `getByRole`
 * nor `toBeDisabled` applies. The title also carries the calculating state.
 */
const calculateButton = () => screen.getByTitle(/^Calculat/);
const isEnabled = () =>
  window.getComputedStyle(calculateButton()).pointerEvents !== 'none';

function sendProgress(progress: number, uuid = 'ard-1') {
  act(() => {
    for (const listener of mocks.listeners.get('ARD_PROGRESS') ?? []) {
      listener({ uuid, progress });
    }
  });
}

describe('SolverCard with an ARD solver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setUp();
  });

  it('enables the run only when a room and a pair are configured', () => {
    render(<SolverCard uuid="ard-1" />);
    expect(isEnabled()).toBe(true);
  });

  it('will not start a run the solver would refuse for want of a room', () => {
    // The parameter tab checks `roomID`; without the same check here the two
    // entry points disagree, the button is live, the progress bar flashes and
    // the solver throws "no room selected".
    setUp({ roomID: '' });
    render(<SolverCard uuid="ard-1" />);
    expect(isEnabled()).toBe(false);
  });

  it('will not start a run without a source-receiver pair', () => {
    setUp({ sourceIDs: [], receiverIDs: [] });
    render(<SolverCard uuid="ard-1" />);
    expect(isEnabled()).toBe(false);
  });

  it('recovers from a cancelled run rather than latching on "calculating"', () => {
    render(<SolverCard uuid="ard-1" />);

    sendProgress(0.4);
    expect(isEnabled()).toBe(false); // running

    // The solver resets to 0 when a run is cancelled or throws. Without that
    // terminal event this button never comes back, and it is the only way to
    // start the run that would have cleared it.
    sendProgress(0);
    expect(isEnabled()).toBe(true);
  });

  it('recovers when a run completes', () => {
    render(<SolverCard uuid="ard-1" />);
    sendProgress(0.9);
    expect(isEnabled()).toBe(false);
    sendProgress(1);
    expect(isEnabled()).toBe(true);
  });

  it('ignores progress belonging to another solver', () => {
    render(<SolverCard uuid="ard-1" />);
    sendProgress(0.5, 'someone-else');
    expect(isEnabled()).toBe(true);
  });
});
