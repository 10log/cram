/**
 * ResultsPanelWrapper - Thin wrapper around ResultsPanel for FlexLayout
 */

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { ResultsPanel } from '../../ResultsPanel';

const containerSx: SxProps<Theme> = {
  height: '100%',
  overflow: 'auto',
  bgcolor: 'background.paper',
};

export function ResultsPanelWrapper() {
  return (
    <Box sx={containerSx}>
      <ResultsPanel />
    </Box>
  );
}

export default ResultsPanelWrapper;
