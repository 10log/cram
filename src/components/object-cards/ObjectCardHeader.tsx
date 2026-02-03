import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { NodesIcon, RoomIcon, SourceIcon, ReceiverIcon } from "../icons";

const headerContainerSx = (expanded: boolean, selected: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: "4px 8px",
  bgcolor: selected ? "#cce5ff" : expanded ? "#e8ecef" : "transparent",
  borderLeft: selected ? "2px solid #2d72d2" : "2px solid transparent",
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    bgcolor: selected ? "#b3d7ff" : "#e8ecef",
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

const titleInputSx: SxProps<Theme> = {
  flex: 1,
  fontSize: 12,
  fontWeight: 500,
  color: "#1c2127",
  border: "1px solid #2d72d2",
  borderRadius: "2px",
  p: "0 4px",
  outline: "none",
  bgcolor: "white",
  minWidth: 0,
};

const visibilityButtonSx = (visible: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  borderRadius: "3px",
  color: visible ? "#8c959f" : "#d0d7de",
  opacity: visible ? 0 : 1,
  "& svg": {
    fontSize: 14,
  },
  ".MuiBox-root:hover > &": {
    opacity: 1,
  },
  "&:hover": {
    bgcolor: "#d0d7de",
    color: "#1c2127",
  },
});

/**
 * Maps object kind to its icon component
 */
const ObjectIconMap: Record<string, React.ElementType> = {
  room: RoomIcon,
  source: SourceIcon,
  receiver: ReceiverIcon,
  surface: NodesIcon,
};

export interface ObjectCardHeaderProps {
  name: string;
  kind: string;
  expanded: boolean;
  selected: boolean;
  visible: boolean;
  onToggle: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onVisibilityToggle: () => void;
  onNameChange: (name: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ObjectCardHeader({
  name,
  kind,
  expanded,
  selected,
  visible,
  onToggle,
  onSelect,
  onVisibilityToggle,
  onNameChange,
  onMouseEnter,
  onMouseLeave,
}: ObjectCardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = ObjectIconMap[kind] || NodesIcon;

  useEffect(() => {
    setEditValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onSelect(e);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVisibilityToggle();
  };

  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== name) {
      onNameChange(editValue.trim());
    } else {
      setEditValue(name);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditValue(name);
      setIsEditing(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box
      sx={headerContainerSx(expanded, selected)}
      onClick={handleHeaderClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box sx={expandIconSx} onClick={handleExpandClick}>
        {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </Box>
      <Box sx={iconContainerSx}>
        <Icon />
      </Box>
      {isEditing ? (
        <Box
          component="input"
          ref={inputRef}
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          sx={titleInputSx}
        />
      ) : (
        <Box sx={titleSx} onDoubleClick={handleTitleDoubleClick}>
          {name}
        </Box>
      )}
      <Box sx={visibilityButtonSx(visible)} onClick={handleVisibilityClick}>
        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </Box>
    </Box>
  );
}
