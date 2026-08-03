import { default as React } from 'react';
export interface Vector3InputChangeEvent {
    id?: string;
    value: number[];
}
export interface Vector3InputProps {
    id?: string;
    value: number[];
    onChange: (event: Vector3InputChangeEvent) => void;
    min: number;
    max: number;
    step: number;
}
export interface Vector3InputState {
    stagedValue: number[];
}
export default class Vector3Input extends React.Component<Vector3InputProps, Vector3InputState> {
    inputX: React.RefObject<HTMLInputElement | null>;
    inputY: React.RefObject<HTMLInputElement | null>;
    inputZ: React.RefObject<HTMLInputElement | null>;
    constructor(props: Vector3InputProps);
    componentDidMount(): void;
    emitChange(): void;
    handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
    handleWheel(event: React.WheelEvent<HTMLInputElement>): void;
    handleChange(): void;
    render(): React.JSX.Element;
}
