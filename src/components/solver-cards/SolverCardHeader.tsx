import React, { useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ClearIcon from "@mui/icons-material/Clear";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot"; // Ray Tracer
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Image Source
import GridOnIcon from "@mui/icons-material/GridOn"; // FDTD
import BarChartIcon from "@mui/icons-material/BarChart"; // RT60
import GraphicEqIcon from "@mui/icons-material/GraphicEq"; // Energy Decay
import BlurOnIcon from "@mui/icons-material/BlurOn"; // ART
import SettingsIcon from "@mui/icons-material/Settings"; // Renderer
import TimelineIcon from "@mui/icons-material/Timeline"; // Beam Trace
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const headerContainerSx = (expanded: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: "4px 8px",
  bgcolor: expanded ? "#e8ecef" : "transparent",
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    bgcolor: "#e8ecef",
  },
  "&:hover .menu-button": {
    opacity: 1,
  },
});

const expandIconSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  mr: "4px",
  color: "#5c6670",
  "& svg": {
    fontSize: 16,
  },
};

const iconContainerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  mr: "6px",
  color: "#5c6670",
  "& svg": {
    fontSize: 14,
  },
};

const titleSx: SxProps<Theme> = {
  flex: 1,
  fontSize: 12,
  fontWeight: 500,
  color: "#1c2127",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const menuButtonSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  borderRadius: "3px",
  border: "none",
  background: "transparent",
  p: 0,
  color: "#8c959f",
  opacity: 0,
  cursor: "pointer",
  "& svg": {
    fontSize: 14,
  },
  "&:hover": {
    bgcolor: "#d0d7de",
    color: "#1c2127",
  },
};

const actionButtonSx = (disabled: boolean, calculating: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  mr: "4px",
  borderRadius: "3px",
  color: disabled ? "#c0c0c0" : "#8c959f",
  cursor: disabled ? "default" : "pointer",
  pointerEvents: disabled ? "none" : "auto",
  "& svg": {
    fontSize: 14,
    animation: calculating ? `${spin} 1s linear infinite` : "none",
  },
  "&:hover": {
    bgcolor: disabled ? "transparent" : "#d0d7de",
    color: disabled ? "#c0c0c0" : "#1c2127",
  },
});

/**
 * Maps solver kind to its icon component
 */
const SolverIconMap: Record<string, React.ElementType> = {
  "ray-tracer": ScatterPlotIcon,
  "image-source": AccountTreeIcon,
  "fdtd-2d": GridOnIcon,
  "rt60": BarChartIcon,
  "energydecay": GraphicEqIcon,
  "art": BlurOnIcon,
  "renderer": SettingsIcon,
  "beam-trace": TimelineIcon,
};

export interface SolverCardHeaderProps {
  name: string;
  kind: string;
  expanded: boolean;
  canCalculate?: boolean;
  isCalculating?: boolean;
  onToggle: () => void;
  onCalculate?: () => void;
  onClear?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export default function SolverCardHeader({
  name,
  kind,
  expanded,
  canCalculate = false,
  isCalculating = false,
  onToggle,
  onCalculate,
  onClear,
  onDelete,
  onDuplicate,
}: SolverCardHeaderProps) {
  const Icon = SolverIconMap[kind] || ScatterPlotIcon;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleCalculateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCalculate?.();
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDuplicate = () => {
    handleMenuClose();
    onDuplicate?.();
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.();
  };

  return (
    <Box sx={headerContainerSx(expanded)} onClick={onToggle}>
      <Box sx={expandIconSx}>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</Box>
      <Box sx={iconContainerSx}>
        <Icon />
      </Box>
      <Box sx={titleSx}>{name}</Box>
      {onCalculate && (
        <Box
          sx={actionButtonSx(!canCalculate || isCalculating, isCalculating)}
          onClick={handleCalculateClick}
          title={isCalculating ? "Calculating..." : "Calculate"}
        >
          <PlayArrowIcon />
        </Box>
      )}
      {onClear && (
        <Box
          sx={actionButtonSx(isCalculating, false)}
          onClick={handleClearClick}
          title="Clear"
        >
          <ClearIcon />
        </Box>
      )}
      {(onDelete || onDuplicate) && (
        <>
          <Box
            component="button"
            type="button"
            className="menu-button"
            sx={menuButtonSx}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {onDuplicate && (
              <MenuItem onClick={handleDuplicate}>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Duplicate</ListItemText>
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </Box>
  );
}
