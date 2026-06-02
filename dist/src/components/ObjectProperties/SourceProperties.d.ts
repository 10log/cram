import { default as React } from 'react';
import { default as Source } from '../../objects/source';
import { default as Messenger } from '../../messenger';
import { ObjectPropertyInputEvent } from '.';
export interface SourcePropertiesProps {
    object: Source;
    messenger: Messenger;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
}
export default function SourceProperties(props: SourcePropertiesProps): React.JSX.Element;
