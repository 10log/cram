import { Component } from 'react';
type Props = {
    data: any[];
    onUpdateCb: (updatedData: any, depth: number) => void;
    depth?: number;
    deleteElement?: JSX.Element;
    getStyleClassCb?: (node: any, depth: number) => string;
    isCheckable?: (node: any, depth: number) => boolean;
    isDeletable?: (node: any, depth: number) => boolean;
    isExpandable?: (node: any, depth: number) => boolean;
    keywordChildren?: string;
    keywordChildrenLoading?: string;
    keywordLabel?: string;
    keywordKey?: string;
    loadingElement?: JSX.Element;
    noChildrenAvailableMessage?: string;
    onCheckToggleCb?: (nodes: any, depth: number) => void;
    onDeleteCb?: (node: any, updatedData: any, depth: number) => boolean;
    onExpandToggleCb?: (node: any, depth: number) => void;
    transitionEnterTimeout?: number;
    transitionExitTimeout?: number;
};
type State = {
    data: any;
    lastCheckToggledNodeIndex: any;
};
declare class TreeViewComponent extends Component<Props, State> {
    private propsWithDefaults;
    constructor(props: any);
    componentDidUpdate(prevProps: any): void;
    handleUpdate(updatedData: any): void;
    handleCheckToggle(node: any, e: any): void;
    handleDelete(node: any): void;
    handleExpandToggle(node: any): void;
    printCheckbox(node: any, ...args: any[]): import("react/jsx-runtime").JSX.Element | undefined;
    printDeleteButton(node: any, ...args: any[]): import("react/jsx-runtime").JSX.Element | undefined;
    printExpandButton(node: any, ...args: any[]): import("react/jsx-runtime").JSX.Element;
    printNoChildrenMessage(): import("react/jsx-runtime").JSX.Element;
    printNodes(nodeArray: any): import("react/jsx-runtime").JSX.Element;
    printChildren(node: any): import("react/jsx-runtime").JSX.Element | null;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default TreeViewComponent;
