import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export interface GridRowProps {
  label?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  span?: number;
  style?: React.CSSProperties;
}

const labelSx: SxProps<Theme> = {
  display: "grid",
  gridColumnStart: 1,
  gridColumnEnd: 2,
  textAlign: "end",
};

const inputContainerSx: SxProps<Theme> = {
  display: "grid",
  gridColumnStart: 2,
  gridColumnEnd: 3,
};

export default function GridRow(props: GridRowProps) {
  return (
    <Fragment>
      <Box sx={labelSx}>{props.label}</Box>
      <Box sx={inputContainerSx}>{props.children}</Box>
    </Fragment>
  );
}
