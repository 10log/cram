import { default as React } from 'react';
interface Props {
    value: boolean;
    onChange: ({ value }: {
        value: boolean;
    }) => void;
}
export declare const PropertyRowCheckbox: ({ value, onChange }: Props) => React.JSX.Element;
export default PropertyRowCheckbox;
