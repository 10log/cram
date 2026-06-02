interface Props {
    value: number;
    onChange: ({ value }: {
        value: number;
    }) => void;
    step?: number;
    min?: number;
    max?: number;
}
export declare const PropertyRowVectorInput: ({ value, onChange, step, min, max }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
