
import { create } from 'zustand';
import { produce } from 'immer';
import { KeyValuePair } from "../common/key-value-pair";
import Solver from "../compute/solver";
import { omit } from "../common/helpers";
import { emit } from "../messenger";



/* Solver */
export type SolverStore = {
  solvers: KeyValuePair<Solver>;
  version: number;
  set: SetFunction<SolverStore>;
  keys: () => string[];
};

// solver hook
export const useSolver = create<SolverStore>((set, get) => ({
  solvers: {},
  version: 0,
  keys: () => Object.keys(get().solvers),
  set: (fn) => set(produce(fn))
}));




export const addSolver = <T extends Solver>(SolverClass: new() => T) => (solver: T|undefined) => {
  const s = solver || new SolverClass() as T;
  useSolver.getState().set(draft=>{
    draft.solvers[s!.uuid] = s;
  });
  emit("MARK_DIRTY", undefined);
};


export const removeSolver = (uuid: keyof SolverStore['solvers']) => {
  useSolver.getState().set(draft=>{
    draft.solvers = omit([uuid], draft.solvers);
  });
  emit("MARK_DIRTY", undefined);
}


export const setSolverProperty = ({uuid, property, value}) => {
  // Access the actual solver instance directly (not through Immer draft)
  // so that class setters are properly invoked
  const solver = useSolver.getState().solvers[uuid];
  if (solver) {
    solver[property] = value;
  }
  // Update version to trigger re-renders
  useSolver.getState().set(store => {
    store.version++;
  });
  emit("MARK_DIRTY", undefined);
}

export const callSolverMethod = ({uuid, method, args, isAsync }) => {
  try{
    const solver = useSolver.getState().solvers[uuid];
    const handle = solver[method].bind(solver);
    if(isAsync) {
      handle(args).catch(console.error);
    }
    else{
      handle(args);
    }
  }
  catch(err){
    console.error(err);
  }
}

export const getSolverKeys = () => Object.keys(useSolver.getState().solvers);