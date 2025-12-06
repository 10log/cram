/**
 * ProgressIndicator Component Tests
 *
 * Tests for the ProgressIndicator component that displays
 * a floating progress bar during long-running operations.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from '../ProgressIndicator';
import { useAppStore } from '../../store/app-store';

// Mock the app store
jest.mock('../../store/app-store', () => ({
  useAppStore: jest.fn(),
}));

const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;

describe('ProgressIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('returns null when not visible', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: false,
            message: '',
            progress: -1,
            solverUuid: undefined,
          },
        } as any)
      );

      const { container } = render(<ProgressIndicator />);
      expect(container.firstChild).toBeNull();
    });

    it('renders when visible', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Loading...',
            progress: 50,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Progress Display', () => {
    it('shows message text', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Calculating impulse response...',
            progress: 25,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('Calculating impulse response...')).toBeInTheDocument();
    });

    it('shows percentage for determinate progress', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Processing...',
            progress: 75,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('does not show percentage for indeterminate progress', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Loading...',
            progress: -1,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Should not have percentage text
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });

    it('rounds percentage to whole number', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Processing...',
            progress: 33.7,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('34%')).toBeInTheDocument();
    });
  });

  describe('Progress Values', () => {
    it('handles 0% progress', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Starting...',
            progress: 0,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles 100% progress', () => {
      mockUseAppStore.mockImplementation((selector) =>
        selector({
          progress: {
            visible: true,
            message: 'Complete!',
            progress: 100,
            solverUuid: undefined,
          },
        } as any)
      );

      render(<ProgressIndicator />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});
