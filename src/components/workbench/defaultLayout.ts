import type { IJsonBorderNode, IJsonModel, IJsonTabNode } from 'flexlayout-react';

/**
 * Default workbench layout configuration for CRAM
 *
 * Layout structure:
 * ┌──────────────────────────┬──────────────┐
 * │                          │  [Objects]   │
 * │       3D Canvas          │  [Solvers]   │
 * │    (tab strip hidden)    │  [Renderer]  │
 * │                          │   320px      │
 * ├──────────────────────────┤  full height │
 * │  [Results] 250px         │              │
 * │  (collapsed by default)  │              │
 * └──────────────────────────┴──────────────┘
 *
 * The right border takes the full height; the bottom border
 * only extends to the right border's left edge.
 */
export const DEFAULT_LAYOUT: IJsonModel = {
  global: {
    // v0.9 removed the `splitterSize` global attribute; size is now the
    // `--splitter-size` CSS var (see workbenchTheme.css).
    tabEnablePopout: false,
    tabEnableRename: false,
    tabSetMinHeight: 100,
    tabSetMinWidth: 200,
    borderMinSize: 100,
    borderAutoSelectTabWhenOpen: true,
    borderAutoSelectTabWhenClosed: true,
  },
  borders: [
    {
      type: 'border',
      location: 'right',
      size: 320,
      selected: 0,
      children: [
        {
          type: 'tab',
          id: 'objects',
          name: 'Objects',
          component: 'ObjectsPanel',
          enableClose: false,
          enablePopout: false,
        },
        {
          type: 'tab',
          id: 'solvers',
          name: 'Solvers',
          component: 'SolversPanel',
          enableClose: false,
          enablePopout: false,
        },
        {
          type: 'tab',
          id: 'renderer',
          name: 'Renderer',
          component: 'RendererPanel',
          enableClose: false,
          enablePopout: false,
        },
        {
          type: 'tab',
          id: 'sketch',
          name: 'Sketch',
          component: 'SketchPanel',
          enableClose: false,
          enablePopout: false,
        },
      ],
    },
  ],
  layout: {
    type: 'row',
    children: [
      {
        // Vertical stack: canvas on top, results on bottom
        type: 'row',
        weight: 100,
        children: [
          {
            type: 'tabset',
            id: 'main',
            weight: 75,
            children: [
              {
                type: 'tab',
                id: 'canvas',
                name: 'Canvas',
                component: 'CanvasPanel',
                enableClose: false,
                enableDrag: false,
                enableRename: false,
              },
            ],
            enableTabStrip: false,
          },
          {
            type: 'tabset',
            id: 'results-tabset',
            weight: 25,
            minHeight: 100,
            children: [
              {
                type: 'tab',
                id: 'results',
                name: 'Results',
                component: 'ResultsPanel',
                enableClose: false,
                enablePopout: false,
              },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Panel IDs for programmatic access
 */
export const PANEL_IDS = {
  CANVAS: 'canvas',
  OBJECTS: 'objects',
  SOLVERS: 'solvers',
  RENDERER: 'renderer',
  SKETCH: 'sketch',
  RESULTS: 'results',
} as const;

/** The Sketch tab, also used to patch layouts saved before it existed. */
export const SKETCH_TAB: IJsonTabNode = {
  type: 'tab',
  id: PANEL_IDS.SKETCH,
  name: 'Sketch',
  component: 'SketchPanel',
  enableClose: false,
  enablePopout: false,
};

/** Depth-first search for a node id, over whatever shape the JSON happens to be. */
function containsNode(node: unknown, id: string): boolean {
  if (!node || typeof node !== 'object') return false;
  const candidate = node as { id?: unknown; children?: unknown };
  if (candidate.id === id) return true;
  return (
    Array.isArray(candidate.children) && candidate.children.some((child) => containsNode(child, id))
  );
}

/**
 * Add the Sketch tab to a layout saved before it existed.
 *
 * Persisted layouts are restored verbatim and never consult DEFAULT_LAYOUT, so
 * without this every existing user would be missing the panel with no way to
 * reach it short of resetting their layout.
 *
 * Appends to the right border alongside Objects/Solvers/Renderer, leaving the
 * user's current tab selection alone. Returns the input unchanged when the tab
 * is already present, so it is safe to run on every load.
 */
export function ensureSketchTab(layout: IJsonModel): IJsonModel {
  const borders = layout.borders ?? [];
  const present =
    containsNode(layout.layout, PANEL_IDS.SKETCH) ||
    borders.some((border) => containsNode(border, PANEL_IDS.SKETCH));
  if (present) return layout;

  const tab: IJsonTabNode = { ...SKETCH_TAB };
  const rightIndex = borders.findIndex((border) => border.location === 'right');

  if (rightIndex === -1) {
    const border = {
      type: 'border',
      location: 'right',
      size: 320,
      // Left closed: surfacing the tab is enough, forcing a panel open on
      // upgrade would be intrusive.
      selected: -1,
      children: [tab],
    } as IJsonBorderNode;
    return { ...layout, borders: [...borders, border] };
  }

  const right = borders[rightIndex];
  const nextBorders = borders.slice();
  nextBorders[rightIndex] = { ...right, children: [...(right.children ?? []), tab] };
  return { ...layout, borders: nextBorders };
}
