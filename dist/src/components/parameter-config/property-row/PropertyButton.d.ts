export declare const PropertyButton: <T extends keyof EventTypes>({ args, event, label, tooltip, buttonLabel, disabled }: {
    args: EventTypes[T];
    event: T;
    label: string;
    tooltip: string;
    buttonLabel?: string;
    disabled?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default PropertyButton;
