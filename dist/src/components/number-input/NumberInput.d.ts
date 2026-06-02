import { default as React } from 'react';
import { ObjectPropertyInputEvent } from '../ObjectProperties';
export interface NumberInputProps {
    name: string;
    className?: string;
    value: number | string;
    style?: React.CSSProperties;
    disabled?: boolean;
    step?: number;
    min?: number;
    max?: number;
    id?: string;
    onChange: (e: ObjectPropertyInputEvent) => void;
    verifier?: (val: string | number) => boolean;
}
export declare function NumberInput(props: NumberInputProps): React.JSX.Element;
export default NumberInput;
