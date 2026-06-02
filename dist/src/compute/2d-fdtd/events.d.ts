import { FDTD_2D } from '../2d-fdtd/index';
declare global {
    interface EventTypes {
        ADD_FDTD_2D: FDTD_2D | undefined;
        REMOVE_FDTD_2D: string;
        FDTD_2D_SET_PROPERTY: SetPropertyPayload<FDTD_2D>;
    }
}
export default function registerFDTDEvents(): void;
