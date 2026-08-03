import { default as React } from 'react';
interface Props {
    value: number;
    onChange: ({ value }: {
        value: number;
    }) => void;
    step?: number;
    min?: number;
    max?: number;
}
export declare const PropertyRowVectorInput: ({ value, onChange, step, min, max }: Props) => React.JSX.Element;
export {};
