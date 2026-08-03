import { default as React } from 'react';
export interface GridRowProps {
    label?: React.ReactNode | React.ReactNode[];
    children?: React.ReactNode | React.ReactNode[];
    span?: number;
    style?: React.CSSProperties;
}
export default function GridRow(props: GridRowProps): React.JSX.Element;
