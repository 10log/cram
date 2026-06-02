/**
 * Auto-calculate manager
 *
 * Listens for changes to objects and solver parameters, then automatically
 * triggers recalculation of all solvers when auto-calculate is globally enabled.
 */
declare global {
    interface EventTypes {
        SHOW_AUTO_CALC_PROGRESS: {
            message: string;
            solverCount: number;
        };
        HIDE_AUTO_CALC_PROGRESS: undefined;
        AUTO_CALCULATE_TRIGGER: undefined;
    }
}
/**
 * Registers all event listeners for auto-calculate functionality
 */
export default function registerAutoCalculateEvents(): void;
