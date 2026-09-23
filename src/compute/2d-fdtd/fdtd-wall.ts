import rasterizeLine from './rasterize-line';

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

class FDTDWall {
  enabled: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cells: number[][];
  previousCells: number[][];
  shouldClearPreviousCells: boolean;
  absorption: number;
  constructor(props: FDTDWallProps) {
    this.absorption = props.absorption ?? 0;
    this.x1 = props.x1;
    this.y1 = props.y1;
    this.x2 = props.x2;
    this.y2 = props.y2;
    this.cells = rasterizeLine(this.x1, this.y1, this.x2, this.y2);
    this.previousCells = this.cells;
    this.shouldClearPreviousCells = false;
    this.enabled = true;
  }
  
  move(props: FDTDWallProps) {
    this.previousCells = this.cells;
    if (props.absorption !== undefined) this.absorption = props.absorption;
    this.x1 = props.x1;
    this.y1 = props.y1;
    this.x2 = props.x2;
    this.y2 = props.y2;
    this.cells = rasterizeLine(this.x1, this.y1, this.x2, this.y2);
    this.shouldClearPreviousCells = true;
  }
}

export { FDTDWall };

export default FDTDWall;
