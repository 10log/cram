import { on, emit } from "../messenger";
import { omit } from "../common/helpers";
import { useSolver, getSolverKeys } from "../store";
import type Solver from "./solver";

// Use dynamic imports for solver classes to enable code splitting
// Type imports are fine - they're erased at compile time
import type RayTracer from "./raytracer";
import type { RayTracerSaveObject, RayTracerParams } from "./raytracer";
import type RT60 from "./rt";
import type { RT60SaveObject } from "./rt";
import type { ImageSourceSaveObject } from "./raytracer/image-source";
import type ART from "./radiance/art";
import type { ARTSaveObject, ARTProps } from "./radiance/art";
import type { BeamTraceSolver, BeamTraceSaveObject } from "./beam-trace";

declare global {
  interface EventTypes {
    RESTORE_SOLVERS: (RayTracerSaveObject | RT60SaveObject | ImageSourceSaveObject | ARTSaveObject | BeamTraceSaveObject)[];
    REMOVE_SOLVERS: string|string[];
    LOG_SOLVER: string;
    RUN_SOLVER: string;
  }
}

// Dynamic restore function that loads solver class on demand
async function restoreSolver(kind: string, saveObject: unknown): Promise<Solver> {
  switch (kind) {
    case "ray-tracer": {
      const { default: RayTracerClass } = await import("./raytracer");
      return new RayTracerClass(saveObject as RayTracerParams).restore(saveObject as RayTracerSaveObject);
    }
    case "rt60": {
      const { default: RT60Class } = await import("./rt");
      return new RT60Class().restore(saveObject as RT60SaveObject);
    }
    case "art": {
      const { default: ARTClass } = await import("./radiance/art");
      return new ARTClass(saveObject as ARTProps).restore(saveObject as ARTSaveObject);
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
            emit("ADD_RAYTRACER", restored as RayTracer);
            break;
          case "rt60":
            emit("ADD_RT60", restored as RT60);
            break;
          case "art":
            emit("ADD_ART", restored as ART);
            break;
          case "image-source":
            useSolver.getState().set(draft => {
              draft.solvers[restored.uuid] = restored;
            });
            break;
          case "beam-trace":
            emit("ADD_BEAMTRACE", restored as BeamTraceSolver);
            break;
        }
      } catch (e) {
        console.error(`Failed to restore solver ${solver.kind}:`, e);
      }
    }
  });
}
