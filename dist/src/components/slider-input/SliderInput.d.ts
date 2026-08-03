import { default as React } from 'react';
export interface SliderInputProps {
    value: number;
    id: string;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    onChange: (e: React.FormEvent) => void;
}
export default function SliderInput(props: SliderInputProps): React.JSX.Element;
