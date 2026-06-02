import { default as React } from 'react';
type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;
export interface TreeItemLabelProps {
    label: React.ReactNode;
    icon?: React.ReactNode;
    meta?: string;
    onClick?: (e: ClickEvent) => void;
}
export default function TreeItemLabel(props: TreeItemLabelProps): import("react/jsx-runtime").JSX.Element;
export {};
