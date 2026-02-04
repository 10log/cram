import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { SxProps, Theme } from "@mui/material/styles";

const sliderContainerSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
  alignItems: "center",
  fontSize: "0.75rem",
  userSelect: "none",
};

const sliderLabelContainerSx: SxProps<Theme> = {
  textAlign: "right",
  minWidth: "100px",
  pr: 1,
};

const sliderLabelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: "text.secondary",
};

const sliderComponentSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  mx: 1,
};

const muiSliderSx: SxProps<Theme> = {
  flex: 1,
  mx: 0.5,
  "& .MuiSlider-thumb": {
    width: 12,
    height: 12,
  },
  "& .MuiSlider-track": {
    height: 4,
  },
  "& .MuiSlider-rail": {
    height: 4,
  },
};

const stepButtonSx: SxProps<Theme> = {
  p: 0.25,
  minWidth: 20,
  width: 20,
  height: 20,
  "& .MuiSvgIcon-root": {
    fontSize: 14,
  },
};

const numberInputSx: SxProps<Theme> = {
  width: 70,
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    height: 24,
  },
  "& .MuiInputBase-input": {
    py: 0.5,
    px: 1,
    textAlign: "center",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      m: 0,
    },
    MozAppearance: "textfield",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
};

export interface SliderChangeEvent {
  id: string;
  value: number;
}

export interface SliderProps {
  id: string;
  value: number;
  onChange: (event: SliderChangeEvent) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  tooltipText: string;
  labelPosition: "top" | "bottom" | "left" | "right";
  hasToolTip?: boolean;
}

const countDecimals = (n: number) => (Number.isInteger(n) ? 0 : n.toString().split(".").slice(-1)[0].length);
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export default function Slider({
  id,
  value,
  onChange,
  min,
  max,
  step,
  label,
  tooltipText,
  hasToolTip,
}: SliderProps) {
  const decimals = countDecimals(step);
  const [stagedValue, setStagedValue] = useState(Number(value.toFixed(decimals)));
  const [editing, setEditing] = useState(false);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const val = Array.isArray(newValue) ? newValue[0] : newValue;
      setStagedValue(val);
      onChange({ id, value: val });
    },
    [id, onChange]
  );

  const handleDecrement = useCallback(() => {
    const newValue = clamp(stagedValue - step, min, max);
    setStagedValue(newValue);
    onChange({ id, value: newValue });
  }, [id, stagedValue, step, min, max, onChange]);

  const handleIncrement = useCallback(() => {
    const newValue = clamp(stagedValue + step, min, max);
    setStagedValue(newValue);
    onChange({ id, value: newValue });
  }, [id, stagedValue, step, min, max, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setStagedValue(Number(v === "." ? "0." : v));
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditing(false);
    const newValue = clamp(Number(stagedValue.toFixed(decimals)), min, max);
    setStagedValue(newValue);
    onChange({ id, value: newValue });
  }, [id, stagedValue, decimals, min, max, onChange]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        (e.target as HTMLInputElement).blur();
      } else if (e.key === "Escape") {
        setStagedValue(value);
        (e.target as HTMLInputElement).blur();
      }
    },
    [value]
  );

  const labelElement = (
    <Typography sx={sliderLabelTextSx}>{label}</Typography>
  );

  return (
    <Box sx={sliderContainerSx}>
      <Box sx={sliderLabelContainerSx}>
        {hasToolTip && tooltipText ? (
          <Tooltip title={tooltipText} placement="left" arrow enterDelay={500}>
            {labelElement}
          </Tooltip>
        ) : (
          labelElement
        )}
      </Box>
      <Box sx={sliderComponentSx}>
        <IconButton size="small" onClick={handleDecrement} sx={stepButtonSx}>
          <RemoveIcon />
        </IconButton>
        <MuiSlider
          size="small"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          sx={muiSliderSx}
        />
        <IconButton size="small" onClick={handleIncrement} sx={stepButtonSx}>
          <AddIcon />
        </IconButton>
      </Box>
      <TextField
        type="number"
        size="small"
        variant="outlined"
        value={editing ? stagedValue : value}
        onFocus={() => {
          setStagedValue(value);
          setEditing(true);
        }}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        slotProps={{
          htmlInput: {
            min,
            max,
            step,
          },
        }}
        sx={numberInputSx}
      />
    </Box>
  );
}
