import React from "react";
import Checkbox from "@mui/material/Checkbox";
import type { SxProps, Theme } from "@mui/material/styles";

const styledCheckboxSx: SxProps<Theme> = {
  ml: "0.5em",
  mt: "1px",
  p: 0,
  "& .MuiSvgIcon-root": {
    fontSize: 16,
  },
};

interface Props {
  value: boolean;
  onChange: ({ value }: { value: boolean }) => void;
}

export const PropertyRowCheckbox = ({ value, onChange }: Props) => (
  <Checkbox
    checked={value}
    onChange={(e) => onChange({ value: e.currentTarget.checked })}
    sx={styledCheckboxSx}
    size="small"
  />
);

export default PropertyRowCheckbox;
