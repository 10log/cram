/**
 * PropertyRowNumberInput Component Tests
 *
 * Tests for the number input component used in property rows.
 * This component has local state and only commits on blur.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyRowNumberInput } from '../PropertyRowNumberInput';

describe('PropertyRowNumberInput', () => {
  const defaultProps = {
    value: 0,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a number input', () => {
      render(<PropertyRowNumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(<PropertyRowNumberInput {...defaultProps} value={42} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(42);
    });

    it('has type="number"', () => {
      render(<PropertyRowNumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('sets step attribute when provided', () => {
      render(<PropertyRowNumberInput {...defaultProps} step={0.1} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.1');
    });
  });

  describe('Local State Management', () => {
    it('updates local value on change without calling onChange', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '50' } });

      // Value should update visually
      expect(input).toHaveValue(50);
      // But onChange should not be called yet
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('calls onChange on blur with valid number', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '100' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 100 });
    });

    it('does not call onChange on blur with NaN', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      // Clear the input (results in NaN from valueAsNumber)
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      // Should not call onChange with NaN
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('reverts to original value on blur with NaN', () => {
      render(<PropertyRowNumberInput {...defaultProps} value={10} />);
      const input = screen.getByRole('spinbutton');

      // Clear the input
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      // Should revert to original value
      expect(input).toHaveValue(10);
    });
  });

  describe('Value Types', () => {
    it('handles integer values', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 42 });
    });

    it('handles decimal values', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} step={0.01} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '3.14' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 3.14 });
    });

    it('handles negative values', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '-50' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: -50 });
    });

    it('handles zero value', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 0 });
    });
  });

  describe('User Interaction', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<PropertyRowNumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');

      await user.tab();

      expect(input).toHaveFocus();
    });

    it('allows typing numbers', async () => {
      const user = userEvent.setup();
      render(<PropertyRowNumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');

      await user.click(input);
      await user.clear(input);
      await user.type(input, '123');

      expect(input).toHaveValue(123);
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '999999999' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 999999999 });
    });

    it('handles very small decimal numbers', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} step={0.0001} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0.0001' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 0.0001 });
    });

    it('handles scientific notation', () => {
      const handleChange = vi.fn();
      render(<PropertyRowNumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '1e5' } });
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenCalledWith({ value: 100000 });
    });
  });
});
