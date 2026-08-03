import { default as React } from 'react';
export interface SolverControlBarProps {
    onPlayPause?: () => void;
    onStop?: () => void;
    onReset?: () => void;
    isRunning?: boolean;
    canRun?: boolean;
    hasResults?: boolean;
}
export default function SolverControlBar({ onPlayPause, onStop, onReset, isRunning, canRun, hasResults, }: SolverControlBarProps): React.JSX.Element;
