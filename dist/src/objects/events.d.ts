import { ReceiverSaveObject } from './receiver';
import { RoomSaveObject } from './room';
import { SourceSaveObject } from './source';
import { default as Container } from './container';
declare global {
    interface EventTypes {
        REMOVE_CONTAINERS: string | string[];
        RESTORE_CONTAINERS: Array<SourceSaveObject | RoomSaveObject | ReceiverSaveObject>;
        DESELECT_ALL_OBJECTS: undefined;
        SET_SELECTION: Container[];
        APPEND_SELECTION: Container[];
        TOGGLE_CONTAINER_VISIBLE: string;
    }
}
export default function registerObjectEvents(): void;
