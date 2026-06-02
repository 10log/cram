import { default as React } from 'react';
export interface GridRowSeperatorProps {
    label?: React.ReactNode | React.ReactNode[];
    children?: React.ReactNode | React.ReactNode[];
    span?: number;
    color?: string;
    marginTop?: string;
    marginBottom?: string;
}
export default function GridRowSeperator(props: GridRowSeperatorProps): import("react/jsx-runtime").JSX.Element;
