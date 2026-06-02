export interface SolverControlBarProps {
    onPlayPause?: () => void;
    onStop?: () => void;
    onReset?: () => void;
    isRunning?: boolean;
    canRun?: boolean;
    hasResults?: boolean;
}
export default function SolverControlBar({ onPlayPause, onStop, onReset, isRunning, canRun, hasResults, }: SolverControlBarProps): import("react/jsx-runtime").JSX.Element;
