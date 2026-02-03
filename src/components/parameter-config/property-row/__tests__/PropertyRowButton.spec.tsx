/**
 * PropertyRowButton Component Tests
 *
 * Tests for the button component used in property rows
 * for triggering actions.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyRowButton from '../PropertyRowButton';

describe('PropertyRowButton', () => {
  const defaultProps = {
    label: 'Click Me',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a button element', () => {
      render(<PropertyRowButton {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('displays the label text', () => {
      render(<PropertyRowButton {...defaultProps} label="Submit" />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('renders inside a container', () => {
      const { container } = render(<PropertyRowButton {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button.parentElement).toBeInTheDocument();
    });
  });

  describe('onClick Handler', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<PropertyRowButton {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event to onClick handler', () => {
      const handleClick = vi.fn();
      render(<PropertyRowButton {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
        })
      );
    });

    it('handles multiple clicks', () => {
      const handleClick = vi.fn();
      render(<PropertyRowButton {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Button Attributes', () => {
    it('can be disabled', () => {
      render(<PropertyRowButton {...defaultProps} disabled={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <PropertyRowButton {...defaultProps} onClick={handleClick} disabled={true} />
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('accepts additional HTML button attributes', () => {
      render(
        <PropertyRowButton
          {...defaultProps}
          type="submit"
          name="submitBtn"
          data-testid="custom-button"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submitBtn');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<PropertyRowButton {...defaultProps} />);
      const button = screen.getByRole('button');

      await user.tab();

      expect(button).toHaveFocus();
    });

    it('can be activated with Enter key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<PropertyRowButton {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');

      await user.tab();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('can be activated with Space key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<PropertyRowButton {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');

      await user.tab();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      render(<PropertyRowButton {...defaultProps} label="" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('handles long label text', () => {
      const longLabel = 'This is a very long button label that might wrap';
      render(<PropertyRowButton {...defaultProps} label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      render(<PropertyRowButton {...defaultProps} label="Save & Continue →" />);
      expect(screen.getByText('Save & Continue →')).toBeInTheDocument();
    });
  });
});
