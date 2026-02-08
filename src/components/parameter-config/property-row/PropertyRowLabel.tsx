import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { SxProps, Theme } from "@mui/material/styles";

const propertyRowLabelContainerSx: SxProps<Theme> = {
  textAlign: "right",
  minWidth: "100px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "4px",
};

const labelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  color: "text.secondary",
  lineHeight: 1.5,
};

const infoIconSx: SxProps<Theme> = {
  fontSize: 12,
  color: "text.disabled",
  cursor: "help",
};

const tooltipSx: SxProps<Theme> = {
  bgcolor: "grey.800",
  color: "common.white",
  fontSize: "0.7rem",
  lineHeight: 1.4,
  px: 1.5,
  py: 0.75,
  maxWidth: 260,
  boxShadow: 2,
};

const tooltipArrowSx: SxProps<Theme> = {
  color: "grey.800",
};

export interface PropertyRowLabelProps {
  label: string;
  tooltip?: string;
  hasToolTip?: boolean;
}

export default function PropertyRowLabel({ label, tooltip, hasToolTip }: PropertyRowLabelProps) {
  if (hasToolTip && tooltip) {
    return (
      <Box sx={propertyRowLabelContainerSx}>
        <Typography component="span" sx={labelTextSx}>
          {label}
        </Typography>
        <Tooltip
          title={tooltip}
          placement="left"
          arrow
          enterDelay={300}
          slotProps={{
            tooltip: { sx: tooltipSx },
            arrow: { sx: tooltipArrowSx },
          }}
        >
          <InfoOutlinedIcon sx={infoIconSx} />
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={propertyRowLabelContainerSx}>
      <Typography component="span" sx={labelTextSx}>
        {label}
      </Typography>
    </Box>
  );
}
