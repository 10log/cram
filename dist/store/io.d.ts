import { SourceSaveObject } from '../objects/source';
import { ReceiverSaveObject } from '../objects/receiver';
import { RoomSaveObject } from '../objects/room';
import { RayTracerSaveObject } from '../compute/raytracer';
import { RT60SaveObject } from '../compute/rt';
import { ImageSourceSaveObject } from '../compute/raytracer/image-source';
export type ContainerSaveObject = (SourceSaveObject | ReceiverSaveObject | RoomSaveObject);
export type SolverSaveObject = (RayTracerSaveObject | RT60SaveObject | ImageSourceSaveObject);
export type SaveState = {
    meta: {
        version: `${number}.${number}.${number}`;
        name: string;
        timestamp: string;
    };
    containers: ContainerSaveObject[];
    solvers: SolverSaveObject[];
};
declare global {
    interface EventTypes {
        SAVE: () => void | undefined;
        OPEN: () => void | undefined;
        NEW: (success?: boolean) => void | undefined;
        RESTORE: {
            file?: File;
            json: SaveState;
        };
    }
}
