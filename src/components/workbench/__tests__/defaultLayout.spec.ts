/**
 * Layout migration tests.
 *
 * Persisted layouts are restored verbatim and never consult DEFAULT_LAYOUT, so
 * a panel added after a user's layout was saved is invisible to them until the
 * stored model is patched.
 */

import { describe, it, expect } from 'vitest';
import type { IJsonModel } from 'flexlayout-react';
import { DEFAULT_LAYOUT, PANEL_IDS, SKETCH_TAB, ensureSketchTab } from '../defaultLayout';

/** A layout of the shape saved before the Sketch panel existed. */
const legacyLayout = (): IJsonModel => ({
  global: {},
  borders: [
    {
      type: 'border',
      location: 'right',
      size: 320,
      selected: 1,
      children: [
        { type: 'tab', id: 'objects', name: 'Objects', component: 'ObjectsPanel' },
        { type: 'tab', id: 'solvers', name: 'Solvers', component: 'SolversPanel' },
        { type: 'tab', id: 'renderer', name: 'Renderer', component: 'RendererPanel' },
      ],
    },
  ],
  layout: {
    type: 'row',
    children: [
      {
        type: 'tabset',
        id: 'main',
        children: [{ type: 'tab', id: 'canvas', name: 'Canvas', component: 'CanvasPanel' }],
      },
    ],
  },
});

const rightBorder = (layout: IJsonModel) =>
  (layout.borders ?? []).find((b) => b.location === 'right');

const tabIds = (layout: IJsonModel) =>
  (rightBorder(layout)?.children ?? []).map((c) => (c as { id?: string }).id);

describe('ensureSketchTab', () => {
  it('adds the Sketch tab to a layout saved before it existed', () => {
    const migrated = ensureSketchTab(legacyLayout());
    expect(tabIds(migrated)).toEqual(['objects', 'solvers', 'renderer', PANEL_IDS.SKETCH]);
  });

  it('gives the added tab the same shape as the default', () => {
    const migrated = ensureSketchTab(legacyLayout());
    const added = rightBorder(migrated)!.children!.at(-1);
    expect(added).toEqual(SKETCH_TAB);
  });

  it('leaves the current tab selection alone', () => {
    const migrated = ensureSketchTab(legacyLayout());
    expect(rightBorder(migrated)!.selected).toBe(1);
  });

  it('is a no-op when the tab is already present', () => {
    const already = ensureSketchTab(legacyLayout());
    expect(ensureSketchTab(already)).toBe(already);
  });

  it('is a no-op on the default layout', () => {
    expect(ensureSketchTab(DEFAULT_LAYOUT)).toBe(DEFAULT_LAYOUT);
  });

  it('is idempotent across repeated loads', () => {
    let layout = legacyLayout();
    for (let i = 0; i < 3; i++) layout = ensureSketchTab(layout);
    expect(tabIds(layout).filter((id) => id === PANEL_IDS.SKETCH)).toHaveLength(1);
  });

  it('does not mutate the stored layout', () => {
    const original = legacyLayout();
    const snapshot = JSON.stringify(original);
    ensureSketchTab(original);
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it('finds the tab even when it sits in the main layout rather than a border', () => {
    const layout = legacyLayout();
    (layout.layout.children[0] as { children: unknown[] }).children.push({ ...SKETCH_TAB });
    expect(ensureSketchTab(layout)).toBe(layout);
  });

  it('creates a right border when the saved layout has none', () => {
    const layout = { ...legacyLayout(), borders: [] };
    const migrated = ensureSketchTab(layout);
    expect(tabIds(migrated)).toEqual([PANEL_IDS.SKETCH]);
  });

  it('leaves a newly created border closed rather than forcing it open', () => {
    const migrated = ensureSketchTab({ ...legacyLayout(), borders: [] });
    expect(rightBorder(migrated)!.selected).toBe(-1);
  });

  it('tolerates a layout with no borders key at all', () => {
    const layout = legacyLayout();
    delete layout.borders;
    expect(tabIds(ensureSketchTab(layout))).toEqual([PANEL_IDS.SKETCH]);
  });

  it('does not disturb borders in other locations', () => {
    const layout = legacyLayout();
    layout.borders!.push({
      type: 'border',
      location: 'bottom',
      children: [{ type: 'tab', id: 'results', name: 'Results', component: 'ResultsPanel' }],
    });

    const migrated = ensureSketchTab(layout);

    const bottom = migrated.borders!.find((b) => b.location === 'bottom');
    expect(bottom!.children!.map((c) => (c as { id?: string }).id)).toEqual(['results']);
  });
});
