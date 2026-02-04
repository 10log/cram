import React from "react";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

const textInputSx: SxProps<Theme> = {
  ml: 1,
  mr: 1,
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    height: 24,
  },
  "& .MuiInputBase-input": {
    py: 0.5,
    px: 1,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
};

interface Props {
  value: string;
  onChange: ({ value }: { value: string }) => void;
}

export const PropertyRowTextInput = ({ value, onChange }: Props) => (
  <TextField
    type="text"
    size="small"
    variant="outlined"
    value={value}
    onChange={(e) => onChange({ value: e.currentTarget.value })}
    sx={textInputSx}
  />
);

export default PropertyRowTextInput;
