import { default as React } from 'react';
export interface SliderChangeEvent {
    id: string;
    value: number;
}
export interface SliderProps {
    id: string;
    value: number;
    onChange: (event: SliderChangeEvent) => void;
    min: number;
    max: number;
    step: number;
    label: string;
    tooltipText: string;
    labelPosition: "top" | "bottom" | "left" | "right";
    hasToolTip?: boolean;
}
export default function Slider({ id, value, onChange, min, max, step, label, tooltipText, hasToolTip, }: SliderProps): React.JSX.Element;
