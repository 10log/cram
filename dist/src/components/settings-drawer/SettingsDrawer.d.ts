import { default as React } from 'react';
export interface SettingsDrawerProps {
    size: number | string;
    onClose: (event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => void;
    isOpen: boolean;
    children?: React.ReactNode | React.ReactNode[];
    onSubmit?: (((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) & ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void));
}
export default function SettingsDrawer(props: SettingsDrawerProps): import("react/jsx-runtime").JSX.Element;
