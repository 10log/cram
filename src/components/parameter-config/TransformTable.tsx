import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Label from "../label/Label";
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
  "--transition-time": "50ms",
  "--transition-function": "cubic-bezier(0.25, 0.1, 0.25, 1)",
  pb: "0.25em",
};

const folderLabelSx: SxProps<Theme> = {
  "&:hover": {
    bgcolor: "#eaeef1",
    cursor: "pointer",
    userSelect: "none",
  },
};

const folderContentsSx = (open: boolean): SxProps<Theme> => ({
  height: open ? "max-content" : 0,
  pt: open ? "0.5em" : 0,
  pb: open ? "0.5em" : 0,
  overflow: "hidden",
  transition: "all 50ms cubic-bezier(0.25, 0.1, 0.25, 1)",
});

const tableSx: SxProps<Theme> = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
};

const headerRowSx: SxProps<Theme> = {
  "& th": {
    p: "2px 4px",
    fontWeight: 500,
    color: "#5c6670",
    textAlign: "center",
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
  },
  "& td:first-of-type": {
    fontWeight: 500,
    color: "#1c2127",
    pl: 1,
  },
};

const styledInputSx: SxProps<Theme> = {
  width: "100%",
  textAlign: "center",
  outline: "none",
  border: "none",
  borderRadius: "2px",
  bgcolor: "rgba(246, 248, 250, 0.75)",
  p: "2px 4px",
  color: "#182026",
  transition: "box-shadow 0.05s cubic-bezier(0.4, 1, 0.75, 0.9)",
  appearance: "none",
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    m: 0,
  },
  MozAppearance: "textfield",
  "&:hover": {
    outline: "none",
    boxShadow:
      "0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0), inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)",
    bgcolor: "rgba(246, 248, 250, 1)",
  },
  "&:focus": {
    boxShadow:
      "0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0), inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)",
    bgcolor: "rgba(246, 248, 250, 0.75)",
  },
};

interface TransformInputProps {
  uuid: string;
  property: TransformProperty;
  event: SetPropertyEvent;
}

const TransformInput = ({ uuid, property, event }: TransformInputProps) => {
  const value = useContainer((state) => {
    void state.version;
    return (state.containers[uuid] as Container)[property] as number;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.valueAsNumber;
    if (!Number.isNaN(newValue)) {
      // @ts-ignore - property is valid for all container types
      emit(event, { uuid, property, value: newValue });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    const newValue = value + delta;
    if (!Number.isNaN(newValue)) {
      // @ts-ignore - property is valid for all container types
      emit(event, { uuid, property, value: newValue });
    }
  };

  return (
    <Box
      component="input"
      type="number"
      value={value}
      onChange={handleChange}
      onWheel={handleWheel}
      step={1}
      sx={styledInputSx}
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
        <span style={{ verticalAlign: "middle" }}>
          {open ? <ExpandMoreIcon fontSize="inherit" /> : <ChevronRightIcon fontSize="inherit" />}
        </span>
        <Label hasTooltip={false} style={{ display: "inline-block" }}>
          Transform
        </Label>
      </Box>
      <Box sx={folderContentsSx(open)}>
        <Box component="table" sx={tableSx}>
          <thead>
            <Box component="tr" sx={headerRowSx}>
              <th></th>
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
            </Box>
          </thead>
          <tbody>
            <Box component="tr" sx={dataRowSx}>
              <td>Position</td>
              <td><TransformInput uuid={uuid} property="x" event={event} /></td>
              <td><TransformInput uuid={uuid} property="y" event={event} /></td>
              <td><TransformInput uuid={uuid} property="z" event={event} /></td>
            </Box>
            <Box component="tr" sx={dataRowSx}>
              <td>Scale</td>
              <td><TransformInput uuid={uuid} property="scalex" event={event} /></td>
              <td><TransformInput uuid={uuid} property="scaley" event={event} /></td>
              <td><TransformInput uuid={uuid} property="scalez" event={event} /></td>
            </Box>
            <Box component="tr" sx={dataRowSx}>
              <td>Rotation</td>
              <td><TransformInput uuid={uuid} property="rotationx" event={event} /></td>
              <td><TransformInput uuid={uuid} property="rotationy" event={event} /></td>
              <td><TransformInput uuid={uuid} property="rotationz" event={event} /></td>
            </Box>
          </tbody>
        </Box>
      </Box>
    </Box>
  );
}
