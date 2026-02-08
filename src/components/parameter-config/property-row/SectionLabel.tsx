import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

const sectionLabelSx: SxProps<Theme> = {
  py: 0.5,
  borderBottom: "1px solid",
  borderColor: "divider",
};

const sectionLabelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "text.secondary",
  pl: "4px",
};

export interface SectionLabelProps {
  label: string;
}

export default function SectionLabel({ label }: SectionLabelProps) {
  return (
    <Box sx={sectionLabelSx}>
      <Typography sx={sectionLabelTextSx}>{label}</Typography>
    </Box>
  );
}
