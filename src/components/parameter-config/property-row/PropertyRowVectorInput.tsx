import React, { useCallback } from "react";
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 30%;
  margin-left: .5em;
  text-align: center;
  outline: none;
  border: none;
  border-radius: 2px;
  background: rgba(246, 248, 250, 0.75);
  padding: 0 10px;
  vertical-align: middle;
  color: #182026;
  -webkit-transition: -webkit-box-shadow .05s cubic-bezier(.4,1,.75,.9);
  -webkit-transition: box-shadow .05s cubic-bezier(.4,1,.75,.9);
  transition: box-shadow .05s cubic-bezier(.4,1,.75,.9);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Hide spin buttons */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  :hover{
    outline: none;
    box-shadow: 0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2);
    background: rgba(246, 248, 250, 1.0);
  }
  :focus{
    box-shadow: 0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2);
    background: rgba(246, 248, 250, 0.75);
  }
`;


interface Props {
  value: number;
  onChange: ({ value }: {value: number }) => void;
  step?: number;
  min?: number;
  max?: number;
}

export const PropertyRowVectorInput = ({ value, onChange, step = 1, min, max }: Props) => {
  const handleWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? step : -step;
    let newValue = value + delta;
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);
    if (!Number.isNaN(newValue)) {
      onChange({ value: newValue });
    }
  }, [value, step, min, max, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.valueAsNumber;
    if (!Number.isNaN(newValue)) {
      onChange({ value: newValue });
    }
  }, [onChange]);

  return (
    <StyledInput
      type="number"
      onChange={handleChange}
      onWheel={handleWheel}
      value={value}
      step={step}
      min={min}
      max={max}
    />
  );
}

