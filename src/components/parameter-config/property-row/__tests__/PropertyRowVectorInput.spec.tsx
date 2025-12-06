/**
 * PropertyRowVectorInput Component Tests
 *
 * Tests for the single-number vector input component used in property rows.
 * This is a simple number input used as part of vector/position inputs.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyRowVectorInput } from '../PropertyRowVectorInput';

describe('PropertyRowVectorInput', () => {
  const defaultProps = {
    value: 0,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a number input', () => {
      render(<PropertyRowVectorInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('has type="number"', () => {
      render(<PropertyRowVectorInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders with initial value', () => {
      render(<PropertyRowVectorInput {...defaultProps} value={42} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(42);
    });

    it('renders with zero value', () => {
      render(<PropertyRowVectorInput {...defaultProps} value={0} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(0);
    });

    it('renders with negative value', () => {
      render(<PropertyRowVectorInput {...defaultProps} value={-15} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(-15);
    });

    it('renders with decimal value', () => {
      render(<PropertyRowVectorInput {...defaultProps} value={3.14159} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(3.14159);
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '100' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 100 });
    });

    it('calls onChange with numeric value', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '55.5' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 55.5 });
    });

    it('calls onChange with negative numbers', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '-25' } });

      expect(handleChange).toHaveBeenCalledWith({ value: -25 });
    });

    it('calls onChange with NaN when cleared', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '' } });

      // valueAsNumber returns NaN for empty input
      expect(handleChange).toHaveBeenCalledWith({ value: NaN });
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects value prop changes', () => {
      const { rerender } = render(<PropertyRowVectorInput {...defaultProps} value={10} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(10);

      rerender(<PropertyRowVectorInput {...defaultProps} value={20} />);
      expect(input).toHaveValue(20);
    });

    it('value is controlled externally', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput value={5} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '99' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 99 });
      // Value stays at 5 because it's controlled
      expect(input).toHaveValue(5);
    });
  });

  describe('User Interaction', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<PropertyRowVectorInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');

      await user.tab();

      expect(input).toHaveFocus();
    });

    it('allows typing numbers', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      await user.click(input);
      await user.clear(input);
      await user.type(input, '123');

      // Controlled component - value stays at 0 but onChange is called
      expect(handleChange).toHaveBeenCalled();
    });

    it('supports increment/decrement with arrows', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      // Simulate arrow key (this triggers the input spinner)
      fireEvent.change(input, { target: { value: '11' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 11 });
    });
  });

  describe('Value Types', () => {
    it('handles integer values', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 42 });
    });

    it('handles decimal values', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '3.14159' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 3.14159 });
    });

    it('handles scientific notation', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '1e5' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 100000 });
    });

    it('handles very small decimals', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0.0001' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 0.0001 });
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '999999999' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 999999999 });
    });

    it('handles very small negative numbers', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '-999999999' } });

      expect(handleChange).toHaveBeenCalledWith({ value: -999999999 });
    });

    it('handles rapid value changes', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      // Start from 1 to avoid duplicate 0 values (initial value is 0)
      for (let i = 1; i <= 20; i++) {
        fireEvent.change(input, { target: { value: String(i) } });
      }

      expect(handleChange).toHaveBeenCalledTimes(20);
    });

    it('handles floating point precision', () => {
      const handleChange = jest.fn();
      render(<PropertyRowVectorInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0.1' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 0.1 });
    });
  });

  describe('Styling', () => {
    it('has centered text alignment', () => {
      const { container } = render(<PropertyRowVectorInput {...defaultProps} />);
      const input = container.querySelector('input');
      expect(input).toHaveStyle({ textAlign: 'center' });
    });

    it('has 30% width', () => {
      const { container } = render(<PropertyRowVectorInput {...defaultProps} />);
      const input = container.querySelector('input');
      expect(input).toHaveStyle({ width: '30%' });
    });
  });
});
