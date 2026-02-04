import React, { useCallback, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

const numberInputSx: SxProps<Theme> = {
  ml: 1,
  mr: 1,
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    height: 24,
  },
  "& .MuiInputBase-input": {
    py: 0.5,
    px: 1,
    textAlign: "center",
    // Hide spin buttons
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      m: 0,
    },
    MozAppearance: "textfield",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
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
    <TextField
      inputRef={inputRef}
      type="number"
      size="small"
      variant="outlined"
      value={value}
      onChange={handleChange}
      slotProps={{
        htmlInput: {
          step,
          min,
          max,
        },
      }}
      sx={numberInputSx}
    />
  );
};

export default PropertyRowNumberInput;
