/**
 * Auto-calculate manager
 *
 * Listens for changes to objects and solver parameters, then automatically
 * triggers recalculation of all solvers when auto-calculate is globally enabled.
 */

import { emit, on, after } from "../messenger";
import { useAppStore, useSolver } from "../store";

/** Debounce delay in milliseconds */
const DEBOUNCE_MS = 300;

/** Debounce timer reference */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Flag to prevent re-triggering during auto-calculation */
let isAutoCalculating = false;

/** Flag to track if progress is currently shown */
let isProgressVisible = false;

/** Solver kinds that have a calculate method implemented */
const CALCULATABLE_SOLVER_KINDS = ["beam-trace", "rt60", "art"];

/**
 * Get solvers that have a calculate method defined
 */
function getCalculatableSolvers() {
  const { solvers } = useSolver.getState();
  return Object.values(solvers).filter(
    (solver) => CALCULATABLE_SOLVER_KINDS.includes(solver.kind)
  );
}

/**
 * Shows progress indicator immediately when a change is detected
 */
function showProgressIfNeeded() {
  if (isProgressVisible || isAutoCalculating) return;

  const solvers = getCalculatableSolvers();
  if (solvers.length === 0) return;

  isProgressVisible = true;
  emit("SHOW_AUTO_CALC_PROGRESS", {
    message: "Auto-calculating...",
    solverCount: solvers.length
  });
}

/**
 * Triggers auto-calculation for all solvers with a calculate method
 */
function triggerAutoCalculate() {
  if (isAutoCalculating) return;

  const solvers = getCalculatableSolvers();

  if (solvers.length === 0) {
    // Hide progress if no solvers to calculate
    if (isProgressVisible) {
      isProgressVisible = false;
      emit("HIDE_AUTO_CALC_PROGRESS", undefined);
    }
    return;
  }

  isAutoCalculating = true;

  // Use requestAnimationFrame to let the browser paint the progress indicator
  // before starting the blocking calculation
  requestAnimationFrame(() => {
    // Double RAF ensures the paint actually happens before we block
    requestAnimationFrame(() => {
      try {
        solvers.forEach((solver) => {
          solver.calculate();
          // Emit completion event for beam trace solvers so UI components update
          if (solver.kind === "beam-trace") {
            emit("BEAMTRACE_CALCULATE_COMPLETE", solver.uuid);
          }
        });
      } finally {
        isAutoCalculating = false;
        isProgressVisible = false;
        emit("HIDE_AUTO_CALC_PROGRESS", undefined);
      }
    });
  });
}

/**
 * Debounced trigger for auto-calculation
 */
function debouncedAutoCalculate() {
  // Show progress immediately when change is detected
  showProgressIfNeeded();

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    triggerAutoCalculate();
  }, DEBOUNCE_MS);
}

/**
 * Check if auto-calculate is globally enabled
 */
function isAutoCalculateEnabled(): boolean {
  return useAppStore.getState().autoCalculate;
}

/**
 * Handler for property change events
 * Only triggers auto-calculate if globally enabled
 */
function handlePropertyChange() {
  if (!isAutoCalculating && isAutoCalculateEnabled()) {
    debouncedAutoCalculate();
  }
}

// Declare event types
declare global {
  interface EventTypes {
    SHOW_AUTO_CALC_PROGRESS: { message: string; solverCount: number };
    HIDE_AUTO_CALC_PROGRESS: undefined;
    AUTO_CALCULATE_TRIGGER: undefined;
  }
}

/**
 * Registers all event listeners for auto-calculate functionality
 */
export default function registerAutoCalculateEvents() {
  // Listen for object property changes
  after("SURFACE_SET_PROPERTY", handlePropertyChange);
  after("ROOM_SET_PROPERTY", handlePropertyChange);
  after("SOURCE_SET_PROPERTY", handlePropertyChange);
  after("RECEIVER_SET_PROPERTY", handlePropertyChange);

  // Listen for solver property changes (excluding autoCalculate itself)
  const solverPropertyEvents = [
    "RAYTRACER_SET_PROPERTY",
    "RT60_SET_PROPERTY",
    "FDTD2D_SET_PROPERTY",
    "IMAGESOURCE_SET_PROPERTY",
    "ART_SET_PROPERTY",
    "BEAMTRACE_SET_PROPERTY",
    "ENERGYDECAY_SET_PROPERTY",
  ] as const;

  solverPropertyEvents.forEach((event) => {
    after(event as keyof EventTypes, (payload: any) => {
      // Don't trigger auto-calculate when toggling autoCalculate itself
      if (payload?.property === "autoCalculate") return;
      handlePropertyChange();
    });
  });

  // Manual trigger event
  on("AUTO_CALCULATE_TRIGGER", () => {
    triggerAutoCalculate();
  });
}
