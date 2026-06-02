export interface FDTDWallProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
declare class FDTDWall {
    enabled: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cells: number[][];
    previousCells: number[][];
    shouldClearPreviousCells: boolean;
    constructor(props: FDTDWallProps);
    move(props: FDTDWallProps): void;
}
export { FDTDWall };
export default FDTDWall;
