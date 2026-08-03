import { default as React } from 'react';
export interface ObjectCardHeaderProps {
    name: string;
    kind: string;
    expanded: boolean;
    selected: boolean;
    visible: boolean;
    onToggle: () => void;
    onSelect: (e: React.MouseEvent) => void;
    onVisibilityToggle: () => void;
    onNameChange: (name: string) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
export default function ObjectCardHeader({ name, kind, expanded, selected, visible, onToggle, onSelect, onVisibilityToggle, onNameChange, onMouseEnter, onMouseLeave, }: ObjectCardHeaderProps): React.JSX.Element;
