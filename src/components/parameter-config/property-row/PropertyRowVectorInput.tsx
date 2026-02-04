import React, { useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const styledInputSx: SxProps<Theme> = {
  width: "30%",
  ml: "0.5em",
  textAlign: "center",
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

export const PropertyRowVectorInput = ({ value, onChange, step = 1, min, max }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Store latest values in refs so the wheel handler always has current values
  const valueRef = useRef(value);
  const stepRef = useRef(step);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);

  // Keep refs in sync
  valueRef.current = value;
  stepRef.current = step;
  minRef.current = min;
  maxRef.current = max;
  onChangeRef.current = onChange;

  // Use non-passive wheel listener to allow preventDefault
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? stepRef.current : -stepRef.current;
      let newValue = valueRef.current + delta;
      if (minRef.current !== undefined) newValue = Math.max(minRef.current, newValue);
      if (maxRef.current !== undefined) newValue = Math.min(maxRef.current, newValue);
      if (!Number.isNaN(newValue)) {
        onChangeRef.current({ value: newValue });
      }
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, []);

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
      ref={inputRef}
      onChange={handleChange}
      value={value}
      step={step}
      min={min}
      max={max}
      sx={styledInputSx}
    />
  );
};
