import { default as React } from 'react';
export interface PropertyRowLabelProps {
    label: string;
    tooltip?: string;
    hasToolTip?: boolean;
}
export default function PropertyRowLabel({ label, tooltip, hasToolTip }: PropertyRowLabelProps): React.JSX.Element;
