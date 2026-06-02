import { ObjectPropertyInputEvent } from '.';
import { default as Receiver } from '../../objects/receiver';
import { default as Messenger } from '../../messenger';
export interface ReceiverPropertiesProps {
    messenger: Messenger;
    object: Receiver;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function ReceiverProperties(props: ReceiverPropertiesProps): import("react/jsx-runtime").JSX.Element;
