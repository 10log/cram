import { on } from "../../messenger";
import { setSolverProperty, removeSolver, useSolver } from "../../store";
import type { FDTD_2D } from '../2d-fdtd/index';

declare global {
  interface EventTypes {
    ADD_FDTD_2D: FDTD_2D | undefined,
    REMOVE_FDTD_2D: string;
    FDTD_2D_SET_PROPERTY: SetPropertyPayload<FDTD_2D>
  }
}

export default function registerFDTDEvents(){
  on("FDTD_2D_SET_PROPERTY", setSolverProperty);
  on("REMOVE_FDTD_2D", removeSolver);
  on("ADD_FDTD_2D", async (solver) => {
    if (solver) {
      useSolver.getState().set(draft => {
        draft.solvers[solver.uuid] = solver;
      });
    } else {
      // Create new FDTD_2D instance via dynamic import
      const { FDTD_2D } = await import('../2d-fdtd/index');
      const newSolver = new FDTD_2D();
      useSolver.getState().set(draft => {
        draft.solvers[newSolver.uuid] = newSolver;
      });
    }
  });
}
