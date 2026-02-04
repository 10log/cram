import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SxProps, Theme } from "@mui/material/styles";

const selectSx: SxProps<Theme> = {
  ml: 1,
  mr: 1,
  fontSize: "0.75rem",
  height: 24,
  "& .MuiSelect-select": {
    py: 0.25,
    px: 1,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
};

const menuItemSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  py: 0.5,
};

interface Props {
  value: string;
  onChange: ({ value }: { value: string }) => void;
  options: { value: string; label: string }[];
}

export const PropertyRowSelect = ({ value, onChange, options }: Props) => {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
      sx={selectSx}
    >
      {options.map(({ value, label }, i) => (
        <MenuItem value={value} key={`${value}-${label}-${i}`} sx={menuItemSx}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PropertyRowSelect;
