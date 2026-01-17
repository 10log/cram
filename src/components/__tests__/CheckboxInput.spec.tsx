/**
 * CheckboxInput Component Tests
 *
 * Tests for the CheckboxInput component used throughout the application
 * for boolean property editing.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxInput, CheckboxInputProps, CheckboxChangeEvent } from '../CheckboxInput';

describe('CheckboxInput', () => {
  const defaultProps: CheckboxInputProps = {
    name: 'testCheckbox',
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a checkbox input', () => {
      render(<CheckboxInput {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders unchecked by default when checked=false', () => {
      render(<CheckboxInput {...defaultProps} checked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked when checked=true', () => {
      render(<CheckboxInput {...defaultProps} checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders inside a label container', () => {
      render(<CheckboxInput {...defaultProps} />);
      const label = screen.getByText((_, element) => {
        return element?.classList.contains('checkbox-container') || false;
      });
      expect(label).toBeInTheDocument();
    });

    it('applies checkbox-input class to the input', () => {
      render(<CheckboxInput {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('checkbox-input');
    });

    it('sets the name attribute', () => {
      render(<CheckboxInput {...defaultProps} name="myCheckbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'myCheckbox');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when clicked', () => {
      const handleChange = vi.fn();
      render(<CheckboxInput {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes correct event structure when checking', () => {
      const handleChange = vi.fn();
      render(
        <CheckboxInput
          {...defaultProps}
          name="testName"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'testName',
          type: 'checkbox',
          value: true,
          checked: true,
        })
      );
    });

    it('passes correct event structure when unchecking', () => {
      const handleChange = vi.fn();
      render(
        <CheckboxInput
          {...defaultProps}
          name="testName"
          checked={true}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'testName',
          type: 'checkbox',
          value: false,
          checked: false,
        })
      );
    });

    it('includes value and checked properties with same boolean value', () => {
      const handleChange = vi.fn();
      render(<CheckboxInput {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);

      const callArg = handleChange.mock.calls[0][0] as CheckboxChangeEvent;
      expect(callArg.value).toBe(callArg.checked);
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects checked prop accurately', () => {
      const { rerender } = render(
        <CheckboxInput {...defaultProps} checked={false} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      rerender(<CheckboxInput {...defaultProps} checked={true} />);
      expect(checkbox).toBeChecked();

      rerender(<CheckboxInput {...defaultProps} checked={false} />);
      expect(checkbox).not.toBeChecked();
    });

    it('does not change checked state on its own (controlled)', () => {
      // In controlled mode, the component should reflect the prop value
      // even after clicking (the parent controls state)
      render(<CheckboxInput {...defaultProps} checked={false} />);
      const checkbox = screen.getByRole('checkbox');

      // Click the checkbox
      fireEvent.click(checkbox);

      // Since we're not updating the checked prop, it stays unchecked
      // (in a real app, onChange would update parent state)
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('is focusable via tab', async () => {
      const user = userEvent.setup();
      render(<CheckboxInput {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();

      expect(checkbox).toHaveFocus();
    });

    it('can be toggled with space key', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<CheckboxInput {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalled();
    });

    it('label wraps the input for better click target', () => {
      render(<CheckboxInput {...defaultProps} />);
      // The checkbox is inside a label, so clicking the label should work
      const label = document.querySelector('.checkbox-container');
      expect(label).toBeInTheDocument();
      expect(label?.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });
  });

  describe('Type Attribute', () => {
    it('has type="checkbox"', () => {
      render(<CheckboxInput {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggling', () => {
      const handleChange = vi.fn();
      render(<CheckboxInput {...defaultProps} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(checkbox);
      }

      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('works without className prop', () => {
      render(<CheckboxInput {...defaultProps} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Custom Nodes (Visual)', () => {
    // Note: The current implementation has commented-out checkedNode/uncheckedNode
    // These tests document the expected interface if enabled

    it('accepts checkedNode prop', () => {
      // Should not throw when prop is provided
      expect(() =>
        render(
          <CheckboxInput
            {...defaultProps}
            checkedNode={<span>Visible</span>}
          />
        )
      ).not.toThrow();
    });

    it('accepts uncheckedNode prop', () => {
      // Should not throw when prop is provided
      expect(() =>
        render(
          <CheckboxInput
            {...defaultProps}
            uncheckedNode={<span>Hidden</span>}
          />
        )
      ).not.toThrow();
    });
  });
});
