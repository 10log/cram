import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useShallow } from "zustand/react/shallow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CategoryIcon from "@mui/icons-material/Category";
import { useContainer } from "../../store";
import ObjectCard from "./ObjectCard";

const listContainerSx: SxProps<Theme> = {
  overflowY: "auto",
};

const groupHeaderSx = (expanded: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: "4px 8px",
  bgcolor: expanded ? "#e8ecef" : "transparent",
  cursor: "pointer",
  userSelect: "none",
  borderBottom: "1px solid #e1e4e8",
  "&:hover": {
    bgcolor: "#e8ecef",
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

const groupTitleSx: SxProps<Theme> = {
  flex: 1,
  fontSize: 12,
  fontWeight: 500,
  color: "#1c2127",
};

const countBadgeSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 14,
  height: 14,
  p: "0 4px",
  bgcolor: "#8c959f",
  borderRadius: "7px",
  fontSize: 10,
  fontWeight: 600,
  color: "white",
};

const groupContentSx = (expanded: boolean): SxProps<Theme> => ({
  display: expanded ? "block" : "none",
  pl: "20px",
});

const emptyStateSx: SxProps<Theme> = {
  p: "24px 16px",
  textAlign: "center",
  color: "#8c959f",
  fontSize: 13,
};

interface ObjectsByKind {
  rooms: string[];
  sources: string[];
  receivers: string[];
}

export default function ObjectCardList() {
  const [expanded, setExpanded] = useState(true);
  const containers = useContainer(useShallow((state) => state.containers));

  const objectsByKind = useMemo((): ObjectsByKind => {
    const result: ObjectsByKind = {
      rooms: [],
      sources: [],
      receivers: [],
    };

    Object.keys(containers).forEach((uuid) => {
      const container = containers[uuid];
      switch (container.kind) {
        case "room":
          result.rooms.push(uuid);
          break;
        case "source":
          result.sources.push(uuid);
          break;
        case "receiver":
          result.receivers.push(uuid);
          break;
        // Surfaces are now children of rooms, not shown at top level
      }
    });

    return result;
  }, [containers]);

  const totalCount =
    objectsByKind.rooms.length +
    objectsByKind.sources.length +
    objectsByKind.receivers.length;

  return (
    <Box sx={listContainerSx}>
      <Box sx={groupHeaderSx(expanded)} onClick={() => setExpanded(!expanded)}>
        <Box sx={expandIconSx}>
          {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </Box>
        <Box sx={iconContainerSx}>
          <CategoryIcon />
        </Box>
        <Typography sx={groupTitleSx}>Objects</Typography>
        {totalCount > 0 && <Box sx={countBadgeSx}>{totalCount}</Box>}
      </Box>
      <Box sx={groupContentSx(expanded)}>
        {totalCount === 0 ? (
          <Typography sx={emptyStateSx}>
            No objects yet. Import a model or add objects from the menu.
          </Typography>
        ) : (
          <>
            {objectsByKind.rooms.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
            {objectsByKind.sources.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
            {objectsByKind.receivers.map((uuid) => (
              <ObjectCard key={uuid} uuid={uuid} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}
