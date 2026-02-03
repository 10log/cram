/**
 * NumberInput Component Tests
 *
 * Tests for the NumberInput component used throughout the application
 * for numeric property editing.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput, NumberInputProps } from '../number-input/NumberInput';

describe('NumberInput', () => {
  const defaultProps: NumberInputProps = {
    name: 'testInput',
    value: 0,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders an input element', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('renders with the correct value', () => {
      render(<NumberInput {...defaultProps} value={42} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(42);
    });

    it('renders with string value converted to number display', () => {
      render(<NumberInput {...defaultProps} value="123" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(123);
    });

    it('applies the number-input class', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveClass('number-input');
    });

    it('applies additional className when provided', () => {
      render(<NumberInput {...defaultProps} className="custom-class" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveClass('number-input');
      expect(input).toHaveClass('custom-class');
    });

    it('sets the name attribute', () => {
      render(<NumberInput {...defaultProps} name="myInput" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('name', 'myInput');
    });

    it('sets the id attribute when provided', () => {
      render(<NumberInput {...defaultProps} id="input-id" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('id', 'input-id');
    });
  });

  describe('Input Constraints', () => {
    it('sets min attribute when provided', () => {
      render(<NumberInput {...defaultProps} min={0} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
    });

    it('sets max attribute when provided', () => {
      render(<NumberInput {...defaultProps} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('max', '100');
    });

    it('sets step attribute when provided', () => {
      render(<NumberInput {...defaultProps} step={0.1} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.1');
    });

    it('can be disabled', () => {
      render(<NumberInput {...defaultProps} disabled={true} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });

    it('is enabled by default', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('applies custom style when provided', () => {
      const customStyle = { width: '100px' };
      render(<NumberInput {...defaultProps} style={customStyle} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveStyle({ width: '100px' });
    });

    it('passes style prop to input element', () => {
      const customStyle = { width: '200px', padding: '10px' };
      render(<NumberInput {...defaultProps} style={customStyle} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('style');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes correct event structure to onChange', () => {
      const handleChange = vi.fn();
      render(
        <NumberInput
          {...defaultProps}
          name="testName"
          id="testId"
          onChange={handleChange}
        />
      );
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '42' } });

      expect(handleChange).toHaveBeenCalledWith({
        value: 42,
        name: 'testName',
        id: 'testId',
        type: 'number',
      });
    });

    it('converts string input to number in onChange', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '123.45' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 123.45,
        })
      );
    });

    it('handles negative numbers', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '-50' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: -50,
        })
      );
    });

    it('handles zero', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 0,
        })
      );
    });

    it('handles empty input (Number("") returns 0)', () => {
      // Note: Number('') returns 0 in JavaScript, not NaN
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 0,
        })
      );
    });
  });

  describe('Type Attribute', () => {
    it('has type="number"', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');

      await user.tab();

      expect(input).toHaveFocus();
    });

    it('supports keyboard input', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      await user.click(input);
      await user.clear(input);
      await user.type(input, '99');

      // userEvent triggers multiple change events
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '999999999999' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 999999999999,
        })
      );
    });

    it('handles scientific notation', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '1e10' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 1e10,
        })
      );
    });

    it('handles decimal precision', () => {
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '0.123456789' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 0.123456789,
        })
      );
    });
  });
});
