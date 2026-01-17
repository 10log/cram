/**
 * TextInput Component Tests
 *
 * Tests for the TextInput component used throughout the application
 * for text property editing.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput, TextInputProps } from '../text-input/TextInput';

describe('TextInput', () => {
  const defaultProps: TextInputProps = {
    name: 'testInput',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders an input element', () => {
      render(<TextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with the correct value', () => {
      render(<TextInput {...defaultProps} value="hello" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('hello');
    });

    it('renders with empty value', () => {
      render(<TextInput {...defaultProps} value="" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('applies the text-input class', () => {
      render(<TextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-input');
    });

    it('sets the name attribute', () => {
      render(<TextInput {...defaultProps} name="myInput" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'myInput');
    });
  });

  describe('Input Constraints', () => {
    it('can be disabled', () => {
      render(<TextInput {...defaultProps} disabled={true} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('is enabled by default', () => {
      render(<TextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes correct event structure to onChange', () => {
      const handleChange = vi.fn();
      render(
        <TextInput
          {...defaultProps}
          name="testName"
          id="testId"
          onChange={handleChange}
        />
      );
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'hello world' } });

      expect(handleChange).toHaveBeenCalledWith({
        value: 'hello world',
        name: 'testName',
        id: 'testId',
        type: 'text',
      });
    });

    it('uses name as id fallback when id not provided', () => {
      const handleChange = vi.fn();
      render(
        <TextInput
          {...defaultProps}
          name="testName"
          onChange={handleChange}
        />
      );
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'testName',
        })
      );
    });

    it('handles empty string input', () => {
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} value="existing" onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '',
        })
      );
    });

    it('handles special characters', () => {
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '<script>alert("xss")</script>',
        })
      );
    });

    it('handles unicode characters', () => {
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '你好世界 🎵' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '你好世界 🎵',
        })
      );
    });
  });

  describe('Type Attribute', () => {
    it('has type="text"', () => {
      render(<TextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<TextInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      await user.tab();

      expect(input).toHaveFocus();
    });

    it('supports keyboard input', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.type(input, 'hello');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long strings', () => {
      const handleChange = vi.fn();
      const longString = 'a'.repeat(10000);
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: longString } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: longString,
        })
      );
    });

    it('handles whitespace-only input', () => {
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '   ' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '   ',
        })
      );
    });

    it('handles tab characters in input', () => {
      // Note: Single-line text inputs strip newlines in browsers
      const handleChange = vi.fn();
      render(<TextInput {...defaultProps} onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'col1\tcol2' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'col1\tcol2',
        })
      );
    });
  });
});
