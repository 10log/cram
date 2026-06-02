import { default as React } from 'react';
export interface ColorInputProps {
    name: string;
    className?: string;
    value: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function ColorInput(props: ColorInputProps): import("react/jsx-runtime").JSX.Element;
export default ColorInput;
