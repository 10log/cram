import React, { CSSProperties } from 'react';
import { Grid } from "react-window";
import Messenger from "../../messenger";

export interface MaterialsPanelProps{
  messenger?: Messenger;
}

const columnWidths = [
  100,200,200,500,100,100,100,100,100,100
]

type CellProps = {
  materials: Record<string, unknown>[];
  keys: string[];
}

const Cell = ({ columnIndex, rowIndex, style, materials, keys }: {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  materials: Record<string, unknown>[];
  keys: string[];
}) => (
  <div style={style}>
    {JSON.stringify(materials[rowIndex][keys[columnIndex]])}
  </div>
);

export default function MaterialsPanel(props: MaterialsPanelProps) {
  const materials = props.messenger?.postMessage("FETCH_ALL_MATERIALS")[0]

  const keys = Object.keys(materials[0]);

  return (<Grid<CellProps>
    cellComponent={Cell}
    cellProps={{ materials, keys }}
    columnCount={5}
    columnWidth={(_index) => columnWidths[_index]}
    rowCount={500}
    rowHeight={() => 50}
    style={{ height: 500, width: 800 }}
  />);
}
