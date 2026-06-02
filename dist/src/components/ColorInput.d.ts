import { default as React } from 'react';
export interface ColorInputProps {
    name: string;
    className?: string;
    value: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function ColorInput(props: ColorInputProps): React.JSX.Element;
export default ColorInput;
