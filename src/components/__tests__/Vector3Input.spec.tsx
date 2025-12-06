/**
 * Vector3Input Component Tests
 *
 * Tests for the Vector3Input component used throughout the application
 * for 3D vector property editing (x, y, z coordinates).
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Vector3Input, { Vector3InputProps } from '../vector3-input/Vector3Input';

describe('Vector3Input', () => {
  const defaultProps: Vector3InputProps = {
    id: 'testVector',
    value: [0, 0, 0],
    min: -100,
    max: 100,
    step: 1,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders three number inputs for x, y, z', () => {
      render(<Vector3Input {...defaultProps} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs).toHaveLength(3);
    });

    it('renders a container div', () => {
      const { container } = render(<Vector3Input {...defaultProps} />);
      const containerDiv = container.querySelector('.vector3-input-container');
      expect(containerDiv).toBeInTheDocument();
    });

    it('renders inputs with correct ids', () => {
      render(<Vector3Input {...defaultProps} id="pos" />);
      expect(document.getElementById('pos-x')).toBeInTheDocument();
      expect(document.getElementById('pos-y')).toBeInTheDocument();
      expect(document.getElementById('pos-z')).toBeInTheDocument();
    });

    it('initializes inputs with provided values', () => {
      render(<Vector3Input {...defaultProps} value={[1, 2, 3]} step={1} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs[0]).toHaveValue(1);
      expect(inputs[1]).toHaveValue(2);
      expect(inputs[2]).toHaveValue(3);
    });

    it('applies vector3-input-number class to all inputs', () => {
      render(<Vector3Input {...defaultProps} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveClass('vector3-input-number');
      });
    });
  });

  describe('Input Constraints', () => {
    it('sets min attribute on all inputs', () => {
      render(<Vector3Input {...defaultProps} min={-50} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('min', '-50');
      });
    });

    it('sets max attribute on all inputs', () => {
      render(<Vector3Input {...defaultProps} max={50} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('max', '50');
      });
    });

    it('sets step attribute on all inputs', () => {
      render(<Vector3Input {...defaultProps} step={0.5} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('step', '0.5');
      });
    });
  });

  describe('Form Submission', () => {
    it('calls onChange when form is submitted', () => {
      const handleChange = jest.fn();
      render(<Vector3Input {...defaultProps} onChange={handleChange} />);

      // Get the first form and submit it
      const forms = document.querySelectorAll('form');
      fireEvent.submit(forms[0]);

      expect(handleChange).toHaveBeenCalled();
    });

    it('passes clamped values in onChange', () => {
      const handleChange = jest.fn();
      render(<Vector3Input {...defaultProps} min={0} max={10} onChange={handleChange} />);

      const inputs = screen.getAllByRole('spinbutton');
      // Set value outside max range
      fireEvent.change(inputs[0], { target: { value: '15' } });

      const forms = document.querySelectorAll('form');
      fireEvent.submit(forms[0]);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.arrayContaining([10, expect.any(Number), expect.any(Number)]),
        })
      );
    });

    it('clamps negative values to min', () => {
      const handleChange = jest.fn();
      render(<Vector3Input {...defaultProps} min={0} max={100} onChange={handleChange} />);

      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[1], { target: { value: '-50' } });

      const forms = document.querySelectorAll('form');
      fireEvent.submit(forms[1]);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.arrayContaining([expect.any(Number), 0, expect.any(Number)]),
        })
      );
    });

    it('prevents default form submission', () => {
      render(<Vector3Input {...defaultProps} />);

      const forms = document.querySelectorAll('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

      forms[0].dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
    });
  });

  describe('Decimal Precision', () => {
    it('formats values based on step precision (integer step)', () => {
      render(<Vector3Input {...defaultProps} value={[1.234, 2.567, 3.891]} step={1} />);
      const inputs = screen.getAllByRole('spinbutton');
      // With step=1, should be formatted as integers
      expect(inputs[0]).toHaveValue(1);
      expect(inputs[1]).toHaveValue(3); // Rounded
      expect(inputs[2]).toHaveValue(4); // Rounded
    });

    it('formats values with decimal step precision', () => {
      render(<Vector3Input {...defaultProps} value={[1.25, 2.75, 3.5]} step={0.01} />);
      const inputs = screen.getAllByRole('spinbutton');
      // The inputs should show decimal values
      expect(inputs[0]).toHaveValue(1.25);
      expect(inputs[1]).toHaveValue(2.75);
      expect(inputs[2]).toHaveValue(3.5);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero values', () => {
      render(<Vector3Input {...defaultProps} value={[0, 0, 0]} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs[0]).toHaveValue(0);
      expect(inputs[1]).toHaveValue(0);
      expect(inputs[2]).toHaveValue(0);
    });

    it('handles negative values', () => {
      render(<Vector3Input {...defaultProps} value={[-1, -2, -3]} step={1} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs[0]).toHaveValue(-1);
      expect(inputs[1]).toHaveValue(-2);
      expect(inputs[2]).toHaveValue(-3);
    });

    it('handles very small step values', () => {
      render(<Vector3Input {...defaultProps} step={0.001} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('step', '0.001');
      });
    });

    it('handles large values', () => {
      render(<Vector3Input {...defaultProps} value={[999, 888, 777]} min={0} max={1000} step={1} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs[0]).toHaveValue(999);
      expect(inputs[1]).toHaveValue(888);
      expect(inputs[2]).toHaveValue(777);
    });
  });

  describe('Type Attributes', () => {
    it('all inputs have type="number"', () => {
      render(<Vector3Input {...defaultProps} />);
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('type', 'number');
      });
    });
  });

  describe('Form noValidate', () => {
    it('forms have noValidate attribute', () => {
      render(<Vector3Input {...defaultProps} />);
      const forms = document.querySelectorAll('form');
      forms.forEach((form) => {
        expect(form).toHaveAttribute('noValidate');
      });
    });
  });
});
