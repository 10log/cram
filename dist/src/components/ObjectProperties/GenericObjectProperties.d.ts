import { ObjectPropertyInputEvent } from '.';
import { default as Source } from '../../objects/source';
export interface GenericObjectPropertiesProps {
    object: Source;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function GenericObjectProperties(props: GenericObjectPropertiesProps): import("react/jsx-runtime").JSX.Element;
