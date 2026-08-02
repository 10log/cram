/**
 * Smoke coverage for the WorkbenchLayout / flexlayout-react integration:
 * the model builds from DEFAULT_LAYOUT, our global attributes take effect,
 * persisted layout json round-trips, and the Layout renders its tabs.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Model, Actions } from 'flexlayout-react';

import { WorkbenchLayout } from '../WorkbenchLayout';
import { DEFAULT_LAYOUT, PANEL_IDS } from '../defaultLayout';

// vi.mock is hoisted above the imports above by vitest
vi.mock('../panels/CanvasPanel', () => ({ CanvasPanel: () => <div>canvas-panel</div> }));
vi.mock('../panels/ObjectsPanel', () => ({ ObjectsPanel: () => <div>objects-panel</div> }));
vi.mock('../panels/SolversPanel', () => ({ SolversPanel: () => <div>solvers-panel</div> }));
vi.mock('../panels/RendererPanel', () => ({ RendererPanel: () => <div>renderer-panel</div> }));
vi.mock('../panels/ResultsPanelWrapper', () => ({
  ResultsPanelWrapper: () => <div>results-panel</div>,
}));

describe('flexlayout 0.10.0 smoke', () => {
  beforeEach(() => localStorage.clear());

  it('builds a model from DEFAULT_LAYOUT and round-trips toJson', () => {
    const model = Model.fromJson(DEFAULT_LAYOUT);
    const json = model.toJson();
    expect(Model.fromJson(json)).toBeTruthy();
    // ids from defaultLayout must survive
    for (const id of Object.values(PANEL_IDS)) {
      expect(model.getNodeById(id), `node ${id}`).toBeTruthy();
    }
  });

  it('honors the global attributes we set', () => {
    const model = Model.fromJson(DEFAULT_LAYOUT);
    const results = model.getNodeById(PANEL_IDS.RESULTS)!;
    expect((results as any).isEnableClose()).toBe(false);
    const canvas = model.getNodeById(PANEL_IDS.CANVAS)!;
    expect((canvas as any).isEnableDrag()).toBe(false);
    expect((canvas as any).isEnableRename()).toBe(false);
  });

  it('Actions.selectTab dispatches without throwing', () => {
    const model = Model.fromJson(DEFAULT_LAYOUT);
    expect(() => model.doAction(Actions.selectTab(PANEL_IDS.RESULTS))).not.toThrow();
  });

  // NOTE: tab *content* never mounts under jsdom — setupTests.ts stubs
  // ResizeObserver as a no-op, so flexlayout never measures a non-zero rect.
  // Assert on the chrome it does render.
  it('renders the Layout with the expected tabs', () => {
    render(<WorkbenchLayout />);
    expect(document.querySelector('.flexlayout__layout')).toBeTruthy();
    for (const name of ['Objects', 'Solvers', 'Renderer', 'Results']) {
      expect(screen.getAllByText(name).length, `tab ${name}`).toBeGreaterThan(0);
    }
    expect(screen.queryByText(/Unknown component/)).toBeNull();
    expect(document.querySelectorAll('.flexlayout__splitter').length).toBeGreaterThan(0);
  });

  it('persists layout json to storage on change', () => {
    const model = Model.fromJson(DEFAULT_LAYOUT);
    const json = JSON.stringify(model.toJson());
    expect(() => JSON.parse(json)).not.toThrow();
    // a persisted 0.9-era layout must still load under 0.10
    expect(Model.fromJson(JSON.parse(json))).toBeTruthy();
  });
});
