import { create } from 'zustand';
import { produce } from 'immer';
import { on } from "../messenger";
import { Surface } from "../objects/surface";
import { UNITS } from "../enums/units";

type Version = `${number}.${number}.${number}`;

export interface ProgressInfo {
  visible: boolean;
  message: string;
  progress: number; // 0-100, or -1 for indeterminate
  solverUuid?: string;
}

export type AppStore = {
  units: UNITS,
  version: Version,
  canDuplicate: boolean,
  rendererStatsVisible: boolean,
  saveDialogVisible: boolean,
  projectName: string,
  openWarningVisible: boolean,
  newWarningVisible: boolean,
  materialDrawerOpen: boolean,
  importDialogVisible: boolean,
  selectedObjects: string | undefined;
  settingsDrawerVisible: boolean,
  resultsPanelOpen: boolean;
  canUndo: boolean,
  canRedo: boolean,
  progress: ProgressInfo;
  autoCalculate: boolean;
  hasUnsavedChanges: boolean;
  set: (fn: (draft: AppStore) => void) => void;
};



export const useAppStore = create<AppStore>((set) => ({
  units: UNITS.METERS,
  version: "0.2.1",
  canDuplicate: false,
  rendererStatsVisible: false,
  saveDialogVisible: false,
  projectName: "",
  openWarningVisible: false,
  newWarningVisible: false,
  importDialogVisible: false,
  selectedObjects: undefined,
  canRedo: false,
  canUndo: false,
  materialDrawerOpen: false,
  settingsDrawerVisible: false,
  resultsPanelOpen: false,
  progress: {
    visible: false,
    message: "",
    progress: -1,
    solverUuid: undefined
  },
  autoCalculate: true,
  hasUnsavedChanges: false,
  set: (fn: (draft: AppStore) => void) => set(produce(fn))
}));

declare global {
  interface EventTypes {
    OPEN_MATERIAL_DRAWER: Surface | undefined;
    TOGGLE_MATERIAL_SEARCH: undefined;
    SHOW_PROGRESS: { message: string; progress?: number; solverUuid?: string };
    UPDATE_PROGRESS: { progress: number; message?: string };
    HIDE_PROGRESS: undefined;
    SET_AUTO_CALCULATE: boolean;
    MARK_DIRTY: undefined;
    MARK_CLEAN: undefined;
  }
}

on("OPEN_MATERIAL_DRAWER", (_surface) => {
  useAppStore.getState().set(draft => {
    draft.materialDrawerOpen = true;
  })
})

on("TOGGLE_MATERIAL_SEARCH", () => {
  useAppStore.getState().set(draft => {
    draft.materialDrawerOpen = true;
  })
})

on("TOGGLE_RESULTS_PANEL", (open) => {
  useAppStore.getState().set(draft => {
    if(typeof open !== "undefined"){
      draft.resultsPanelOpen = open;
    } else {
      draft.resultsPanelOpen = !draft.resultsPanelOpen;
    }
  })
})

on("SHOW_PROGRESS", ({ message, progress = -1, solverUuid }) => {
  useAppStore.getState().set(draft => {
    draft.progress.visible = true;
    draft.progress.message = message;
    draft.progress.progress = progress;
    draft.progress.solverUuid = solverUuid;
  });
});

on("UPDATE_PROGRESS", ({ progress, message }) => {
  useAppStore.getState().set(draft => {
    draft.progress.progress = progress;
    if (message !== undefined) {
      draft.progress.message = message;
    }
  });
});

on("HIDE_PROGRESS", () => {
  useAppStore.getState().set(draft => {
    draft.progress.visible = false;
    draft.progress.message = "";
    draft.progress.progress = -1;
    draft.progress.solverUuid = undefined;
  });
});

on("SET_AUTO_CALCULATE", (enabled) => {
  useAppStore.getState().set(draft => {
    draft.autoCalculate = enabled;
  });
});

on("MARK_DIRTY", () => {
  useAppStore.getState().set(draft => {
    draft.hasUnsavedChanges = true;
  });
});

on("MARK_CLEAN", () => {
  useAppStore.getState().set(draft => {
    draft.hasUnsavedChanges = false;
  });
});

export default useAppStore;
