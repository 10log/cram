import { default as React } from 'react';
export type CheckboxChangeEvent = {
    name: string;
    type: string;
    value: boolean;
    checked: boolean;
    id: string;
};
export interface CheckboxInputProps {
    name: string;
    className?: string;
    checked: boolean;
    checkedNode?: React.ReactNode;
    uncheckedNode?: React.ReactNode;
    onChange: (e: CheckboxChangeEvent) => void;
}
export declare function CheckboxInput(props: CheckboxInputProps): React.JSX.Element;
export default CheckboxInput;
