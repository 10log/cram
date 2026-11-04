/**
 * #90: typing a negative number (or clearing the field) was undone at once,
 * because the input was driven straight from the stored number.
 */
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { parseNumberDraft } from '../use-number-draft';
import { PropertyRowNumberInput } from '../../parameter-config/property-row/PropertyRowNumberInput';

describe('parseNumberDraft', () => {
  it.each(['', ' ', '-', '+', '.', '-.', '1e', 'abc', 'Infinity', '-Infinity'])('treats %j as not-a-number-yet', (t) => {
    expect(parseNumberDraft(t)).toBeNull();
  });

  it.each([
    ['-9.6', -9.6],
    ['-9.', -9],
    ['.5', 0.5],
    ['0', 0],
    ['-0', -0],
    [' 12 ', 12],
    ['1e5', 100000],
  ])('parses %j as %d', (t, n) => {
    expect(parseNumberDraft(t)).toBe(n);
  });
});

/** Parent that feeds the committed value back in, as the stores do. */
function Controlled({ initial, onCommit }: { initial: number; onCommit: (v: number) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <PropertyRowNumberInput
      value={value}
      onChange={({ value }) => {
        onCommit(value);
        setValue(value);
      }}
    />
  );
}

describe('PropertyRowNumberInput keeps typed text (#90)', () => {
  it('an emptied field stays empty while focused instead of snapping back', () => {
    const onCommit = vi.fn();
    render(<Controlled initial={3.7} onCommit={onCommit} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    // Before #90 the controlled value (3.7) was written straight back here.
    expect(input.value).toBe('');
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('a negative value typed after clearing is committed and shown', () => {
    const onCommit = vi.fn();
    render(<Controlled initial={3.7} onCommit={onCommit} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } }); // "-" sanitises to ""
    fireEvent.change(input, { target: { value: '-9' } });
    fireEvent.change(input, { target: { value: '-9.6' } });

    expect(onCommit).toHaveBeenLastCalledWith(-9.6);
    expect(input.value).toBe('-9.6');
    fireEvent.blur(input);
    expect(input.value).toBe('-9.6');
  });

  it('blur with an unparsable draft shows the stored value again', () => {
    render(<Controlled initial={3.7} onCommit={vi.fn()} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(input.value).toBe('3.7');
  });

  it.each(['Enter', 'Escape'])('%s drops the draft', (key) => {
    render(<Controlled initial={3.7} onCommit={vi.fn()} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key });
    expect(input.value).toBe('3.7');
  });

  it('a wheel step replaces the draft with the stepped stored value', () => {
    const onCommit = vi.fn();
    render(<Controlled initial={2} onCommit={onCommit} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.wheel(input, { deltaY: 100 });
    expect(onCommit).toHaveBeenLastCalledWith(1);
    expect(input.value).toBe('1');
  });
});
