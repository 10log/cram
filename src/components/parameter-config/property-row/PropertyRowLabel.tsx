import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material/styles";

const propertyRowLabelContainerSx: SxProps<Theme> = {
  textAlign: "right",
  minWidth: "100px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

const labelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: "text.secondary",
  lineHeight: 1.5,
};

export interface PropertyRowLabelProps {
  label: string;
  tooltip?: string;
  hasToolTip?: boolean;
}

export default function PropertyRowLabel({ label, tooltip, hasToolTip }: PropertyRowLabelProps) {
  const labelElement = (
    <Typography component="span" sx={labelTextSx}>
      {label}
    </Typography>
  );

  // Only wrap with Tooltip if we have tooltip text
  if (hasToolTip && tooltip) {
    return (
      <Box sx={propertyRowLabelContainerSx}>
        <Tooltip title={tooltip} placement="left" arrow enterDelay={500}>
          {labelElement}
        </Tooltip>
      </Box>
    );
  }

  return <Box sx={propertyRowLabelContainerSx}>{labelElement}</Box>;
}
