/**
 * PropertyRowFolder Component Tests
 *
 * Tests for the collapsible folder component used in property rows
 * to organize grouped settings.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyRowFolder from '../PropertyRowFolder';

describe('PropertyRowFolder', () => {
  const defaultProps = {
    label: 'Settings',
    open: false,
    onOpenClose: vi.fn(),
    children: <div data-testid="folder-content">Folder Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the label', () => {
      render(<PropertyRowFolder {...defaultProps} />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<PropertyRowFolder {...defaultProps} />);
      expect(screen.getByTestId('folder-content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <PropertyRowFolder {...defaultProps}>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </PropertyRowFolder>
      );
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('Open/Close State', () => {
    it('shows chevron right icon when closed', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );
      // MUI ChevronRightIcon should be present when closed
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('shows expand more icon when open', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={true} />
      );
      // MUI ExpandMoreIcon should be present when open
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('collapses content when closed', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );
      // MUI Collapse sets height to 0px when closed
      const collapseWrapper = container.querySelector('.MuiCollapse-root');
      expect(collapseWrapper).toBeInTheDocument();
      expect(collapseWrapper).toHaveStyle({ height: '0px' });
    });

    it('expands content when open', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={true} />
      );
      // MUI Collapse does not have height: 0px when open
      const collapseWrapper = container.querySelector('.MuiCollapse-root');
      expect(collapseWrapper).toBeInTheDocument();
      expect(collapseWrapper).not.toHaveStyle({ height: '0px' });
    });

    it('collapse has entered class when open', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={true} />
      );
      const collapseWrapper = container.querySelector('.MuiCollapse-root');
      expect(collapseWrapper).toBeInTheDocument();
      expect(collapseWrapper!.classList.toString()).toContain('entered');
    });
  });

  describe('onOpenClose Handler', () => {
    it('calls onOpenClose when label is clicked', () => {
      const handleOpenClose = vi.fn();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      expect(handleOpenClose).toHaveBeenCalledTimes(1);
    });

    it('passes id to onOpenClose when provided', () => {
      const handleOpenClose = vi.fn();
      render(
        <PropertyRowFolder
          {...defaultProps}
          id="settings-folder"
          onOpenClose={handleOpenClose}
        />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      expect(handleOpenClose).toHaveBeenCalledWith('settings-folder');
    });

    it('passes undefined to onOpenClose when id not provided', () => {
      const handleOpenClose = vi.fn();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      expect(handleOpenClose).toHaveBeenCalledWith(undefined);
    });

    it('clicking icon area also triggers onOpenClose', () => {
      const handleOpenClose = vi.fn();
      const { container } = render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      // Click on the SVG icon
      const svgIcon = container.querySelector('svg');
      fireEvent.click(svgIcon!);

      expect(handleOpenClose).toHaveBeenCalled();
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects open prop changes', () => {
      const { container, rerender } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );

      const collapseWrapper = container.querySelector('.MuiCollapse-root');
      expect(collapseWrapper).toBeInTheDocument();
      // When closed, the Collapse wrapper has the hidden class
      expect(collapseWrapper!.classList.toString()).toContain('hidden');

      rerender(<PropertyRowFolder {...defaultProps} open={true} />);

      // When open, the Collapse no longer has the hidden class
      expect(collapseWrapper!.classList.toString()).not.toContain('hidden');
    });

    it('does not change state without external update', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      // Should still be collapsed (controlled component)
      const collapseWrapper = container.querySelector('.MuiCollapse-root');
      expect(collapseWrapper).toHaveStyle({ height: '0px' });
    });
  });

  describe('Accessibility', () => {
    it('label area is clickable', async () => {
      const handleOpenClose = vi.fn();
      const user = userEvent.setup();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');
      await user.click(label);

      expect(handleOpenClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(
        <PropertyRowFolder {...defaultProps}>
          {null}
        </PropertyRowFolder>
      );
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('handles long label text', () => {
      const longLabel = 'This is a very long folder label text';
      render(<PropertyRowFolder {...defaultProps} label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      render(
        <PropertyRowFolder {...defaultProps} label="Settings & Options" />
      );
      expect(screen.getByText('Settings & Options')).toBeInTheDocument();
    });

    it('handles rapid open/close toggling', () => {
      const handleOpenClose = vi.fn();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(label);
      }

      expect(handleOpenClose).toHaveBeenCalledTimes(5);
    });
  });
});
