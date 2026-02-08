import type { IJsonModel } from 'flexlayout-react';

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
    splitterSize: 4,
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
  RESULTS: 'results',
} as const;
