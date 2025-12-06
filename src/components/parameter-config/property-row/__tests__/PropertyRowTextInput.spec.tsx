/**
 * PropertyRowTextInput Component Tests
 *
 * Tests for the text input component used in property rows.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyRowTextInput } from '../PropertyRowTextInput';

describe('PropertyRowTextInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a text input', () => {
      render(<PropertyRowTextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('has type="text"', () => {
      render(<PropertyRowTextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with initial value', () => {
      render(<PropertyRowTextInput {...defaultProps} value="initial text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial text');
    });

    it('renders with empty value', () => {
      render(<PropertyRowTextInput {...defaultProps} value="" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when typing', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'new text' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 'new text' });
    });

    it('calls onChange with each keystroke', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, { value: 'a' });
      expect(handleChange).toHaveBeenNthCalledWith(2, { value: 'ab' });
      expect(handleChange).toHaveBeenNthCalledWith(3, { value: 'abc' });
    });

    it('calls onChange when clearing input', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} value="existing" onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });

      expect(handleChange).toHaveBeenCalledWith({ value: '' });
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects value prop changes', () => {
      const { rerender } = render(<PropertyRowTextInput {...defaultProps} value="first" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('first');

      rerender(<PropertyRowTextInput {...defaultProps} value="second" />);
      expect(input).toHaveValue('second');
    });

    it('value is controlled externally', () => {
      // Without updating value prop, display stays the same
      const handleChange = jest.fn();
      render(<PropertyRowTextInput value="fixed" onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'changed' } });

      // onChange was called, but value stays the same (controlled)
      expect(handleChange).toHaveBeenCalledWith({ value: 'changed' });
      expect(input).toHaveValue('fixed');
    });
  });

  describe('User Interaction', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<PropertyRowTextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      await user.tab();

      expect(input).toHaveFocus();
    });

    it('allows typing text', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.type(input, 'hello');

      // Each character triggers onChange
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('allows selecting all text', async () => {
      const user = userEvent.setup();
      render(<PropertyRowTextInput {...defaultProps} value="select me" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.click(input);
      await user.keyboard('{Control>}a{/Control}');

      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(9);
    });
  });

  describe('Special Characters', () => {
    it('handles special characters', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });

      expect(handleChange).toHaveBeenCalledWith({ value: '<script>alert("xss")</script>' });
    });

    it('handles unicode characters', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '日本語 🎉' } });

      expect(handleChange).toHaveBeenCalledWith({ value: '日本語 🎉' });
    });

    it('handles text with spaces', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      // Single-line text inputs strip newlines, so test spaces instead
      fireEvent.change(input, { target: { value: 'line1 line2' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 'line1 line2' });
    });
  });

  describe('Edge Cases', () => {
    it('handles very long text', () => {
      const longText = 'a'.repeat(1000);
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: longText } });

      expect(handleChange).toHaveBeenCalledWith({ value: longText });
    });

    it('handles whitespace-only input', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '   ' } });

      expect(handleChange).toHaveBeenCalledWith({ value: '   ' });
    });

    it('handles rapid typing', () => {
      const handleChange = jest.fn();
      render(<PropertyRowTextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      // Simulate rapid typing
      for (let i = 0; i < 50; i++) {
        fireEvent.change(input, { target: { value: `text${i}` } });
      }

      expect(handleChange).toHaveBeenCalledTimes(50);
    });
  });
});
