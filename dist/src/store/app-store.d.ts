import { Surface } from '../objects/surface';
import { UNITS } from '../enums/units';
type Version = `${number}.${number}.${number}`;
export interface ProgressInfo {
    visible: boolean;
    message: string;
    progress: number;
    solverUuid?: string;
}
export type AppStore = {
    units: UNITS;
    version: Version;
    canDuplicate: boolean;
    rendererStatsVisible: boolean;
    saveDialogVisible: boolean;
    projectName: string;
    openWarningVisible: boolean;
    newWarningVisible: boolean;
    materialDrawerOpen: boolean;
    importDialogVisible: boolean;
    selectedObjects: string | undefined;
    settingsDrawerVisible: boolean;
    resultsPanelOpen: boolean;
    canUndo: boolean;
    canRedo: boolean;
    progress: ProgressInfo;
    autoCalculate: boolean;
    hasUnsavedChanges: boolean;
    set: (fn: (draft: AppStore) => void) => void;
};
export declare const useAppStore: import('zustand').UseBoundStore<import('zustand').StoreApi<AppStore>>;
declare global {
    interface EventTypes {
        OPEN_MATERIAL_DRAWER: Surface | undefined;
        TOGGLE_MATERIAL_SEARCH: undefined;
        SHOW_PROGRESS: {
            message: string;
            progress?: number;
            solverUuid?: string;
        };
        UPDATE_PROGRESS: {
            progress: number;
            message?: string;
        };
        HIDE_PROGRESS: undefined;
        SET_AUTO_CALCULATE: boolean;
        MARK_DIRTY: undefined;
        MARK_CLEAN: undefined;
    }
}
/**
 * Reset the app store to its initial state.
 * Preserves version number.
 */
export declare const resetAppStore: () => void;
export default useAppStore;
