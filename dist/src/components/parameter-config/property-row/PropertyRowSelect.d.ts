import { default as React } from 'react';
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
export declare const PropertyRowSelect: ({ value, onChange, options }: Props) => React.JSX.Element;
export default PropertyRowSelect;
