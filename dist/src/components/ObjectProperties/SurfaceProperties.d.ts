import { ObjectPropertyInputEvent } from '.';
import { default as Surface } from '../../objects/surface';
import { default as Messenger } from '../../messenger';
export interface SurfacePropertiesProps {
    object: Surface;
    messenger: Messenger;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function SurfaceProperties(props: SurfacePropertiesProps): import("react/jsx-runtime").JSX.Element;
