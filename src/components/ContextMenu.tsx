import React from 'react';

import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";

export interface ContextMenuProps {
    handleMenuItemClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) & ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void);
    items?: string[];
    children?: React.ReactNode;
}

export class ContextMenu extends React.Component<ContextMenuProps, {}> {
    public render() {
        const items = this.props.items || ["Delete", "!seperator", "Add To Global Variables", "Log to Console"];

        return (
            <ContextMenu2
                content={
                    <Menu>
                        {items.map((x, i) => {
                            if (x === "!seperator") {
                                return <MenuDivider key={"context-menu-item-" + x + String(i)} />;
                            }
                            else {
                                return <MenuItem onClick={this.props.handleMenuItemClick} text={x} key={"context-menu-item-" + x} />;
                            }
                        })}
                    </Menu>
                }
            >
                {this.props.children}
            </ContextMenu2>
        );
    }
}

export default ContextMenu;
