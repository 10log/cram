import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

const propertyRowButtonContainerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-around",
};

const styledButtonSx: SxProps<Theme> = {
  ml: "0.5em",
  mr: "0.5em",
  borderRadius: "0.25rem",
  mt: "0.125em",
  mb: "0.125em",
  width: "100%",
  color: "#212529",
  bgcolor: "#f8f9fa",
  borderColor: "#f8f9fa",
  userSelect: "none",
  border: "1px solid transparent",
  textTransform: "none",
  "&:hover": {
    color: "#212529",
    bgcolor: "#e2e6ea",
    borderColor: "#dae0e5",
  },
  "&:active": {
    color: "#212529",
    bgcolor: "#dae0e5",
    borderColor: "#d3d9df",
  },
  "&:disabled": {
    color: "#676f78",
    bgcolor: "#c3c5c7",
    borderColor: "#d3d9df",
  },
};

export interface PropertyRowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  label: string;
}

export default function PropertyRowButton({ label, onClick, disabled }: PropertyRowButtonProps) {
  return (
    <Box sx={propertyRowButtonContainerSx}>
      <Button sx={styledButtonSx} onClick={onClick} disabled={disabled}>
        {label}
      </Button>
    </Box>
  );
}
