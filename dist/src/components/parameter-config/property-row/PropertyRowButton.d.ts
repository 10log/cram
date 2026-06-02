import { default as React } from 'react';
export interface PropertyRowButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    label: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    name?: string;
    [key: string]: unknown;
}
export default function PropertyRowButton({ label, onClick, disabled, ...rest }: PropertyRowButtonProps): React.JSX.Element;
