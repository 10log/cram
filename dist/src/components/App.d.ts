export interface AppProps {
    /** Whether to show the navigation bar (default: true) */
    showNavBar?: boolean;
    /** Callback called after component mounts (used by standalone to load initial project) */
    onMount?: () => void;
}
export default function App({ showNavBar, onMount }: AppProps): import("react").JSX.Element;
declare global {
    interface EventTypes {
        TOGGLE_RESULTS_PANEL: any;
    }
}
