export interface SolverCardHeaderProps {
    name: string;
    kind: string;
    expanded: boolean;
    canCalculate?: boolean;
    isCalculating?: boolean;
    onToggle: () => void;
    onCalculate?: () => void;
    onClear?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
}
export default function SolverCardHeader({ name, kind, expanded, canCalculate, isCalculating, onToggle, onCalculate, onClear, onDelete, onDuplicate, }: SolverCardHeaderProps): import("react/jsx-runtime").JSX.Element;
