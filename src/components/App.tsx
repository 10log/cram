import React from "react";
import ImportDialog from "./ImportDialog";
import PanelContainer from "./panel-container/PanelContainer";
import { emit, messenger, on } from "../messenger";
import storage from "../lib/storage";

import "../css";
import "./App.css";


import { Stat } from "./parameter-config/Stats";
import { PropertiesPanel } from "./properties-panel";



import SaveDialog from "./SaveDialog";

import { NavBarComponent } from "./NavBarComponent";
import ProgressIndicator from "./ProgressIndicator";
import AutoCalculateProgress from "./AutoCalculateProgress";



import {ResultsPanel} from './ResultsPanel';
import { MaterialSearch } from "./MaterialSearch";
import EditorContainer from "./EditorContainer";
import { renderer } from "../render/renderer";

// Note: AppToaster removed - was unused and caused React 18 deprecation warning
// If toasts are needed in the future, use MUI Snackbar or similar

export interface AppProps {
  rightPanelTopInitialSize: number;
  bottomPanelInitialSize: number;
  rightPanelInitialSize: number;
  leftPanelInitialSize: number;
  /** Whether to show the navigation bar (default: true) */
  showNavBar?: boolean;
  /** Fixed width for the right panel in pixels (default: uses stored layout preference) */
  fixedPanelWidth?: number;
  /** Callback called after component mounts (used by standalone to load initial project) */
  onMount?: () => void;
}

type AppState = {
  stats: Stat[];
  resultsPanelOpen: boolean;
};

/** Height of results panel when open */
const RESULTS_PANEL_HEIGHT = 250;

export default class App extends React.Component<AppProps, AppState> {
  state: AppState;
  canvas: React.RefObject<HTMLCanvasElement>;
  canvasOverlay: React.RefObject<HTMLDivElement>;
  orientationOverlay: React.RefObject<HTMLDivElement>;
  responseOverlay: React.RefObject<HTMLDivElement>;
  statsCanvas: React.RefObject<HTMLCanvasElement>;
  rightPanelTopSize = this.props.rightPanelTopInitialSize;
  bottomPanelSize = this.props.bottomPanelInitialSize;
  rightPanelSize = this.props.rightPanelInitialSize;
  leftPanelSize = this.props.leftPanelInitialSize;
  resizeObserver: ResizeObserver | null = null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      stats: [] as Stat[],
      resultsPanelOpen: false,
    };

    this.canvas = React.createRef<HTMLCanvasElement>();
    this.responseOverlay = React.createRef<HTMLDivElement>();
    this.canvasOverlay = React.createRef<HTMLDivElement>();
    this.orientationOverlay = React.createRef<HTMLDivElement>();
    this.statsCanvas = React.createRef<HTMLCanvasElement>();
    this.saveLayout = this.saveLayout.bind(this);
  }


  componentDidMount() {
    this.canvas.current && messenger.postMessage("APP_MOUNTED", this.canvas.current);

    // Call onMount callback if provided (standalone uses this to load initial project)
    this.props.onMount?.();

    // Set up ResizeObserver to handle container size changes (e.g., sidebar collapse)
    const container = this.canvas.current?.parentElement;
    if (container) {
      this.resizeObserver = new ResizeObserver(() => {
        renderer.checkresize();
        renderer.needsToRender = true;
      });
      this.resizeObserver.observe(container);
    }

    on("TOGGLE_RESULTS_PANEL", (open) => {
      this.setState(prev => ({
        resultsPanelOpen: typeof open === 'boolean' ? open : !prev.resultsPanelOpen
      }), () => {
        // Notify renderer that layout changed
        emit("RENDERER_SHOULD_ANIMATE", false);
      });
    });
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  saveLayout() {
    const layout = {
      bottomPanelInitialSize: this.bottomPanelSize,
      rightPanelInitialSize: this.rightPanelSize,
      leftPanelInitialSize: this.leftPanelSize,
      rightPanelTopInitialSize: this.rightPanelTopSize
    };
    storage.setItem("layout", JSON.stringify(layout));
  }

  render() {
    const { showNavBar = true, fixedPanelWidth } = this.props;
    const { resultsPanelOpen } = this.state;

    // Use fixedPanelWidth if provided, otherwise use stored rightPanelSize
    const rightPanelWidth = fixedPanelWidth ?? this.rightPanelSize;

    const Editor = (
      <EditorContainer>
        <div id="response-overlay" className={"response_overlay response_overlay-hidden"} ref={this.responseOverlay} />
        <div id="canvas_overlay" ref={this.canvasOverlay}/>
        <div id="orientation-overlay" ref={this.orientationOverlay}/>
        <canvas id="renderer-canvas" ref={this.canvas} />
      </EditorContainer>
    );

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {showNavBar && <NavBarComponent />}
        <ProgressIndicator />
        <AutoCalculateProgress />
        <MaterialSearch />
        <ImportDialog />
        <SaveDialog />

        {/* Main flex container for canvas and properties panel */}
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          {/* Canvas area - flexible width */}
          <div style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            position: 'relative',
          }}>
            {/* Editor container - shrinks when results panel is open */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: resultsPanelOpen ? RESULTS_PANEL_HEIGHT : 0,
              transition: 'bottom 0.2s ease',
            }}>
              {Editor}
            </div>

            {/* Results panel - absolute positioned at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: resultsPanelOpen ? RESULTS_PANEL_HEIGHT : 0,
              overflow: 'hidden',
              transition: 'height 0.2s ease',
              background: '#fff',
              borderTop: resultsPanelOpen ? '1px solid #e0e0e0' : 'none',
            }}>
              <PanelContainer>
                <ResultsPanel />
              </PanelContainer>
            </div>
          </div>

          {/* Properties panel - fixed width */}
          <div style={{
            width: rightPanelWidth,
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden',
            background: '#fff',
            borderLeft: '1px solid #e0e0e0',
          }}>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    );
  }
}

declare global {
  interface EventTypes {
    TOGGLE_RESULTS_PANEL: any
  }
}
