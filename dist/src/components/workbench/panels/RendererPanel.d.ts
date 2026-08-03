/**
 * RendererPanel - Thin wrapper around RendererTab
 *
 * Waits for the renderer to be initialized (scene exists)
 * before rendering RendererTab, since its hooks read renderer
 * properties that are only set during init().
 */
export declare function RendererPanel(): import("react").JSX.Element | null;
export default RendererPanel;
