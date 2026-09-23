export interface FDTDWallProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /**
     * Absorption coefficient of the surface this wall came from, at the
     * solver's reference frequency. 0 — a perfectly rigid wall — is the
     * default, which is what every wall was before #199.
     */
    absorption?: number;
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
    absorption: number;
    constructor(props: FDTDWallProps);
    move(props: FDTDWallProps): void;
}
export { FDTDWall };
export default FDTDWall;
