import React from "react";
import styled from "styled-components";
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

const FolderContainer = styled.div`
  > * {
    --transition-time: 50ms;
    --transition-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  padding-bottom: 0.25em;
`;

const FolderLabel = styled.div`
  :hover {
    background-color: #eaeef1;
    cursor: pointer;
    user-select: none;
  }
`;

const FolderContents = styled.div<{ $open: boolean }>`
  height: ${(props) => (props.$open ? "max-content" : "0")};
  padding-top: ${(props) => (props.$open ? "0.5em" : "0")};
  padding-bottom: ${(props) => (props.$open ? "0.5em" : "0")};
  overflow: hidden;
  transition: all var(--transition-time) var(--transition-function);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const HeaderRow = styled.tr`
  th {
    padding: 2px 4px;
    font-weight: 500;
    color: #5c6670;
    text-align: center;
  }
  th:first-child {
    width: 60px;
    text-align: left;
    padding-left: 8px;
  }
`;

const DataRow = styled.tr`
  td {
    padding: 2px 4px;
  }
  td:first-child {
    font-weight: 500;
    color: #1c2127;
    padding-left: 8px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  text-align: center;
  outline: none;
  border: none;
  border-radius: 2px;
  background: rgba(246, 248, 250, 0.75);
  padding: 2px 4px;
  color: #182026;
  transition: box-shadow 0.05s cubic-bezier(0.4, 1, 0.75, 0.9);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  :hover {
    outline: none;
    box-shadow: 0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0),
      inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2);
    background: rgba(246, 248, 250, 1);
  }
  :focus {
    box-shadow: 0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0),
      inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2);
    background: rgba(246, 248, 250, 0.75);
  }
`;

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
    <StyledInput
      type="number"
      value={value}
      onChange={handleChange}
      onWheel={handleWheel}
      step={1}
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
    <FolderContainer>
      <FolderLabel onClick={toggle}>
        <span style={{ verticalAlign: "middle" }}>
          {open ? <ExpandMoreIcon fontSize="inherit" /> : <ChevronRightIcon fontSize="inherit" />}
        </span>
        <Label hasTooltip={false} style={{ display: "inline-block" }}>
          Transform
        </Label>
      </FolderLabel>
      <FolderContents $open={open}>
        <Table>
          <thead>
            <HeaderRow>
              <th></th>
              <th>X</th>
              <th>Y</th>
              <th>Z</th>
            </HeaderRow>
          </thead>
          <tbody>
            <DataRow>
              <td>Position</td>
              <td><TransformInput uuid={uuid} property="x" event={event} /></td>
              <td><TransformInput uuid={uuid} property="y" event={event} /></td>
              <td><TransformInput uuid={uuid} property="z" event={event} /></td>
            </DataRow>
            <DataRow>
              <td>Scale</td>
              <td><TransformInput uuid={uuid} property="scalex" event={event} /></td>
              <td><TransformInput uuid={uuid} property="scaley" event={event} /></td>
              <td><TransformInput uuid={uuid} property="scalez" event={event} /></td>
            </DataRow>
            <DataRow>
              <td>Rotation</td>
              <td><TransformInput uuid={uuid} property="rotationx" event={event} /></td>
              <td><TransformInput uuid={uuid} property="rotationy" event={event} /></td>
              <td><TransformInput uuid={uuid} property="rotationz" event={event} /></td>
            </DataRow>
          </tbody>
        </Table>
      </FolderContents>
    </FolderContainer>
  );
}
