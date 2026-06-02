interface Props {
    value: string;
    onChange: ({ value }: {
        value: string;
    }) => void;
    options: {
        value: string;
        label: string;
    }[];
}
export declare const PropertyRowSelect: ({ value, onChange, options }: Props) => import("react/jsx-runtime").JSX.Element;
export default PropertyRowSelect;
