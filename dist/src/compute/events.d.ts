import { RayTracerSaveObject } from './raytracer';
import { RT60SaveObject } from './rt';
import { ImageSourceSaveObject } from './raytracer/image-source';
import { ARTSaveObject } from './radiance/art';
import { BeamTraceSaveObject } from './beam-trace';
declare global {
    interface EventTypes {
        RESTORE_SOLVERS: (RayTracerSaveObject | RT60SaveObject | ImageSourceSaveObject | ARTSaveObject | BeamTraceSaveObject)[];
        REMOVE_SOLVERS: string | string[];
        LOG_SOLVER: string;
        RUN_SOLVER: string;
    }
}
export default function registerSolverEvents(): void;
