/**
 * ColorInput Component Tests
 *
 * Tests for the ColorInput component used throughout the application
 * for color property editing.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorInput, ColorInputProps } from '../ColorInput';

describe('ColorInput', () => {
  const defaultProps: ColorInputProps = {
    name: 'testColor',
    value: '#000000',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a color input element', () => {
      render(<ColorInput {...defaultProps} />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toBeInTheDocument();
    });

    it('renders with the correct value', () => {
      render(<ColorInput {...defaultProps} value="#ff0000" />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input.value).toBe('#ff0000');
    });

    it('renders inside a div wrapper', () => {
      const { container } = render(<ColorInput {...defaultProps} />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.querySelector('input[type="color"]')).toBeInTheDocument();
    });

    it('sets the name attribute', () => {
      render(<ColorInput {...defaultProps} name="colorPicker" />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toHaveAttribute('name', 'colorPicker');
    });

    it('applies className when provided', () => {
      render(<ColorInput {...defaultProps} className="custom-color" />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toHaveClass('custom-color');
    });

    it('applies empty string className when not provided', () => {
      render(<ColorInput {...defaultProps} />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toHaveAttribute('class', '');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when color changes', () => {
      const handleChange = vi.fn();
      render(<ColorInput {...defaultProps} onChange={handleChange} />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '#ff0000' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes the native event to onChange', () => {
      const handleChange = vi.fn();
      render(<ColorInput {...defaultProps} onChange={handleChange} />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '#00ff00' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.any(Object),
        })
      );
    });

    it('can access the new color value from event', () => {
      const handleChange = vi.fn();
      render(<ColorInput {...defaultProps} onChange={handleChange} />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '#0000ff' } });

      // The event is called with a synthetic event object
      expect(handleChange).toHaveBeenCalled();
      const event = handleChange.mock.calls[0][0];
      expect(event.target).toBeDefined();
    });
  });

  describe('Type Attribute', () => {
    it('has type="color"', () => {
      render(<ColorInput {...defaultProps} />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toHaveAttribute('type', 'color');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<ColorInput {...defaultProps} />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;

      await user.tab();

      expect(input).toHaveFocus();
    });
  });

  describe('Color Values', () => {
    it('handles hex color values', () => {
      render(<ColorInput {...defaultProps} value="#abcdef" />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input.value).toBe('#abcdef');
    });

    it('handles lowercase hex values', () => {
      render(<ColorInput {...defaultProps} value="#abc123" />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;
      expect(input.value).toBe('#abc123');
    });

    it('handles uppercase hex values', () => {
      render(<ColorInput {...defaultProps} value="#ABC123" />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;
      // Browsers normalize to lowercase
      expect(input.value.toLowerCase()).toBe('#abc123');
    });

    it('handles common color values', () => {
      const colors = [
        '#ff0000', // red
        '#00ff00', // green
        '#0000ff', // blue
        '#ffffff', // white
        '#000000', // black
      ];

      colors.forEach((color) => {
        const { unmount } = render(<ColorInput {...defaultProps} value={color} />);
        const input = document.querySelector('input[type="color"]') as HTMLInputElement;
        expect(input.value).toBe(color);
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple color changes', () => {
      const handleChange = vi.fn();
      render(<ColorInput {...defaultProps} onChange={handleChange} />);
      const input = document.querySelector('input[type="color"]') as HTMLInputElement;

      // Multiple distinct changes
      fireEvent.change(input, { target: { value: '#111111' } });
      fireEvent.change(input, { target: { value: '#222222' } });
      fireEvent.change(input, { target: { value: '#333333' } });

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('works without className prop', () => {
      render(<ColorInput {...defaultProps} />);
      const input = document.querySelector('input[type="color"]');
      expect(input).toBeInTheDocument();
    });
  });
});
