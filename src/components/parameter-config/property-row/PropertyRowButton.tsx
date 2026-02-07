import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

const propertyRowButtonContainerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-around",
};

const styledButtonSx: SxProps<Theme> = {
  mx: 1,
  my: 0.25,
  width: "100%",
  fontSize: "0.75rem",
  textTransform: "none",
  py: 0.25,
  minHeight: 24,
};

export interface PropertyRowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  label: string;
}

export default function PropertyRowButton({ label, onClick, disabled, ...rest }: PropertyRowButtonProps) {
  return (
    <Box sx={propertyRowButtonContainerSx}>
      <Button
        variant="outlined"
        size="small"
        color="inherit"
        sx={styledButtonSx}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {label}
      </Button>
    </Box>
  );
}
