import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { NodesIcon, RoomIcon, SourceIcon, ReceiverIcon } from "../icons";
import { on } from "../../messenger";
import Container from "../../objects/container";

// Import object parameter components
import RoomTab from "../parameter-config/RoomTab";
import SourceTab from "../parameter-config/SourceTab";
import ReceiverTab from "../parameter-config/ReceiverTab";
import SurfaceTab from "../parameter-config/SurfaceTab";

const inspectorContainerSx: SxProps<Theme> = {
  borderTop: "1px solid #d0d7de",
  bgcolor: "#fff",
};

const inspectorHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  p: "8px 12px",
  bgcolor: "#f6f8fa",
  borderBottom: "1px solid #e1e4e8",
};

const iconContainerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  mr: 1,
  color: "#5c6670",
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

const objectKindSx: SxProps<Theme> = {
  fontSize: 11,
  fontWeight: 400,
  color: "#656d76",
  ml: "6px",
};

const closeButtonSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  borderRadius: "3px",
  color: "#656d76",
  cursor: "pointer",
  "&:hover": {
    bgcolor: "#dde3e8",
    color: "#1c2127",
  },
};

const inspectorContentSx: SxProps<Theme> = {
  p: "8px 0",
  maxHeight: 300,
  overflowY: "auto",
};

const emptyStateSx: SxProps<Theme> = {
  p: 2,
  textAlign: "center",
  color: "#8c959f",
  fontSize: 12,
};

/**
 * Maps object kind to its icon component
 */
const ObjectIconMap: Record<string, React.ElementType> = {
  room: RoomIcon,
  source: SourceIcon,
  receiver: ReceiverIcon,
  surface: NodesIcon,
};

/**
 * Maps object kind to its parameter configuration component
 */
const ObjectComponentMap = new Map<string, React.ComponentType<{ uuid: string }>>([
  ["room", RoomTab],
  ["source", SourceTab],
  ["receiver", ReceiverTab],
  ["surface", SurfaceTab],
]);

export default function ObjectInspector() {
  const [selectedObject, setSelectedObject] = useState<Container | null>(null);

  useEffect(() => {
    return on("SET_SELECTION", (containers: Container[]) => {
      if (containers.length > 0) {
        setSelectedObject(containers[0]);
      } else {
        setSelectedObject(null);
      }
    });
  }, []);

  useEffect(() => {
    return on("APPEND_SELECTION", (containers: Container[]) => {
      if (containers.length > 0) {
        setSelectedObject(containers[containers.length - 1]);
      }
    });
  }, []);

  useEffect(() => {
    return on("DESELECT_ALL_OBJECTS", () => {
      setSelectedObject(null);
    });
  }, []);

  const handleClose = () => {
    setSelectedObject(null);
  };

  if (!selectedObject) {
    return null;
  }

  const kind = selectedObject.kind || "object";
  const Icon = ObjectIconMap[kind] || NodesIcon;
  const ParameterComponent = ObjectComponentMap.get(kind);

  return (
    <Box sx={inspectorContainerSx}>
      <Box sx={inspectorHeaderSx}>
        <Box sx={iconContainerSx}>
          <Icon fontSize="small" />
        </Box>
        <Typography sx={titleSx}>
          {selectedObject.name || "Untitled"}
          <Typography component="span" sx={objectKindSx}>
            {kind}
          </Typography>
        </Typography>
        <Box sx={closeButtonSx} onClick={handleClose} title="Close inspector">
          <CloseIcon style={{ fontSize: 16 }} />
        </Box>
      </Box>
      <Box sx={inspectorContentSx}>
        {ParameterComponent ? (
          <ParameterComponent uuid={selectedObject.uuid} />
        ) : (
          <Typography sx={emptyStateSx}>
            No properties available for this object type.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
