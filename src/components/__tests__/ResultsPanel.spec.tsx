/**
 * ResultsPanel Tests
 *
 * Tests for the results panel component that manages:
 * - Tab display for simulation results
 * - Switching between result types (RT60, LTP, ImpulseResponse)
 * - Empty state display
 * - Tab selection on new results
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsPanel } from '../ResultsPanel';
import { useResult, ResultKind } from '../../store/result-store';

// Mock the chart components
vi.mock('../results/LTPChart', () => ({
  __esModule: true,
  default: ({ uuid }: { uuid: string }) => <div data-testid="ltp-chart">{uuid}</div>,
}));

vi.mock('../results/RT60Chart', () => ({
  __esModule: true,
  default: ({ uuid }: { uuid: string }) => <div data-testid="rt60-chart">{uuid}</div>,
}));

vi.mock('../results/ImpulseResponseChart', () => ({
  __esModule: true,
  default: ({ uuid }: { uuid: string }) => <div data-testid="ir-chart">{uuid}</div>,
}));

// Mock react-tabs
vi.mock('react-tabs', () => ({
  Tab: ({ children }: { children: React.ReactNode }) => <div role="tab">{children}</div>,
  Tabs: ({ children, selectedIndex, onSelect }: any) => (
    <div data-testid="tabs" data-selected={selectedIndex}>
      {children}
    </div>
  ),
  TabList: ({ children }: { children: React.ReactNode }) => <div role="tablist">{children}</div>,
  TabPanel: ({ children }: { children: React.ReactNode }) => <div role="tabpanel">{children}</div>,
}));

// Mock messenger
vi.mock('../../messenger', () => ({
  on: vi.fn(() => vi.fn()),
  emit: vi.fn(),
}));

describe('ResultsPanel', () => {
  const originalState = useResult.getState();

  beforeEach(() => {
    // Reset store to empty state
    useResult.setState({
      results: {},
      openTabIndex: 0,
      set: originalState.set,
    });
  });

  afterEach(() => {
    useResult.setState(originalState);
  });

  describe('Empty State', () => {
    it('displays empty message when no results', () => {
      render(<ResultsPanel />);
      expect(screen.getByText('No Results Yet!')).toBeInTheDocument();
    });

    it('does not render tabs when no results', () => {
      render(<ResultsPanel />);
      expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
    });
  });

  describe('With Results', () => {
    beforeEach(() => {
      useResult.setState({
        results: {
          'rt60-uuid': {
            kind: ResultKind.StatisticalRT60,
            name: 'RT60 Result',
            uuid: 'rt60-uuid',
            from: 'solver-1',
            info: {
              frequency: [125, 250, 500, 1000, 2000, 4000],
              airabsorption: true,
              humidity: 50,
              temperature: 20,
            },
            data: [{ sabine: 1.0, eyring: 0.9, ap: 0.95, frequency: 125 }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });
    });

    it('renders tabs when results exist', () => {
      render(<ResultsPanel />);
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('displays result name in tab', () => {
      render(<ResultsPanel />);
      expect(screen.getByText('RT60 Result')).toBeInTheDocument();
    });

    it('renders correct chart type for RT60 result', () => {
      render(<ResultsPanel />);
      expect(screen.getByTestId('rt60-chart')).toBeInTheDocument();
    });
  });

  describe('Multiple Results', () => {
    beforeEach(() => {
      useResult.setState({
        results: {
          'rt60-uuid': {
            kind: ResultKind.StatisticalRT60,
            name: 'RT60 Analysis',
            uuid: 'rt60-uuid',
            from: 'solver-1',
            info: {
              frequency: [125, 250, 500, 1000, 2000, 4000],
              airabsorption: true,
              humidity: 50,
              temperature: 20,
            },
            data: [{ sabine: 1.0, eyring: 0.9, ap: 0.95, frequency: 125 }],
          },
          'ir-uuid': {
            kind: ResultKind.ImpulseResponse,
            name: 'Impulse Response',
            uuid: 'ir-uuid',
            from: 'raytracer',
            info: {
              sampleRate: 44100,
              sourceName: 'Source 1',
              receiverName: 'Receiver 1',
            },
            data: [{ time: 0, amplitude: 1.0 }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });
    });

    it('renders multiple tabs', () => {
      render(<ResultsPanel />);
      expect(screen.getByText('RT60 Analysis')).toBeInTheDocument();
      expect(screen.getByText('Impulse Response')).toBeInTheDocument();
    });

    it('renders both tab panels', () => {
      render(<ResultsPanel />);
      const tabPanels = screen.getAllByRole('tabpanel');
      expect(tabPanels.length).toBe(2);
    });
  });

  describe('Chart Type Selection', () => {
    it('renders RT60Chart for statisticalRT60 kind', () => {
      useResult.setState({
        results: {
          'test-uuid': {
            kind: ResultKind.StatisticalRT60,
            name: 'Test RT60',
            uuid: 'test-uuid',
            from: 'solver',
            info: {
              frequency: [125, 250, 500, 1000, 2000, 4000],
              airabsorption: false,
              humidity: 50,
              temperature: 20,
            },
            data: [{ sabine: 1.0, eyring: 0.9, ap: 0.95, frequency: 125 }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });

      render(<ResultsPanel />);
      expect(screen.getByTestId('rt60-chart')).toBeInTheDocument();
    });

    it('renders ImpulseResponseChart for impulseResponse kind', () => {
      useResult.setState({
        results: {
          'test-uuid': {
            kind: ResultKind.ImpulseResponse,
            name: 'Test IR',
            uuid: 'test-uuid',
            from: 'solver',
            info: {
              sampleRate: 44100,
              sourceName: 'Source',
              receiverName: 'Receiver',
            },
            data: [{ time: 0, amplitude: 1.0 }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });

      render(<ResultsPanel />);
      expect(screen.getByTestId('ir-chart')).toBeInTheDocument();
    });

    it('renders LTPChart for linear-time-progression kind', () => {
      useResult.setState({
        results: {
          'test-uuid': {
            kind: ResultKind.LevelTimeProgression,
            name: 'Test LTP',
            uuid: 'test-uuid',
            from: 'solver',
            info: {
              initialSPL: [80],
              frequency: [1000],
              maxOrder: 10,
            },
            data: [{ time: 0.01, pressure: [0.1], order: 1, arrival: 0.01, uuid: 'ray-1' }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });

      render(<ResultsPanel />);
      expect(screen.getByTestId('ltp-chart')).toBeInTheDocument();
    });
  });
});
