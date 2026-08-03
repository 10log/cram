import { default as React } from 'react';
import { ObjectPropertyInputEvent } from '../ObjectProperties';
export interface TextInputProps {
    name: string;
    className?: string;
    value: string;
    verifier?: (val: string) => boolean;
    id?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    onChange: (e: ObjectPropertyInputEvent) => void;
}
export declare function TextInput(props: TextInputProps): React.JSX.Element;
export default TextInput;
