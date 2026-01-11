export * from './container-store';
export * from './settings-store';
export * from './history-store';
export * from './shortcut-store';
export * from './material-store';
export * from './result-store';
export * from './solver-store';
export * from './app-store';
export * from './io';

// Import reset functions for the combined reset function
import { resetContainerStore } from './container-store';
import { resetSolverStore } from './solver-store';
import { resetMaterialStore } from './material-store';
import { resetResultStore } from './result-store';
import { resetAppStore } from './app-store';
import { resetSettingsStore } from './settings-store';

/**
 * Reset all stores to their initial state.
 * Call this when cleaning up the CRAMEditor component.
 */
export const resetAllStores = () => {
  console.log('[Store] Resetting all stores...');

  // Order matters: reset containers/solvers first (they have Three.js resources)
  resetContainerStore();
  resetSolverStore();
  resetResultStore();
  resetMaterialStore();
  resetAppStore();
  resetSettingsStore();

  console.log('[Store] All stores reset complete');
};


declare global {

  type SetFunction<T> = (fn: (store: T, overwrite?: boolean) => void) => void;

  interface SetPropertyPayload<T> {
    uuid: string;
    property: keyof T;
    value: T[SetPropertyPayload<T>["property"]];
  }
}


