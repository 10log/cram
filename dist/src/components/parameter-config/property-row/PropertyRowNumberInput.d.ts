interface Props {
    value: number;
    onChange: ({ value }: {
        value: number;
    }) => void;
    step?: number;
    min?: number;
    max?: number;
}
export declare const PropertyRowNumberInput: ({ value, onChange, step, min, max }: Props) => import("react/jsx-runtime").JSX.Element;
export default PropertyRowNumberInput;
