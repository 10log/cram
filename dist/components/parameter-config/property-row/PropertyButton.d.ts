import { default as React } from 'react';
export declare const PropertyButton: <T extends keyof EventTypes>({ args, event, label, tooltip, buttonLabel, disabled }: {
    args: EventTypes[T];
    event: T;
    label: string;
    tooltip: string;
    buttonLabel?: string;
    disabled?: boolean;
}) => React.JSX.Element;
export default PropertyButton;
