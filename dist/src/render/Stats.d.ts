export interface StatsPanelProps {
    fg: string;
    bg: string;
    unit?: string;
    textColor?: string;
    width?: number;
    height?: number;
    padding?: number;
    fontSize?: number;
}
declare class StatsPanel {
    name: string;
    fg: string;
    bg: string;
    textColor: string;
    dom: HTMLCanvasElement;
    width: number;
    height: number;
    padding: number;
    fontSize: number;
    context: CanvasRenderingContext2D;
    pixelRatio: number;
    min: number;
    max: number;
    unit: string;
    dimmensions: {
        WIDTH: number;
        HEIGHT: number;
        TEXT_X: number;
        TEXT_Y: number;
        GRAPH_X: number;
        GRAPH_Y: number;
        GRAPH_WIDTH: number;
        GRAPH_HEIGHT: number;
    };
    canvas: HTMLCanvasElement;
    constructor(name: string, props: StatsPanelProps);
    update(value: number, maxValue: number): void;
}
declare class Stats {
    REVISION: number;
    currentPanelIndex: number;
    container: HTMLElement;
    fpsPanel: StatsPanel;
    fpsPanelValue: number;
    memPanel?: StatsPanel;
    memPanelValue?: number;
    msPanel: StatsPanel;
    msPanelValue: number;
    beginTime: number;
    prevTime: number;
    frames: number;
    auxPanelUpdatePeriod: number;
    _displayStyle: number;
    DISPLAY_STYLES: {
        NONE: number;
        SINGLE: number;
        STACKED_X: number;
        STACKED_Y: number;
    };
    constructor();
    addPanel(panel: StatsPanel): StatsPanel;
    showSinglePanel(id: number): void;
    showAllPanels(): void;
    set displayStyle(displayStyle: number);
    get displayStyle(): number;
    get hidden(): boolean;
    hide(): void;
    unhide(): void;
    clickHandler(event: MouseEvent): void;
    begin(): void;
    end(): number;
    update(): void;
    get domElement(): HTMLElement;
    set domElement(element: HTMLElement);
}
export { Stats, StatsPanel };
export default Stats;
