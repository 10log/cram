import React, { useState, useCallback } from 'react';
import { Menu, MenuItem, Divider } from "@mui/material";

export interface ContextMenuProps {
    handleMenuItemClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) & ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void);
    items?: string[];
    children?: React.ReactNode;
}

export function ContextMenu(props: ContextMenuProps) {
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

    const items = props.items || ["Delete", "!seperator", "Add To Global Variables", "Log to Console"];

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
                : null
        );
    }, [contextMenu]);

    const handleClose = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleItemClick = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        props.handleMenuItemClick(event);
        handleClose();
    }, [props.handleMenuItemClick, handleClose]);

    return (
        <>
            <div onContextMenu={handleContextMenu}>
                {props.children}
            </div>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                {items.map((x, i) => {
                    if (x === "!seperator") {
                        return <Divider key={"context-menu-item-" + x + String(i)} />;
                    }
                    else {
                        return (
                            <MenuItem
                                onClick={handleItemClick}
                                key={"context-menu-item-" + x}
                                data-text={x}
                            >
                                {x}
                            </MenuItem>
                        );
                    }
                })}
            </Menu>
        </>
    );
}

export default ContextMenu;
