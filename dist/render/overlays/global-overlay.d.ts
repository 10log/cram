export interface GlobalOverlayCell<T> {
    id: string;
    elt: HTMLElement;
    value: T;
    label: string;
    formatter: (value: T) => string;
}
export type GlobalOverlayCellOpts<T> = {
    id?: string;
    hidden?: boolean;
    formatter?: (value: T) => string;
};
export declare class GlobalOverlayCell<T> {
    constructor(label: string, value: T, opts: GlobalOverlayCellOpts<T>);
    setValue(value: T): void;
    show(): void;
    hide(): void;
    get hidden(): boolean;
    get labelElt(): Element;
    get valueElt(): Element;
}
export type AllowedType = number | string | boolean;
export declare class GlobalOverlay {
    elt: HTMLElement;
    parent: HTMLElement;
    cells: Map<string, GlobalOverlayCell<AllowedType>>;
    constructor(parent: HTMLElement);
    setCellValue(id: string, value: AllowedType): void;
    addCell(label: string, value: AllowedType, opts: GlobalOverlayCellOpts<AllowedType>): GlobalOverlayCell<AllowedType> | undefined;
    removeCell(id: string): void;
    show(): void;
    hide(): void;
    showCell(id: string): void;
    hideCell(id: string): void;
    get hidden(): boolean;
    set hidden(shouldHide: boolean);
    get visible(): boolean;
    set visible(shouldShow: boolean);
}
