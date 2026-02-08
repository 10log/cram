/**
 * CanvasPanel - Extracted canvas + overlays from App.tsx
 *
 * Renders the WebGL canvas and overlay divs. Sets up ResizeObserver
 * to notify the renderer when the container size changes.
 */

import { useRef, useEffect } from 'react';
import { messenger } from '../../../messenger';
import { renderer } from '../../../render/renderer';
import EditorContainer from '../../EditorContainer';

export function CanvasPanel() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const responseOverlay = useRef<HTMLDivElement>(null);
  const canvasOverlay = useRef<HTMLDivElement>(null);
  const orientationOverlay = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvas.current) {
      messenger.postMessage('APP_MOUNTED', canvas.current);
    }

    // ResizeObserver to handle container resize (splitter drag, panel toggle, etc.)
    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        renderer.checkresize();
        renderer.needsToRender = true;
      });
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <EditorContainer>
        <div
          id="response-overlay"
          className="response_overlay response_overlay-hidden"
          ref={responseOverlay}
        />
        <div id="canvas_overlay" ref={canvasOverlay} />
        <div id="orientation-overlay" ref={orientationOverlay} />
        <canvas id="renderer-canvas" ref={canvas} />
      </EditorContainer>
    </div>
  );
}

export default CanvasPanel;
