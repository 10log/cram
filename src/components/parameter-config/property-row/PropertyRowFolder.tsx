import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const propertyRowFolderLabelSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  py: 0.5,
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    bgcolor: "action.hover",
  },
};

const propertyRowFolderContainerSx: SxProps<Theme> = {
  pb: 0.5,
};

const propertyRowFolderContentsSx: SxProps<Theme> = {
  pt: 0.5,
  pb: 0.5,
};

const folderLabelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "text.primary",
};

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
        {props.open ? (
          <ExpandMoreIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        ) : (
          <ChevronRightIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        )}
        <Typography sx={folderLabelTextSx}>{props.label}</Typography>
      </Box>
      <Collapse in={props.open}>
        <Box sx={propertyRowFolderContentsSx}>{props.children}</Box>
      </Collapse>
    </Box>
  );
}
