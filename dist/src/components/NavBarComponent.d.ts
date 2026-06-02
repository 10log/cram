type NavBarStore = {
    openMenu: string | null;
    anchorEl: HTMLElement | null;
    openMenuWithAnchor: (menu: string, anchor: HTMLElement) => void;
    closeMenu: () => void;
};
export declare const useNavBarStore: import('zustand').UseBoundStore<import('zustand').StoreApi<NavBarStore>>;
export declare function FileMenu(): import("react/jsx-runtime").JSX.Element;
export declare function EditMenu(): import("react/jsx-runtime").JSX.Element;
export declare function AddMenu(): import("react/jsx-runtime").JSX.Element;
export declare function ViewMenu(): import("react/jsx-runtime").JSX.Element;
export declare function ToolMenu(): import("react/jsx-runtime").JSX.Element;
export declare function ExamplesMenu(): import("react/jsx-runtime").JSX.Element;
export declare function NavBarComponent(): import("react/jsx-runtime").JSX.Element;
export default NavBarComponent;
