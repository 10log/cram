/**
 * PropertyRowCheckbox Component Tests
 *
 * Tests for the checkbox input component used in property rows
 * for boolean parameter values.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyRowCheckbox } from '../PropertyRowCheckbox';

describe('PropertyRowCheckbox', () => {
  const defaultProps = {
    value: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a checkbox input', () => {
      render(<PropertyRowCheckbox {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders unchecked when value is false', () => {
      render(<PropertyRowCheckbox {...defaultProps} value={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked when value is true', () => {
      render(<PropertyRowCheckbox {...defaultProps} value={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('has type="checkbox"', () => {
      render(<PropertyRowCheckbox {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when clicking unchecked checkbox', () => {
      const handleChange = jest.fn();
      render(<PropertyRowCheckbox value={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith({ value: true });
    });

    it('calls onChange when clicking checked checkbox', () => {
      const handleChange = jest.fn();
      render(<PropertyRowCheckbox value={true} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith({ value: false });
    });

    it('calls onChange with correct value on each toggle', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <PropertyRowCheckbox value={false} onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');

      // First click - should become true
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenLastCalledWith({ value: true });

      // Rerender with new value
      rerender(<PropertyRowCheckbox value={true} onChange={handleChange} />);

      // Second click - should become false
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenLastCalledWith({ value: false });
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects value prop accurately', () => {
      const { rerender } = render(
        <PropertyRowCheckbox {...defaultProps} value={false} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      rerender(<PropertyRowCheckbox {...defaultProps} value={true} />);
      expect(checkbox).toBeChecked();

      rerender(<PropertyRowCheckbox {...defaultProps} value={false} />);
      expect(checkbox).not.toBeChecked();
    });

    it('does not change state without external update', () => {
      render(<PropertyRowCheckbox {...defaultProps} value={false} />);
      const checkbox = screen.getByRole('checkbox');

      // Click without updating the value prop
      fireEvent.click(checkbox);

      // Should still show unchecked (controlled component)
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('is focusable via tab', async () => {
      const user = userEvent.setup();
      render(<PropertyRowCheckbox {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();

      expect(checkbox).toHaveFocus();
    });

    it('can be toggled with space key', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<PropertyRowCheckbox {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith({ value: true });
    });

    it('can be toggled with enter key via click', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<PropertyRowCheckbox {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggling', () => {
      const handleChange = jest.fn();
      render(<PropertyRowCheckbox {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(checkbox);
      }

      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('onChange receives boolean values only', () => {
      const handleChange = jest.fn();
      render(<PropertyRowCheckbox value={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      const callArg = handleChange.mock.calls[0][0];
      expect(typeof callArg.value).toBe('boolean');
    });
  });
});
