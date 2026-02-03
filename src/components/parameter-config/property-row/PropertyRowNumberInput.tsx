import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const styledInputSx: SxProps<Theme> = {
  ml: "0.5em",
  mr: "0.5em",
  outline: "none",
  border: "none",
  borderRadius: "2px",
  bgcolor: "rgba(246, 248, 250, 0.75)",
  p: "0 10px",
  verticalAlign: "middle",
  color: "#182026",
  transition: "box-shadow 0.05s cubic-bezier(0.4, 1, 0.75, 0.9)",
  appearance: "none",
  // Hide spin buttons
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    m: 0,
  },
  MozAppearance: "textfield",
  "&:hover": {
    outline: "none",
    boxShadow:
      "0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2)",
    bgcolor: "rgba(246, 248, 250, 1.0)",
  },
  "&:focus": {
    boxShadow:
      "0 0 0 0 rgba(19,124,189,0), 0 0 0 0 rgba(19,124,189,0), inset 0 0 0 1px rgba(16,22,26,.15), inset 0 1px 1px rgba(16,22,26,.2)",
    bgcolor: "rgba(246, 248, 250, 0.75)",
  },
};

interface Props {
  value: number;
  onChange: ({ value }: { value: number }) => void;
  step?: number;
  min?: number;
  max?: number;
}

export const PropertyRowNumberInput = ({ value, onChange, step = 1, min, max }: Props) => {
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLInputElement>) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? step : -step;
      let newValue = value + delta;
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);
      if (!Number.isNaN(newValue)) {
        onChange({ value: newValue });
      }
    },
    [value, step, min, max, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.valueAsNumber;
      if (!Number.isNaN(newValue)) {
        onChange({ value: newValue });
      }
    },
    [onChange]
  );

  return (
    <Box
      component="input"
      type="number"
      onChange={handleChange}
      onWheel={handleWheel}
      value={value}
      step={step}
      min={min}
      max={max}
      sx={styledInputSx}
    />
  );
};

// Export for reuse in other components
export const StyledInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <Box component="input" sx={styledInputSx} {...props} />
);
