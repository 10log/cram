import { on, emit } from "../messenger";
import { omit } from "../common/helpers";
import { useSolver, getSolverKeys } from "../store";
import type Solver from "./solver";

// Use dynamic imports for solver classes to enable code splitting
// Type imports are fine - they're erased at compile time
import type { RayTracerSaveObject } from "./raytracer";
import type { RT60SaveObject } from "./rt";
import type { ImageSourceSaveObject } from "./raytracer/image-source";
import type { ARTSaveObject } from "./radiance/art";
import type { BeamTraceSaveObject } from "./beam-trace";

declare global {
  interface EventTypes {
    RESTORE_SOLVERS: (RayTracerSaveObject | RT60SaveObject | ImageSourceSaveObject | ARTSaveObject | BeamTraceSaveObject)[];
    REMOVE_SOLVERS: string|string[];
    LOG_SOLVER: string;
  }
}

// Dynamic restore function that loads solver class on demand
async function restoreSolver(kind: string, saveObject: unknown): Promise<Solver> {
  switch (kind) {
    case "ray-tracer": {
      const { default: RayTracer } = await import("./raytracer");
      return new RayTracer(saveObject).restore(saveObject as RayTracerSaveObject);
    }
    case "rt60": {
      const { default: RT60 } = await import("./rt");
      return new RT60().restore(saveObject as RT60SaveObject);
    }
    case "art": {
      const { default: ART } = await import("./radiance/art");
      return new ART(saveObject).restore(saveObject as ARTSaveObject);
    }
    case "image-source": {
      const { default: ImageSourceSolver } = await import("./raytracer/image-source");
      return new ImageSourceSolver(saveObject as ImageSourceSaveObject).restore(saveObject as ImageSourceSaveObject);
    }
    case "beam-trace": {
      const { BeamTraceSolver } = await import("./beam-trace");
      return new BeamTraceSolver().restore(saveObject as BeamTraceSaveObject);
    }
    default:
      throw new Error(`Unknown solver kind: ${kind}`);
  }
}

export default function registerSolverEvents(){
  // FDTD events are registered separately - also needs dynamic import
  import('./2d-fdtd/events').then(m => m.default());

  on("LOG_SOLVER", uuid => {
    console.log(useSolver.getState().solvers[uuid]);
  });

  on("REMOVE_SOLVERS", (uuids) => {
    const solvers = useSolver.getState().solvers;
    const ids = typeof uuids === "string" ? [uuids] : uuids;
    ids.forEach(id => solvers[id].dispose());
    useSolver.getState().set((state) => {
      state.solvers = omit(ids, solvers);
    });
  });

  on("RESTORE_SOLVERS", async (solvers) => {
    emit("REMOVE_SOLVERS", getSolverKeys());

    for (const solver of solvers) {
      try {
        const restored = await restoreSolver(solver.kind, solver);
        switch (solver.kind) {
          case "ray-tracer":
            emit("ADD_RAYTRACER", restored);
            break;
          case "rt60":
            emit("ADD_RT60", restored);
            break;
          case "art":
            emit("ADD_ART", restored);
            break;
          case "image-source":
            useSolver.getState().set(draft => {
              draft.solvers[restored.uuid] = restored;
            });
            break;
          case "beam-trace":
            emit("ADD_BEAMTRACE", restored);
            break;
        }
      } catch (e) {
        console.error(`Failed to restore solver ${solver.kind}:`, e);
      }
    }
  });
}
