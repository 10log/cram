import { default as React } from 'react';
type NavBarStore = {
    openMenu: string | null;
    anchorEl: HTMLElement | null;
    openMenuWithAnchor: (menu: string, anchor: HTMLElement) => void;
    closeMenu: () => void;
};
export declare const useNavBarStore: import('zustand').UseBoundStore<import('zustand').StoreApi<NavBarStore>>;
export declare function FileMenu(): React.JSX.Element;
export declare function EditMenu(): React.JSX.Element;
export declare function AddMenu(): React.JSX.Element;
export declare function ViewMenu(): React.JSX.Element;
export declare function ToolMenu(): React.JSX.Element;
export declare function ExamplesMenu(): React.JSX.Element;
export declare function NavBarComponent(): React.JSX.Element;
export default NavBarComponent;
