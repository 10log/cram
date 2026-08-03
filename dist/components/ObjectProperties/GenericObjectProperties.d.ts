import { default as React } from 'react';
import { ObjectPropertyInputEvent } from '.';
import { default as Source } from '../../objects/source';
export interface GenericObjectPropertiesProps {
    object: Source;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function GenericObjectProperties(props: GenericObjectPropertiesProps): React.JSX.Element;
