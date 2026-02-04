import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { emit } from "../../messenger";
import { useContainer } from "../../store";
import Container from "../../objects/container";
import useToggle from "../hooks/use-toggle";

type SetPropertyEvent =
  | "ROOM_SET_PROPERTY"
  | "SOURCE_SET_PROPERTY"
  | "RECEIVER_SET_PROPERTY"
  | "SURFACE_SET_PROPERTY";

type TransformProperty =
  | "x" | "y" | "z"
  | "scalex" | "scaley" | "scalez"
  | "rotationx" | "rotationy" | "rotationz";

const folderContainerSx: SxProps<Theme> = {
  pb: 0.5,
};

const folderLabelSx: SxProps<Theme> = {
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

const folderLabelTextSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "text.primary",
};

const tableSx: SxProps<Theme> = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.75rem",
};

const headerRowSx: SxProps<Theme> = {
  "& th": {
    p: "2px 4px",
    fontWeight: 500,
    color: "text.secondary",
    textAlign: "center",
    fontSize: "0.75rem",
  },
  "& th:first-of-type": {
    width: 60,
    textAlign: "left",
    pl: 1,
  },
};

const dataRowSx: SxProps<Theme> = {
  "& td": {
    p: "2px 4px",
    fontSize: "0.75rem",
  },
  "& td:first-of-type": {
    fontWeight: 500,
    color: "text.primary",
    pl: 1,
  },
};

const cellInputSx: SxProps<Theme> = {
  width: "100%",
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    height: 24,
  },
  "& .MuiInputBase-input": {
    py: 0.5,
    px: 1,
    textAlign: "center",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      m: 0,
    },
    MozAppearance: "textfield",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
};

interface TransformInputProps {
  uuid: string;
  property: TransformProperty;
  event: SetPropertyEvent;
}

const TransformInput = ({ uuid, property, event }: TransformInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const value = useContainer((state) => {
    void state.version;
    return (state.containers[uuid] as Container)[property] as number;
  });

  // Store latest values in refs so the wheel handler always has current values
  const valueRef = useRef(value);
  const uuidRef = useRef(uuid);
  const propertyRef = useRef(property);
  const eventRef = useRef(event);

  // Keep refs in sync
  valueRef.current = value;
  uuidRef.current = uuid;
  propertyRef.current = property;
  eventRef.current = event;

  // Use non-passive wheel listener to allow preventDefault
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const newValue = valueRef.current + delta;
      if (!Number.isNaN(newValue)) {
        // @ts-ignore - property is valid for all container types
        emit(eventRef.current, { uuid: uuidRef.current, property: propertyRef.current, value: newValue });
      }
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.valueAsNumber;
    if (!Number.isNaN(newValue)) {
      // @ts-ignore - property is valid for all container types
      emit(event, { uuid, property, value: newValue });
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      type="number"
      size="small"
      variant="outlined"
      value={value}
      onChange={handleChange}
      slotProps={{
        htmlInput: {
          step: 1,
        },
      }}
      sx={cellInputSx}
    />
  );
};

interface TransformTableProps {
  uuid: string;
  event: SetPropertyEvent;
}

export default function TransformTable({ uuid, event }: TransformTableProps) {
  const [open, toggle] = useToggle(true);

  return (
    <Box sx={folderContainerSx}>
      <Box sx={folderLabelSx} onClick={toggle}>
        {open ? (
          <ExpandMoreIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        ) : (
          <ChevronRightIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        )}
        <Typography sx={folderLabelTextSx}>Transform</Typography>
      </Box>
      <Collapse in={open}>
        <Box component="table" sx={tableSx}>
          <Box component="thead">
            <Box component="tr" sx={headerRowSx}>
              <Box component="th" />
              <Box component="th">X</Box>
              <Box component="th">Y</Box>
              <Box component="th">Z</Box>
            </Box>
          </Box>
          <Box component="tbody">
            <Box component="tr" sx={dataRowSx}>
              <Box component="td">Position</Box>
              <Box component="td"><TransformInput uuid={uuid} property="x" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="y" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="z" event={event} /></Box>
            </Box>
            <Box component="tr" sx={dataRowSx}>
              <Box component="td">Scale</Box>
              <Box component="td"><TransformInput uuid={uuid} property="scalex" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="scaley" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="scalez" event={event} /></Box>
            </Box>
            <Box component="tr" sx={dataRowSx}>
              <Box component="td">Rotation</Box>
              <Box component="td"><TransformInput uuid={uuid} property="rotationx" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="rotationy" event={event} /></Box>
              <Box component="td"><TransformInput uuid={uuid} property="rotationz" event={event} /></Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
