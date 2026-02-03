/**
 * SliderInput Component Tests
 *
 * Tests for the SliderInput component used throughout the application
 * for range/slider-based property editing.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SliderInput, { SliderInputProps } from '../slider-input/SliderInput';

describe('SliderInput', () => {
  const defaultProps: SliderInputProps = {
    id: 'testSlider',
    value: 50,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a range input element', () => {
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('renders with the correct initial value', () => {
      render(<SliderInput {...defaultProps} value={75} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('75');
    });

    it('applies the slider-input class', () => {
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('slider-input');
    });

    it('applies additional className when provided', () => {
      render(<SliderInput {...defaultProps} className="custom-slider" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('slider-input');
      expect(slider).toHaveClass('custom-slider');
    });

    it('sets the id attribute', () => {
      render(<SliderInput {...defaultProps} id="mySlider" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('id', 'mySlider');
    });
  });

  describe('Input Constraints', () => {
    it('sets min attribute when provided with non-zero value', () => {
      // Note: The component uses `props.min && ...` which is falsy for 0
      render(<SliderInput {...defaultProps} min={10} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '10');
    });

    it('sets max attribute when provided', () => {
      render(<SliderInput {...defaultProps} max={100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('max', '100');
    });

    it('sets step attribute when provided', () => {
      render(<SliderInput {...defaultProps} step={5} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('step', '5');
    });

    it('does not set min when not provided', () => {
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('min');
    });

    it('does not set max when not provided', () => {
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('max');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<SliderInput {...defaultProps} onChange={handleChange} />);
      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '60' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with input event', () => {
      const handleChange = vi.fn();
      render(<SliderInput {...defaultProps} onChange={handleChange} />);
      const slider = screen.getByRole('slider');

      fireEvent.input(slider, { target: { value: '70' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('receives the raw event object', () => {
      const handleChange = vi.fn();
      render(<SliderInput {...defaultProps} onChange={handleChange} />);
      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '80' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.any(Object),
        })
      );
    });
  });

  describe('Type Attribute', () => {
    it('has type="range"', () => {
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('type', 'range');
    });
  });

  describe('Accessibility', () => {
    it('is focusable via tab', async () => {
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} />);
      const slider = screen.getByRole('slider');

      await user.tab();

      expect(slider).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero value', () => {
      render(<SliderInput {...defaultProps} value={0} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('0');
    });

    it('handles negative values', () => {
      render(<SliderInput {...defaultProps} value={-50} min={-100} max={100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('-50');
    });

    it('handles decimal values', () => {
      render(<SliderInput {...defaultProps} value={0.5} min={0} max={1} step={0.1} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('0.5');
    });

    it('handles decimal step values', () => {
      render(<SliderInput {...defaultProps} step={0.01} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('step', '0.01');
    });
  });
});
