/**
 * WorkbenchLayout - Dockable panel layout using FlexLayout
 *
 * Provides resizable, dockable, and tabbed panel management for CRAM.
 * Panels: Canvas (center), Objects/Solvers/Renderer (right border),
 * Results (bottom border, collapsed by default).
 */

import { useCallback, useRef, useEffect } from 'react';
import {
  Layout,
  Model,
  Actions,
  type TabNode,
  type IJsonModel,
} from 'flexlayout-react';

// Import FlexLayout base styles + our overrides
import './workbenchTheme.css';

import { DEFAULT_LAYOUT, PANEL_IDS } from './defaultLayout';
import { CanvasPanel } from './panels/CanvasPanel';
import { ObjectsPanel } from './panels/ObjectsPanel';
import { SolversPanel } from './panels/SolversPanel';
import { RendererPanel } from './panels/RendererPanel';
import { ResultsPanelWrapper } from './panels/ResultsPanelWrapper';

import storage from '../../lib/storage';
import { on } from '../../messenger';

const STORAGE_KEY = 'flexlayout';

/**
 * Load persisted layout from localStorage, or return default
 */
function loadLayout(): IJsonModel {
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[WorkbenchLayout] Failed to parse stored layout:', e);
  }
  return DEFAULT_LAYOUT;
}

export function WorkbenchLayout() {
  const layoutRef = useRef<Layout>(null);

  // Initialize model once from stored layout or default
  const modelRef = useRef<Model | null>(null);
  if (modelRef.current === null) {
    modelRef.current = Model.fromJson(loadLayout());
  }
  const model = modelRef.current;

  // Component factory - maps component names to React elements
  const factory = useCallback((node: TabNode) => {
    const component = node.getComponent();

    switch (component) {
      case 'CanvasPanel':
        return <CanvasPanel />;
      case 'ObjectsPanel':
        return <ObjectsPanel />;
      case 'SolversPanel':
        return <SolversPanel />;
      case 'RendererPanel':
        return <RendererPanel />;
      case 'ResultsPanel':
        return <ResultsPanelWrapper />;
      default:
        return (
          <div style={{ padding: 16, color: 'var(--mui-palette-text-secondary)' }}>
            Unknown component: {component}
          </div>
        );
    }
  }, []);

  // Persist layout on changes
  const handleModelChange = useCallback((newModel: Model) => {
    try {
      const json = newModel.toJson();
      storage.setItem(STORAGE_KEY, JSON.stringify(json));
    } catch (e) {
      console.warn('[WorkbenchLayout] Failed to persist layout:', e);
    }
  }, []);

  // Listen for TOGGLE_RESULTS_PANEL event
  useEffect(() => {
    return on('TOGGLE_RESULTS_PANEL', () => {
      if (!model) return;

      const node = model.getNodeById(PANEL_IDS.RESULTS);
      if (node) {
        model.doAction(Actions.selectTab(PANEL_IDS.RESULTS));
      }
    });
  }, [model]);

  // Listen for RESET_LAYOUT event
  useEffect(() => {
    return on('RESET_LAYOUT', () => {
      storage.removeItem(STORAGE_KEY);
      // Replace model with fresh default
      const freshModel = Model.fromJson(DEFAULT_LAYOUT);
      modelRef.current = freshModel;
      // Force re-render by updating the Layout ref
      layoutRef.current?.props.model && window.location.reload();
    });
  }, []);

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Layout
        ref={layoutRef}
        model={model}
        factory={factory}
        onModelChange={handleModelChange}
        realtimeResize
      />
    </div>
  );
}

export default WorkbenchLayout;

declare global {
  interface EventTypes {
    RESET_LAYOUT: undefined;
  }
}
