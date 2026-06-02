import { default as React } from 'react';
interface Props {
    value: string;
    onChange: ({ value }: {
        value: string;
    }) => void;
}
export declare const PropertyRowTextInput: ({ value, onChange }: Props) => React.JSX.Element;
export default PropertyRowTextInput;
