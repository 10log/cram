import { v4 as uuid } from 'uuid';
import { EditorModes } from "../constants/editor-modes";


export interface SolverParams {
  [key: string]: any;
  name?: string;
}

export default abstract class Solver {
  params: SolverParams;
  name: string;
  uuid: string;
  kind: string;
  running: boolean;
  update!: () => void;
  clearpass: boolean;
  autoCalculate: boolean;

  constructor(params?: SolverParams) {
    this.params = params || {};
    this.name = (params && params.name) || "untitled solver";
    this.kind = "solver";
    this.uuid = uuid();
    this.running = false;
    this.clearpass = false;
    this.autoCalculate = false;
    this.update = () => {};
  }

  /** Override in subclasses to perform the solver's calculation */
  calculate(): void {
    // Default implementation does nothing - override in subclasses
  }
  save() {
    const { name, kind, uuid, autoCalculate } = this;
    return {
      name,
      kind,
      uuid,
      autoCalculate
    };
  }
  restore(state: { name: string; uuid: string; autoCalculate?: boolean }) {
    this.name = state.name;
    this.uuid = state.uuid;
    this.autoCalculate = state.autoCalculate ?? false;
    return this;
  }
  dispose() {
    console.log("disposed from abstract...");
  }
  onModeChange(mode: EditorModes) {}
  onParameterConfigFocus() {}
  onParameterConfigBlur() {}
}


// on("RESTORE_SOLVERS", (solvers: SaveState["solvers"]) => {
//   const { solvers: current_solvers } = useSolver.getState()
//   const keys = Object.keys(current_solvers);
//   keys.forEach((key) => {
//     emit("REMOVE")
//   });
//   if (args && args[0] && args[0] instanceof Array) {
//     // console.log(args[0]);
//     console.log(args[0]);
//     args[0].forEach((saveObj) => {

//         default:
//           break;
//       }
//     });
//   }
// });


