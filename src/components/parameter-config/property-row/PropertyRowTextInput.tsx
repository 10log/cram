import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const styledTextInputSx: SxProps<Theme> = {
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
  value: string;
  onChange: ({ value }: { value: string }) => void;
}

export const PropertyRowTextInput = ({ value, onChange }: Props) => (
  <Box
    component="input"
    type="text"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ value: e.currentTarget.value })}
    value={value}
    sx={styledTextInputSx}
  />
);
