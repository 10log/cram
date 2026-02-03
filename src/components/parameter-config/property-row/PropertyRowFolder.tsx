import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Label from "../../label/Label";

const propertyRowFolderLabelSx: SxProps<Theme> = {
  "&:hover": {
    bgcolor: "#eaeef1",
    cursor: "pointer",
    userSelect: "none",
  },
};

const propertyRowFolderContainerSx: SxProps<Theme> = {
  "--transition-time": "50ms",
  "--folder-contents-shadow-top": "inset 0px 15px 10px -15px rgba(221, 226, 230, 0.5)",
  "--folder-contents-shadow-bottom": "inset 0px -15px 10px -15px rgba(221, 226, 230, 0.5)",
  "--transition-function": "cubic-bezier(0.25, 0.1, 0.25, 1)",
  pb: "0.25em",
};

const propertyRowFolderContentsSx = (open: boolean): SxProps<Theme> => ({
  height: open ? "max-content" : 0,
  pt: open ? "0.5em" : 0,
  pb: open ? "0.5em" : 0,
  overflow: "hidden",
  transition: "all 50ms cubic-bezier(0.25, 0.1, 0.25, 1)",
});

export interface PropertyRowFolderProps {
  label: string;
  open: boolean;
  children: React.ReactNode;
  id?: string;
  onOpenClose: (id?: string) => void;
}

export default function PropertyRowFolder(props: PropertyRowFolderProps) {
  return (
    <Box sx={propertyRowFolderContainerSx}>
      <Box sx={propertyRowFolderLabelSx} onClick={() => props.onOpenClose(props.id)}>
        <span style={{ verticalAlign: "middle" }}>
          {props.open ? <ExpandMoreIcon fontSize="inherit" /> : <ChevronRightIcon fontSize="inherit" />}
        </span>
        <Label hasTooltip={false} style={{ display: "inline-block" }}>
          {props.label}
        </Label>
      </Box>
      <Box sx={propertyRowFolderContentsSx(props.open)}>{props.children}</Box>
    </Box>
  );
}
