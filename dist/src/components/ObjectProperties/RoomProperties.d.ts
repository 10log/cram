import { ObjectPropertyInputEvent } from '.';
import { default as Room } from '../../objects/room';
export interface RoomPropertiesProps {
    object: Room;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function RoomProperties(props: RoomPropertiesProps): import("react/jsx-runtime").JSX.Element;
