import React from "react";
import SplitterLayout from "react-splitter-layout-react-v18";
import ImportDialog from "./ImportDialog";
// import ObjectView from "./object-view/ObjectView";
// import ConstructionsView from "./ConstructionsView";
import PanelContainer from "./panel-container/PanelContainer";
import { emit, messenger, on } from "../messenger";
import storage from "../lib/storage";

import "../css";
import "./App.css";


import { Stat } from "./parameter-config/Stats";
import { SolverCardList } from "./solver-cards";
import { ObjectCardList } from "./object-cards";



import SaveDialog from "./SaveDialog";

import { NavBarComponent } from "./NavBarComponent";
import ProgressIndicator from "./ProgressIndicator";
import AutoCalculateProgress from "./AutoCalculateProgress";



import {ResultsPanel} from './ResultsPanel';
import { MaterialSearch } from "./MaterialSearch";
import EditorContainer from "./EditorContainer";

// Note: AppToaster removed - was unused and caused React 18 deprecation warning
// If toasts are needed in the future, use MUI Snackbar or similar

export interface AppProps {
  rightPanelTopInitialSize: number;
  bottomPanelInitialSize: number;
  rightPanelInitialSize: number;
  leftPanelInitialSize: number;
  /** Whether to show the navigation bar (default: true) */
  showNavBar?: boolean;
  /** Fixed width for the right panel in pixels. When set, uses flex layout instead of resizable splitter */
  fixedPanelWidth?: number;
  /** Callback called after component mounts (used by standalone to load initial project) */
  onMount?: () => void;
}

type AppState = {
  stats: Stat[];
};


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
  editorResultSplitterRef: React.RefObject<SplitterLayout>;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      stats: [] as Stat[],
    };

    this.canvas = React.createRef<HTMLCanvasElement>();
    this.responseOverlay = React.createRef<HTMLDivElement>();
    //this.clfViewerOverlay = React.createRef<HTMLDivElement>();
    this.canvasOverlay = React.createRef<HTMLDivElement>();
    this.orientationOverlay = React.createRef<HTMLDivElement>();
    this.statsCanvas = React.createRef<HTMLCanvasElement>();
    this.editorResultSplitterRef = React.createRef<SplitterLayout>();
    this.saveLayout = this.saveLayout.bind(this);
  }


  componentDidMount() {
    this.canvas.current && messenger.postMessage("APP_MOUNTED", this.canvas.current);

    // Call onMount callback if provided (standalone uses this to load initial project)
    this.props.onMount?.();
    let lastPanelSize = 50;
    if(this.editorResultSplitterRef.current){
      //@ts-ignore
      lastPanelSize = this.editorResultSplitterRef.current.state.secondaryPaneSize || 50;
    }
    const openPanel = () => {
      if(lastPanelSize === 0){
        lastPanelSize = 50;
      }
      this.editorResultSplitterRef.current!.setState({ secondaryPaneSize: lastPanelSize }, () => emit("RENDERER_SHOULD_ANIMATE", false));
    }
    const closePanel = () => {
      //@ts-ignore
      lastPanelSize = this.editorResultSplitterRef.current!.state.secondaryPaneSize;
      this.editorResultSplitterRef.current!.setState({ secondaryPaneSize: 0 }, () => emit("RENDERER_SHOULD_ANIMATE", false));
    }

    on("TOGGLE_RESULTS_PANEL", (open) => {
      if(this.editorResultSplitterRef.current){
        emit("RENDERER_SHOULD_ANIMATE", true);
        //@ts-ignore
        if(this.editorResultSplitterRef.current.state.secondaryPaneSize === 0 || open){
          openPanel();
        } else {
          closePanel();
        }
      }
    })
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
    const Editor = (
        <EditorContainer>
              <div id="response-overlay" className={"response_overlay response_overlay-hidden"} ref={this.responseOverlay} />
              <div id="canvas_overlay" ref={this.canvasOverlay}/>
              <div id="orientation-overlay" ref={this.orientationOverlay}/>
              <canvas id="renderer-canvas" ref={this.canvas} />
          </EditorContainer>
    )

    const { showNavBar = true, fixedPanelWidth } = this.props;

    // Fixed-width layout mode (for embedding)
    if (fixedPanelWidth) {
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
            <div style={{ flex: 1, minWidth: 0, height: '100%', position: 'relative' }}>
              {Editor}
            </div>

            {/* Properties panel - fixed width */}
            <div style={{
              width: fixedPanelWidth,
              flexShrink: 0,
              height: '100%',
              overflowY: 'auto',
              background: '#fff',
              borderLeft: '1px solid #e0e0e0',
            }}>
              <ObjectCardList />
              <SolverCardList />
            </div>
          </div>
        </div>
      );
    }

    // Default resizable splitter layout
    return (
      <div>
        {showNavBar && <NavBarComponent />}
        <ProgressIndicator />
        <AutoCalculateProgress />
        {/* <SettingsDrawer /> */}


        <MaterialSearch />


        <ImportDialog />
        <SaveDialog />
      {/* center and right */}
      <SplitterLayout
            secondaryMinSize={0}
            primaryMinSize={50}
            customClassName={"modified-splitter-layout"}
            secondaryInitialSize={this.props.rightPanelInitialSize}
            primaryIndex={0}
            onDragStart={() => {
              emit("RENDERER_SHOULD_ANIMATE", true);
            }}
            onDragEnd={() => {
              emit("RENDERER_SHOULD_ANIMATE", false);
              this.saveLayout();
            }}
            onSecondaryPaneSizeChange={(value: number) => {
              this.rightPanelSize = value;
              // this.setState({ rightPanelSize: value });
            }}
          >
            <SplitterLayout
              vertical
              percentage
              secondaryInitialSize={0}
              onDragStart={() => {emit("RENDERER_SHOULD_ANIMATE", true);}}
              onDragEnd={() => {emit("RENDERER_SHOULD_ANIMATE", false);}}
              ref={this.editorResultSplitterRef}
            >
              {Editor}
              <PanelContainer>
                <ResultsPanel />
              </PanelContainer>
            </SplitterLayout>

            <PanelContainer className="panel full">
              <div style={{ height: '100%', overflowY: 'auto' }}>
                <ObjectCardList />
                <SolverCardList />
              </div>
            </PanelContainer>
          </SplitterLayout>
      </div>
    );
  }
}

declare global {
  interface EventTypes {
    TOGGLE_RESULTS_PANEL: any
  }
}