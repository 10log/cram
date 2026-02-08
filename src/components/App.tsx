import { useEffect } from "react";
import ImportDialog from "./ImportDialog";

import "../css";
import "./App.css";

import SaveDialog from "./SaveDialog";

import { NavBarComponent } from "./NavBarComponent";
import ProgressIndicator from "./ProgressIndicator";
import AutoCalculateProgress from "./AutoCalculateProgress";

import { MaterialSearch } from "./MaterialSearch";
import { WorkbenchLayout } from "./workbench";

export interface AppProps {
  /** Whether to show the navigation bar (default: true) */
  showNavBar?: boolean;
  /** Callback called after component mounts (used by standalone to load initial project) */
  onMount?: () => void;
}

export default function App({ showNavBar = true, onMount }: AppProps) {
  useEffect(() => {
    onMount?.();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showNavBar && <NavBarComponent />}
      <ProgressIndicator />
      <AutoCalculateProgress />
      <MaterialSearch />
      <ImportDialog />
      <SaveDialog />
      <WorkbenchLayout />
    </div>
  );
}

declare global {
  interface EventTypes {
    TOGGLE_RESULTS_PANEL: any
  }
}
