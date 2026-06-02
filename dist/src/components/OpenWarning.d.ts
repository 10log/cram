import { default as React } from 'react';
export interface OpenWarningProps {
    isOpen: boolean;
    onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onDiscard: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onSave: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
declare function OpenWarning(props: OpenWarningProps): React.JSX.Element;
export { OpenWarning };
export default OpenWarning;
