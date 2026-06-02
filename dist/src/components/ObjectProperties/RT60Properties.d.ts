import { default as React } from 'react';
import { ObjectPropertyInputEvent } from '.';
import { RT60 } from '../../compute/rt';
import { default as Messenger } from '../../messenger';
export interface RT60PropertiesProps {
    object: RT60;
    messenger: Messenger;
    onPropertyChange: (e: ObjectPropertyInputEvent) => void;
    onPropertyValueChangeAsNumber: (id: string, prop: string, valueAsNumber: number) => void;
    onPropertyValueChangeAsString: (id: string, prop: string, valueAsString: string) => void;
    onButtonClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export default function RT60Properties(props: RT60PropertiesProps): import("react/jsx-runtime").JSX.Element;
