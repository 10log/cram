import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
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
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";

const HeaderContainer = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${(props) => (props.$expanded ? "#e8ecef" : "transparent")};
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #e8ecef;
  }
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  color: #5c6670;

  svg {
    font-size: 16px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  color: #5c6670;

  svg {
    font-size: 14px;
  }
`;

const Title = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #1c2127;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: none;
  background: transparent;
  padding: 0;
  color: #8c959f;
  opacity: 0;
  cursor: pointer;

  svg {
    font-size: 14px;
  }

  ${HeaderContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #d0d7de;
    color: #1c2127;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ActionButton = styled.div<{ $disabled?: boolean; $calculating?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  border-radius: 3px;
  color: ${(props) => (props.$disabled ? "#c0c0c0" : "#8c959f")};
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  pointer-events: ${(props) => (props.$disabled ? "none" : "auto")};

  svg {
    font-size: 14px;
    animation: ${(props) => (props.$calculating ? spin : "none")} 1s linear infinite;
  }

  &:hover {
    background-color: ${(props) => (props.$disabled ? "transparent" : "#d0d7de")};
    color: ${(props) => (props.$disabled ? "#c0c0c0" : "#1c2127")};
  }
`;

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
  "beamtrace": TimelineIcon,
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
    <HeaderContainer $expanded={expanded} onClick={onToggle}>
      <ExpandIcon>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</ExpandIcon>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Title>{name}</Title>
      {onCalculate && (
        <ActionButton
          $disabled={!canCalculate || isCalculating}
          $calculating={isCalculating}
          onClick={handleCalculateClick}
          title={isCalculating ? "Calculating..." : "Calculate"}
        >
          <PlayArrowIcon />
        </ActionButton>
      )}
      {onClear && (
        <ActionButton
          $disabled={isCalculating}
          onClick={handleClearClick}
          title="Clear"
        >
          <ClearIcon />
        </ActionButton>
      )}
      {(onDelete || onDuplicate) && (
        <>
          <MenuButton
            type="button"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </MenuButton>
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
    </HeaderContainer>
  );
}
