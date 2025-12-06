/**
 * PropertyRowLabel Component Tests
 *
 * Tests for the label component used in property rows
 * with optional tooltip support.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyRowLabel from '../PropertyRowLabel';

describe('PropertyRowLabel', () => {
  describe('Rendering', () => {
    it('renders the label text', () => {
      render(<PropertyRowLabel label="Test Label" />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with empty label', () => {
      render(<PropertyRowLabel label="" />);
      // Should render without error
      expect(document.body).toBeInTheDocument();
    });

    it('renders long label text', () => {
      const longLabel = 'This is a very long label text for testing';
      render(<PropertyRowLabel label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('renders label with special characters', () => {
      render(<PropertyRowLabel label="Label & Special <chars>" />);
      expect(screen.getByText('Label & Special <chars>')).toBeInTheDocument();
    });
  });

  describe('Container Structure', () => {
    it('wraps label in a container', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toBeInstanceOf(HTMLDivElement);
    });

    it('uses Label component internally', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      // The Label component adds tooltip-label class
      expect(container.querySelector('.tooltip-label')).toBeInTheDocument();
    });
  });

  describe('Tooltip Functionality', () => {
    it('does not show tooltip when hasToolTip is false', () => {
      const { container } = render(
        <PropertyRowLabel label="No Tooltip" hasToolTip={false} />
      );
      expect(container.querySelector('.tooltiptext')).not.toBeInTheDocument();
    });

    it('does not show tooltip when hasToolTip is undefined', () => {
      const { container } = render(
        <PropertyRowLabel label="No Tooltip" />
      );
      expect(container.querySelector('.tooltiptext')).not.toBeInTheDocument();
    });

    it('shows tooltip when hasToolTip is true', () => {
      const { container } = render(
        <PropertyRowLabel label="With Tooltip" hasToolTip={true} tooltip="Tooltip text" />
      );
      expect(container.querySelector('.tooltiptext')).toBeInTheDocument();
    });

    it('displays tooltip text content', () => {
      render(
        <PropertyRowLabel label="Label" hasToolTip={true} tooltip="Helpful info" />
      );
      expect(screen.getByText('Helpful info')).toBeInTheDocument();
    });

    it('handles empty tooltip text', () => {
      const { container } = render(
        <PropertyRowLabel label="Label" hasToolTip={true} tooltip="" />
      );
      // Should still render tooltip element
      expect(container.querySelector('.tooltiptext')).toBeInTheDocument();
    });

    it('handles undefined tooltip with hasToolTip true', () => {
      const { container } = render(
        <PropertyRowLabel label="Label" hasToolTip={true} />
      );
      // Should render tooltip with empty string
      expect(container.querySelector('.tooltiptext')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies right text alignment', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({ textAlign: 'right' });
    });

    it('applies minimum width', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({ minWidth: '100px' });
    });

    it('uses flexbox layout', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({ display: 'flex' });
    });

    it('aligns items to center', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({ alignItems: 'center' });
    });

    it('justifies content to flex-end', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({ justifyContent: 'flex-end' });
    });
  });

  describe('Edge Cases', () => {
    it('handles numeric label converted to string', () => {
      // TypeScript would catch this, but testing runtime behavior
      render(<PropertyRowLabel label={'123' as string} />);
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('handles whitespace-only label', () => {
      render(<PropertyRowLabel label="   " />);
      // Should render the whitespace
      const { container } = render(<PropertyRowLabel label="   " />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles label with backslash-n literal', () => {
      // Newlines in JSX are rendered as literal \n in the DOM
      const { container } = render(<PropertyRowLabel label={'Line1\nLine2'} />);
      // Check the text contains both parts
      expect(container.textContent).toContain('Line1');
      expect(container.textContent).toContain('Line2');
    });
  });
});
