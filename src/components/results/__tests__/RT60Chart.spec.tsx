/**
 * RT60Chart Tests
 *
 * Tests for the RT60 bar chart visualization component that displays:
 * - Statistical reverberation time results (Sabine, Eyring, Arau-Puchades)
 * - Bar groups for each octave band frequency
 * - Legend for RT60 calculation methods
 */

import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { RT60Chart, Chart, RTData } from '../RT60Chart';
import { useResult, ResultKind } from '../../../store/result-store';

// Mock d3-time-format (ESM module)
jest.mock('d3-time-format', () => ({
  timeParse: () => () => new Date(),
  timeFormat: () => () => 'Jan 01',
}));

// Mock visx components
jest.mock('@visx/group', () => ({
  Group: ({ children }: any) => <g data-testid="visx-group">{children}</g>,
}));

jest.mock('@visx/shape', () => ({
  BarGroup: ({ children, data }: any) => (
    <g data-testid="bar-group">
      {typeof children === 'function'
        ? children(data.map((d: any, i: number) => ({
            index: i,
            x0: i * 50,
            bars: [{ x: 0, y: 0, width: 15, height: 50, color: '#48beff', key: 'sabine', value: d.sabine, index: 0 }]
          })))
        : children}
    </g>
  ),
}));

jest.mock('@visx/axis', () => ({
  AxisBottom: ({ label }: any) => <g data-testid="axis-bottom"><text>{label}</text></g>,
  AxisLeft: ({ label }: any) => <g data-testid="axis-left"><text>{label}</text></g>,
}));

jest.mock('@visx/scale', () => ({
  scaleBand: () => {
    const scale = (value: any) => 0;
    scale.domain = () => scale;
    scale.range = () => scale;
    scale.rangeRound = () => scale;
    scale.padding = () => scale;
    scale.bandwidth = () => 50;
    return scale;
  },
  scaleLinear: () => {
    const scale = (value: any) => 0;
    scale.domain = () => scale;
    scale.range = () => scale;
    return scale;
  },
  scaleOrdinal: ({ domain, range }: any) => {
    const scale = (value: any) => range[domain.indexOf(value)] || range[0];
    scale.domain = () => domain;
    scale.range = () => range;
    return scale;
  },
}));

jest.mock('@visx/grid', () => ({
  GridRows: () => <g data-testid="grid-rows" />,
}));

jest.mock('@visx/legend', () => ({
  LegendOrdinal: ({ scale, labelFormat }: any) => (
    <div data-testid="legend">
      {scale.domain().map((key: string) => (
        <span key={key}>{labelFormat(key)}</span>
      ))}
    </div>
  ),
}));

// Mock messenger
jest.mock('../../../messenger', () => ({
  on: jest.fn(() => jest.fn()),
  emit: jest.fn(),
}));

describe('RT60Chart', () => {
  const mockData: RTData[] = [
    { frequency: 125, sabine: 1.2, eyring: 1.1, ap: 1.15 },
    { frequency: 250, sabine: 1.0, eyring: 0.9, ap: 0.95 },
    { frequency: 500, sabine: 0.8, eyring: 0.7, ap: 0.75 },
    { frequency: 1000, sabine: 0.6, eyring: 0.55, ap: 0.58 },
    { frequency: 2000, sabine: 0.5, eyring: 0.45, ap: 0.48 },
    { frequency: 4000, sabine: 0.4, eyring: 0.35, ap: 0.38 },
  ];

  const originalState = useResult.getState();

  beforeEach(() => {
    useResult.setState({
      results: {
        'test-uuid': {
          kind: ResultKind.StatisticalRT60,
          name: 'RT60 Test',
          uuid: 'test-uuid',
          from: 'solver',
          info: {
            frequency: [125, 250, 500, 1000, 2000, 4000],
            airabsorption: true,
            humidity: 50,
            temperature: 20,
          },
          data: mockData,
        },
      },
      openTabIndex: 0,
      set: originalState.set,
    });
  });

  afterEach(() => {
    cleanup();
    useResult.setState(originalState);
  });

  describe('RT60Chart Component', () => {
    it('renders without crashing', () => {
      render(<RT60Chart uuid="test-uuid" />);
      expect(screen.getByText('Statistical RT60 Results')).toBeInTheDocument();
    });

    it('displays chart title', () => {
      render(<RT60Chart uuid="test-uuid" />);
      expect(screen.getByText('Statistical RT60 Results')).toBeInTheDocument();
    });

    it('renders legend with RT types', () => {
      render(<RT60Chart uuid="test-uuid" />);
      const legend = screen.getByTestId('legend');
      expect(legend).toBeInTheDocument();
    });

    it('displays Sabine in legend', () => {
      render(<RT60Chart uuid="test-uuid" />);
      expect(screen.getByText('Sabine')).toBeInTheDocument();
    });

    it('displays Norris-Eyring in legend', () => {
      render(<RT60Chart uuid="test-uuid" />);
      expect(screen.getByText('Norris-Eyring')).toBeInTheDocument();
    });

    it('displays Arau-Puchades in legend', () => {
      render(<RT60Chart uuid="test-uuid" />);
      expect(screen.getByText('Arau-Puchades')).toBeInTheDocument();
    });

    it('returns null for very small width', () => {
      const { container } = render(<RT60Chart uuid="test-uuid" width={5} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Chart Component', () => {
    it('renders SVG element', () => {
      render(<Chart uuid="test-uuid" />);
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with default dimensions', () => {
      render(<Chart uuid="test-uuid" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '500');
      expect(svg).toHaveAttribute('height', '300');
    });

    it('renders with custom dimensions', () => {
      render(<Chart uuid="test-uuid" width={800} height={400} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '800');
      expect(svg).toHaveAttribute('height', '400');
    });

    it('renders bar group', () => {
      render(<Chart uuid="test-uuid" />);
      expect(screen.getByTestId('bar-group')).toBeInTheDocument();
    });

    it('renders grid rows', () => {
      render(<Chart uuid="test-uuid" />);
      expect(screen.getByTestId('grid-rows')).toBeInTheDocument();
    });

    it('renders bottom axis with frequency label', () => {
      render(<Chart uuid="test-uuid" />);
      expect(screen.getByText('Octave Band (Hz)')).toBeInTheDocument();
    });

    it('renders left axis with RT label', () => {
      render(<Chart uuid="test-uuid" />);
      expect(screen.getByText('Reverberation Time (s)')).toBeInTheDocument();
    });

    it('returns null for very small width', () => {
      const { container } = render(<Chart uuid="test-uuid" width={5} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('handles single frequency data', () => {
      useResult.setState({
        results: {
          'single-uuid': {
            kind: ResultKind.StatisticalRT60,
            name: 'Single Freq',
            uuid: 'single-uuid',
            from: 'solver',
            info: {
              frequency: [1000],
              airabsorption: false,
              humidity: 50,
              temperature: 20,
            },
            data: [{ frequency: 1000, sabine: 1.0, eyring: 0.9, ap: 0.95 }],
          },
        },
        openTabIndex: 0,
        set: originalState.set,
      });

      render(<RT60Chart uuid="single-uuid" />);
      expect(screen.getByText('Statistical RT60 Results')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('accepts events prop', () => {
      render(<RT60Chart uuid="test-uuid" events={true} />);
      expect(screen.getByText('Statistical RT60 Results')).toBeInTheDocument();
    });

    it('works without events prop', () => {
      render(<RT60Chart uuid="test-uuid" events={false} />);
      expect(screen.getByText('Statistical RT60 Results')).toBeInTheDocument();
    });
  });
});
