import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import Label from "../../label/Label";

const propertyRowLabelContainerSx: SxProps<Theme> = {
  textAlign: "right",
  minWidth: "100px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

export interface PropertyRowLabelProps {
  label: string;
  tooltip?: string;
  hasToolTip?: boolean;
}

export default function PropertyRowLabel(props: PropertyRowLabelProps) {
  return (
    <Box sx={propertyRowLabelContainerSx}>
      <Label hasTooltip={props.hasToolTip} tooltipText={props.tooltip || ""}>
        {props.label}
      </Label>
    </Box>
  );
}
