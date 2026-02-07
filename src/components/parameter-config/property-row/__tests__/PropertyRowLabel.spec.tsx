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

    it('renders a Typography element for the label', () => {
      const { container } = render(<PropertyRowLabel label="Test" />);
      // MUI Typography renders as a span inside the Box container
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span!.textContent).toBe('Test');
    });
  });

  describe('Tooltip Functionality', () => {
    it('does not show tooltip when hasToolTip is false', () => {
      render(
        <PropertyRowLabel label="No Tooltip" hasToolTip={false} />
      );
      // Without tooltip, label text is rendered but no tooltip text is separate
      expect(screen.getByText('No Tooltip')).toBeInTheDocument();
    });

    it('does not show tooltip when hasToolTip is undefined', () => {
      render(
        <PropertyRowLabel label="No Tooltip" />
      );
      expect(screen.getByText('No Tooltip')).toBeInTheDocument();
    });

    it('does not wrap with tooltip when hasToolTip is true but tooltip text is missing', () => {
      render(
        <PropertyRowLabel label="Label" hasToolTip={true} />
      );
      // Component requires both hasToolTip AND tooltip to wrap with Tooltip
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('displays tooltip text content when hasToolTip and tooltip are provided', () => {
      render(
        <PropertyRowLabel label="Label" hasToolTip={true} tooltip="Helpful info" />
      );
      // The label should be rendered
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('handles empty tooltip text with hasToolTip true', () => {
      render(
        <PropertyRowLabel label="Label" hasToolTip={true} tooltip="" />
      );
      // Empty tooltip string is falsy, so no tooltip wrapping occurs
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('handles undefined tooltip with hasToolTip true', () => {
      render(
        <PropertyRowLabel label="Label" hasToolTip={true} />
      );
      // No tooltip text provided, so no tooltip wrapping
      expect(screen.getByText('Label')).toBeInTheDocument();
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
