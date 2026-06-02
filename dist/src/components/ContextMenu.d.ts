import { default as React } from 'react';
export interface ContextMenuProps {
    handleMenuItemClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) & ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void);
    items?: string[];
    children?: React.ReactNode;
}
export declare function ContextMenu(props: ContextMenuProps): import("react/jsx-runtime").JSX.Element;
export default ContextMenu;
