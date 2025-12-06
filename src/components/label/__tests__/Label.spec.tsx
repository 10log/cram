/**
 * Label Component Tests
 *
 * Tests for the Label component used throughout the application
 * to display text with optional tooltips.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Label from '../Label';

describe('Label', () => {
  describe('Rendering', () => {
    it('renders children text', () => {
      render(<Label>Test Label</Label>);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders children elements', () => {
      render(
        <Label>
          <span data-testid="child">Child Element</span>
        </Label>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders without children', () => {
      const { container } = render(<Label />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies custom style', () => {
      const { container } = render(
        <Label style={{ color: 'red' }}>Styled Label</Label>
      );
      const labelDiv = container.firstChild as HTMLElement;
      // toHaveStyle normalizes colors to rgb format
      expect(labelDiv).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  describe('Tooltip Functionality', () => {
    it('does not render tooltip when hasTooltip is false', () => {
      render(<Label hasTooltip={false}>No Tooltip</Label>);
      expect(screen.queryByText('tooltiptext')).not.toBeInTheDocument();
    });

    it('does not render tooltip when hasTooltip is undefined', () => {
      render(<Label>No Tooltip</Label>);
      const { container } = render(<Label>Test</Label>);
      expect(container.querySelector('.tooltiptext')).not.toBeInTheDocument();
    });

    it('renders tooltip span when hasTooltip is true', () => {
      const { container } = render(
        <Label hasTooltip={true} tooltipText="Tooltip content">
          With Tooltip
        </Label>
      );
      expect(container.querySelector('.tooltiptext')).toBeInTheDocument();
    });

    it('displays tooltip text', () => {
      render(
        <Label hasTooltip={true} tooltipText="This is helpful info">
          Hover me
        </Label>
      );
      expect(screen.getByText('This is helpful info')).toBeInTheDocument();
    });

    it('renders tooltip arrow when hasTooltip is true', () => {
      const { container } = render(
        <Label hasTooltip={true} tooltipText="Info">
          Label
        </Label>
      );
      expect(container.querySelector('.tooltip-text-arrow')).toBeInTheDocument();
    });

    it('applies tooltip class to container when hasTooltip is true', () => {
      const { container } = render(
        <Label hasTooltip={true} tooltipText="Info">
          Label
        </Label>
      );
      expect(container.firstChild).toHaveClass('tooltip');
    });

    it('does not apply tooltip class when hasTooltip is false', () => {
      const { container } = render(
        <Label hasTooltip={false}>Label</Label>
      );
      expect(container.firstChild).not.toHaveClass('tooltip');
    });
  });

  describe('Mouse Events', () => {
    it('handles mouse over without tooltip', () => {
      const { container } = render(<Label>Hover Label</Label>);
      const labelDiv = container.querySelector('.tooltip-label');

      // Should not throw
      expect(() => {
        fireEvent.mouseOver(labelDiv!);
      }).not.toThrow();
    });

    it('handles mouse leave without tooltip', () => {
      const { container } = render(<Label>Hover Label</Label>);
      const labelDiv = container.querySelector('.tooltip-label');

      // Should not throw
      expect(() => {
        fireEvent.mouseLeave(labelDiv!);
      }).not.toThrow();
    });

    it('tooltip element exists with hasTooltip true', () => {
      // Note: Mouse over positioning logic uses getClientRects() which
      // returns empty in jsdom, so we test the structure instead
      const { container } = render(
        <Label hasTooltip={true} tooltipText="Info">
          Hover Label
        </Label>
      );
      const tooltipText = container.querySelector('.tooltiptext');
      expect(tooltipText).toBeInTheDocument();
      expect(tooltipText?.textContent).toContain('Info');
    });

    it('handles mouse leave with tooltip', () => {
      const { container } = render(
        <Label hasTooltip={true} tooltipText="Info">
          Hover Label
        </Label>
      );
      const labelDiv = container.querySelector('.tooltip-label');

      // Should not throw and should hide tooltip
      fireEvent.mouseLeave(labelDiv!);

      const tooltipText = container.querySelector('.tooltiptext');
      expect(tooltipText).toHaveAttribute('style', expect.stringContaining('hidden'));
    });
  });

  describe('Structure', () => {
    it('renders tooltip-label div for children', () => {
      const { container } = render(<Label>Content</Label>);
      expect(container.querySelector('.tooltip-label')).toBeInTheDocument();
    });

    it('places children inside tooltip-label div', () => {
      const { container } = render(<Label>My Content</Label>);
      const labelDiv = container.querySelector('.tooltip-label');
      expect(labelDiv?.textContent).toBe('My Content');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tooltipText', () => {
      const { container } = render(
        <Label hasTooltip={true} tooltipText="">
          Label
        </Label>
      );
      expect(container.querySelector('.tooltiptext')).toBeInTheDocument();
    });

    it('handles long tooltip text', () => {
      const longText = 'This is a very long tooltip text that might wrap to multiple lines and should still render correctly';
      render(
        <Label hasTooltip={true} tooltipText={longText}>
          Label
        </Label>
      );
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in tooltip', () => {
      render(
        <Label hasTooltip={true} tooltipText="<b>Bold</b> & special chars">
          Label
        </Label>
      );
      expect(screen.getByText('<b>Bold</b> & special chars')).toBeInTheDocument();
    });
  });
});
