import { IJsonModel } from 'flexlayout-react';
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
export declare const DEFAULT_LAYOUT: IJsonModel;
/**
 * Panel IDs for programmatic access
 */
export declare const PANEL_IDS: {
    readonly CANVAS: "canvas";
    readonly OBJECTS: "objects";
    readonly SOLVERS: "solvers";
    readonly RENDERER: "renderer";
    readonly RESULTS: "results";
};
