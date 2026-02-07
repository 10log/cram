/**
 * SourceReceiverMatrix Component Tests
 *
 * Tests for the SourceReceiverMatrix component that displays
 * a matrix grid for selecting source-receiver pairs.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SourceReceiverMatrix } from '../SourceReceiverMatrix';
import { useContainer } from '../../../store';
import { useSolverProperty } from '../SolverComponents';

// Mock the stores
vi.mock('../../../store', () => ({
  useContainer: vi.fn(),
}));

vi.mock('../SolverComponents', () => ({
  useSolverProperty: vi.fn(),
}));

const mockUseContainer = useContainer as jest.MockedFunction<typeof useContainer>;
const mockUseSolverProperty = useSolverProperty as jest.MockedFunction<typeof useSolverProperty>;

describe('SourceReceiverMatrix', () => {
  const defaultUuid = 'solver-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty States', () => {
    it('shows message when no sources or receivers exist', () => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('containers')) return {};
        if (selector.toString().includes('version')) return 0;
        return {};
      });
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      expect(screen.getByText('Add sources and receivers to configure pairs')).toBeInTheDocument();
    });

    it('shows message when only receivers exist', () => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return {
          'rec-1': { uuid: 'rec-1', name: 'Receiver 1', kind: 'receiver' },
        };
      });
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      expect(screen.getByText('Add sources to configure pairs')).toBeInTheDocument();
    });

    it('shows message when only sources exist', () => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return {
          'src-1': { uuid: 'src-1', name: 'Source 1', kind: 'source' },
        };
      });
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      expect(screen.getByText('Add receivers to configure pairs')).toBeInTheDocument();
    });
  });

  describe('Matrix Rendering', () => {
    const mockContainers = {
      'src-1': { uuid: 'src-1', name: 'Source 1', kind: 'source' },
      'src-2': { uuid: 'src-2', name: 'Source 2', kind: 'source' },
      'rec-1': { uuid: 'rec-1', name: 'Receiver 1', kind: 'receiver' },
      'rec-2': { uuid: 'rec-2', name: 'Receiver 2', kind: 'receiver' },
    };

    beforeEach(() => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return mockContainers;
      });
    });

    it('renders source names as row headers', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      expect(screen.getByText('Source 1')).toBeInTheDocument();
      expect(screen.getByText('Source 2')).toBeInTheDocument();
    });

    it('renders receiver names as column headers', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      // Receivers appear twice - once in header and once as title attribute
      expect(screen.getAllByText('Receiver 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Receiver 2').length).toBeGreaterThan(0);
    });

    it('renders corner cell with label', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      expect(screen.getByText('Src \\ Rec')).toBeInTheDocument();
    });

    it('renders checkboxes for each source-receiver pair', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      const checkboxes = screen.getAllByRole('checkbox');
      // 2 sources x 2 receivers = 4 checkboxes
      expect(checkboxes).toHaveLength(4);
    });

    it('checkboxes are unchecked when pair is not selected', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it('checkboxes are checked when pair is selected', () => {
      mockUseSolverProperty
        .mockReturnValueOnce([['src-1'], vi.fn()]) // sourceIDs
        .mockReturnValueOnce([['rec-1'], vi.fn()]); // receiverIDs

      render(<SourceReceiverMatrix uuid={defaultUuid} />);
      const checkboxes = screen.getAllByRole('checkbox');
      // First checkbox (src-1 + rec-1) should be checked
      expect(checkboxes[0]).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    const mockContainers = {
      'src-1': { uuid: 'src-1', name: 'Source 1', kind: 'source' },
      'rec-1': { uuid: 'rec-1', name: 'Receiver 1', kind: 'receiver' },
    };

    beforeEach(() => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return mockContainers;
      });
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);
    });

    it('applies disabled styling when disabled prop is true', () => {
      const { container } = render(<SourceReceiverMatrix uuid={defaultUuid} disabled />);
      // Check that the container has reduced opacity styling
      const matrixContainer = container.firstChild as HTMLElement;
      expect(matrixContainer).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('Event Type Prop', () => {
    const mockContainers = {
      'src-1': { uuid: 'src-1', name: 'Source 1', kind: 'source' },
      'rec-1': { uuid: 'rec-1', name: 'Receiver 1', kind: 'receiver' },
    };

    beforeEach(() => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return mockContainers;
      });
    });

    it('uses default RAYTRACER_SET_PROPERTY event type', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);

      // Check that useSolverProperty was called with default event type
      expect(mockUseSolverProperty).toHaveBeenCalledWith(
        defaultUuid,
        'sourceIDs',
        'RAYTRACER_SET_PROPERTY'
      );
    });

    it('uses custom event type when provided', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} eventType="IMAGESOURCE_SET_PROPERTY" />);

      // Check that useSolverProperty was called with custom event type
      expect(mockUseSolverProperty).toHaveBeenCalledWith(
        defaultUuid,
        'sourceIDs',
        'IMAGESOURCE_SET_PROPERTY'
      );
    });
  });

  describe('Checkbox Interactions', () => {
    const mockContainers = {
      'src-1': { uuid: 'src-1', name: 'Source 1', kind: 'source' },
      'rec-1': { uuid: 'rec-1', name: 'Receiver 1', kind: 'receiver' },
    };

    beforeEach(() => {
      mockUseContainer.mockImplementation((selector) => {
        if (selector.toString().includes('version')) return 0;
        return mockContainers;
      });
    });

    it('calls setSourceIDs and setReceiverIDs when checking a pair', () => {
      const setSourceIDs = vi.fn();
      const setReceiverIDs = vi.fn();

      mockUseSolverProperty
        .mockReturnValueOnce([[], setSourceIDs])
        .mockReturnValueOnce([[], setReceiverIDs]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setSourceIDs).toHaveBeenCalledWith({ value: ['src-1'] });
      expect(setReceiverIDs).toHaveBeenCalledWith({ value: ['rec-1'] });
    });

    it('has title attribute showing source-receiver pair', () => {
      mockUseSolverProperty.mockReturnValue([[], vi.fn()]);

      render(<SourceReceiverMatrix uuid={defaultUuid} />);

      // MUI Checkbox puts the title on the outer span wrapper, not the input
      expect(screen.getByTitle('Source 1 → Receiver 1')).toBeInTheDocument();
    });
  });
});
