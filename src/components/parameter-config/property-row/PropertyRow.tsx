import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const propertyRowContainerSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "3fr 8fr 2fr",
  userSelect: "none",
  fontSize: "9pt",
  mb: "0.125em",
  "&:last-child": {
    mb: 0,
  },
};

export interface PropertyRowProps {
  children: React.ReactNode;
}

export default function PropertyRow(props: PropertyRowProps) {
  return <Box sx={propertyRowContainerSx}>{props.children}</Box>;
}
