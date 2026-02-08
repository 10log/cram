/**
 * RendererPanel - Thin wrapper around RendererTab
 *
 * Waits for the renderer to be initialized (scene exists)
 * before rendering RendererTab, since its hooks read renderer
 * properties that are only set during init().
 */

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { renderer } from '../../../render/renderer';
import { messenger } from '../../../messenger';
import RendererTab from '../../parameter-config/RendererTab';

const containerSx: SxProps<Theme> = {
  height: '100%',
  overflow: 'auto',
  bgcolor: 'background.paper',
  p: 1,
};

export function RendererPanel() {
  const [ready, setReady] = useState(!!renderer.scene);

  useEffect(() => {
    if (ready) return;
    // Listen for APP_MOUNTED which triggers renderer.init()
    const [msg, id] = messenger.addMessageHandler('APP_MOUNTED', () => {
      setReady(true);
    });
    // Check again in case init happened between render and effect
    if (renderer.scene) setReady(true);
    return () => messenger.removeMessageHandler(msg, id);
  }, [ready]);

  if (!ready) return null;

  return (
    <Box sx={containerSx}>
      <RendererTab />
    </Box>
  );
}

export default RendererPanel;
