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
    onOpenClose: jest.fn(),
    children: <div data-testid="folder-content">Folder Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

    it('hides content when closed', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );
      // Content container should have hidden attribute
      const contentContainer = container.querySelector('[hidden]');
      expect(contentContainer).toBeInTheDocument();
    });

    it('shows content when open', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={true} />
      );
      // Content container should not have hidden attribute
      const contentContainers = container.querySelectorAll('[hidden]');
      expect(contentContainers.length).toBe(0);
    });

    it('applies max-content height when open', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={true} />
      );
      // Find the content div by checking style
      const contentDivs = container.querySelectorAll('div');
      const hasMaxContent = Array.from(contentDivs).some(
        div => div.style.height === 'max-content'
      );
      expect(hasMaxContent).toBe(true);
    });
  });

  describe('onOpenClose Handler', () => {
    it('calls onOpenClose when label is clicked', () => {
      const handleOpenClose = jest.fn();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      expect(handleOpenClose).toHaveBeenCalledTimes(1);
    });

    it('passes id to onOpenClose when provided', () => {
      const handleOpenClose = jest.fn();
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
      const handleOpenClose = jest.fn();
      render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      expect(handleOpenClose).toHaveBeenCalledWith(undefined);
    });

    it('clicking icon area also triggers onOpenClose', () => {
      const handleOpenClose = jest.fn();
      const { container } = render(
        <PropertyRowFolder {...defaultProps} onOpenClose={handleOpenClose} />
      );

      // Click on the icon's parent span
      const iconSpan = container.querySelector('span');
      fireEvent.click(iconSpan!);

      expect(handleOpenClose).toHaveBeenCalled();
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects open prop changes', () => {
      const { container, rerender } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );

      expect(container.querySelector('[hidden]')).toBeInTheDocument();

      rerender(<PropertyRowFolder {...defaultProps} open={true} />);

      expect(container.querySelector('[hidden]')).not.toBeInTheDocument();
    });

    it('does not change state without external update', () => {
      const { container } = render(
        <PropertyRowFolder {...defaultProps} open={false} />
      );

      const label = screen.getByText('Settings');
      fireEvent.click(label);

      // Should still be closed (controlled component)
      expect(container.querySelector('[hidden]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('label area is clickable', async () => {
      const handleOpenClose = jest.fn();
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
      const handleOpenClose = jest.fn();
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
