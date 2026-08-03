export declare class TransformOverlay {
    dx: number;
    dy: number;
    dz: number;
    elt: HTMLElement;
    parent: HTMLElement;
    cells: Map<string, HTMLElement>;
    constructor(selector: string);
    setValues(dx: number, dy: number, dz: number): void;
    updateHTML(): void;
    show(): void;
    hide(): void;
    get hidden(): boolean;
    set hidden(shouldHide: boolean);
    get visible(): boolean;
    set visible(shouldShow: boolean);
}
