import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { NodesIcon, RoomIcon, SourceIcon, ReceiverIcon } from "../icons";

const HeaderContainer = styled.div<{ $expanded: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${(props) =>
    props.$selected ? "#cce5ff" :
    props.$expanded ? "#e8ecef" : "transparent"};
  border-left: ${(props) => (props.$selected ? "2px solid #2d72d2" : "2px solid transparent")};
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${(props) => props.$selected ? "#b3d7ff" : "#e8ecef"};
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

const TitleInput = styled.input`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #1c2127;
  border: 1px solid #2d72d2;
  border-radius: 2px;
  padding: 0 4px;
  outline: none;
  background: white;
  min-width: 0;
`;

const VisibilityButton = styled.div<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  color: ${(props) => (props.$visible ? "#8c959f" : "#d0d7de")};
  opacity: ${(props) => (props.$visible ? 0 : 1)};

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
    <HeaderContainer
      $expanded={expanded}
      $selected={selected}
      onClick={handleHeaderClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ExpandIcon onClick={handleExpandClick}>
        {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </ExpandIcon>
      <IconContainer>
        <Icon />
      </IconContainer>
      {isEditing ? (
        <TitleInput
          ref={inputRef}
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
        />
      ) : (
        <Title onDoubleClick={handleTitleDoubleClick}>{name}</Title>
      )}
      <VisibilityButton $visible={visible} onClick={handleVisibilityClick}>
        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </VisibilityButton>
    </HeaderContainer>
  );
}
