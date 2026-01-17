/**
 * PropertyRowSelect Component Tests
 *
 * Tests for the select dropdown component used in property rows
 * for choosing from a list of options.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyRowSelect } from '../PropertyRowSelect';

describe('PropertyRowSelect', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    value: 'option1',
    onChange: vi.fn(),
    options: defaultOptions,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a select element', () => {
      render(<PropertyRowSelect {...defaultProps} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders all options', () => {
      render(<PropertyRowSelect {...defaultProps} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('renders options with correct labels', () => {
      render(<PropertyRowSelect {...defaultProps} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders options with correct values', () => {
      render(<PropertyRowSelect {...defaultProps} />);
      const options = screen.getAllByRole('option') as HTMLOptionElement[];
      expect(options[0].value).toBe('option1');
      expect(options[1].value).toBe('option2');
      expect(options[2].value).toBe('option3');
    });

    it('selects the correct initial option', () => {
      render(<PropertyRowSelect {...defaultProps} value="option2" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });
  });

  describe('onChange Handler', () => {
    it('calls onChange when selection changes', () => {
      const handleChange = vi.fn();
      render(<PropertyRowSelect {...defaultProps} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      fireEvent.change(select, { target: { value: 'option2' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 'option2' });
    });

    it('calls onChange with the selected value', () => {
      const handleChange = vi.fn();
      render(<PropertyRowSelect {...defaultProps} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      fireEvent.change(select, { target: { value: 'option3' } });

      expect(handleChange).toHaveBeenCalledWith({ value: 'option3' });
    });

    it('calls onChange only once per selection', () => {
      const handleChange = vi.fn();
      render(<PropertyRowSelect {...defaultProps} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      fireEvent.change(select, { target: { value: 'option2' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects value prop accurately', () => {
      const { rerender } = render(
        <PropertyRowSelect {...defaultProps} value="option1" />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option1');

      rerender(<PropertyRowSelect {...defaultProps} value="option2" />);
      expect(select.value).toBe('option2');

      rerender(<PropertyRowSelect {...defaultProps} value="option3" />);
      expect(select.value).toBe('option3');
    });
  });

  describe('Options Handling', () => {
    it('handles single option', () => {
      const singleOption = [{ value: 'only', label: 'Only Option' }];
      render(
        <PropertyRowSelect {...defaultProps} options={singleOption} value="only" />
      );
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
    });

    it('handles many options', () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        value: `opt${i}`,
        label: `Option ${i}`,
      }));
      render(
        <PropertyRowSelect {...defaultProps} options={manyOptions} value="opt0" />
      );
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(20);
    });

    it('handles options with special characters in labels', () => {
      const specialOptions = [
        { value: 'special', label: 'Option <with> "special" chars' },
      ];
      render(
        <PropertyRowSelect
          {...defaultProps}
          options={specialOptions}
          value="special"
        />
      );
      expect(
        screen.getByText('Option <with> "special" chars')
      ).toBeInTheDocument();
    });

    it('handles options with numeric values', () => {
      const numericOptions = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
        { value: '3', label: 'Three' },
      ];
      const handleChange = vi.fn();
      render(
        <PropertyRowSelect
          value="1"
          onChange={handleChange}
          options={numericOptions}
        />
      );
      const select = screen.getByRole('combobox');

      fireEvent.change(select, { target: { value: '2' } });

      expect(handleChange).toHaveBeenCalledWith({ value: '2' });
    });
  });

  describe('Accessibility', () => {
    it('is focusable', async () => {
      const user = userEvent.setup();
      render(<PropertyRowSelect {...defaultProps} />);
      const select = screen.getByRole('combobox');

      await user.tab();

      expect(select).toHaveFocus();
    });

    it('can be navigated with keyboard', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<PropertyRowSelect {...defaultProps} onChange={handleChange} />);
      const select = screen.getByRole('combobox');

      await user.click(select);
      await user.selectOptions(select, 'option2');

      expect(handleChange).toHaveBeenCalledWith({ value: 'option2' });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      const optionsWithEmpty = [
        { value: '', label: 'Select...' },
        ...defaultOptions,
      ];
      render(
        <PropertyRowSelect
          {...defaultProps}
          options={optionsWithEmpty}
          value=""
        />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('');
    });

    it('handles duplicate labels with different values', () => {
      const duplicateLabelOptions = [
        { value: 'val1', label: 'Same Label' },
        { value: 'val2', label: 'Same Label' },
      ];
      render(
        <PropertyRowSelect
          {...defaultProps}
          options={duplicateLabelOptions}
          value="val1"
        />
      );
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
    });
  });
});
