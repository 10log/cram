/**
 * SolversPanel - Solver list and properties, extracted from PropertiesPanel
 *
 * Shows solver list with select/run/delete, auto-calculate toggle.
 * When a solver is selected, its settings render inline below the list.
 */

import React, { useMemo, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import type { SxProps, Theme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useSolver } from '../../../store/solver-store';
import { useAppStore } from '../../../store/app-store';
import { emit } from '../../../messenger';

import RayTracerTab from '../../parameter-config/RayTracerTab';
import ImageSourceTab from '../../parameter-config/image-source-tab/ImageSourceTab';
import RT60Tab from '../../parameter-config/RT60Tab';
import EnergyDecayTab from '../../parameter-config/EnergyDecayTab';
import BeamTraceTab from '../../parameter-config/BeamTraceTab';
import FDTD_2DTab from '../../parameter-config/FDTD_2DTab';
import ARTTab from '../../parameter-config/ARTTab';

// ============================================================================
// ANIMATIONS & STYLES
// ============================================================================

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const panelContainerSx: SxProps<Theme> = {
  height: '100%',
  overflow: 'auto',
  bgcolor: 'background.paper',
};

const listItemSx: SxProps<Theme> = {
  py: 0.25,
  px: 1,
  '&.Mui-selected': {
    bgcolor: 'primary.light',
    '&:hover': { bgcolor: 'primary.light' },
  },
};

const propertiesContainerSx: SxProps<Theme> = {
  p: 1,
  '& > *': { mb: 0.5 },
};

const autoCalcButtonSx = (active: boolean, calculating: boolean): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  ml: 0.5,
  borderRadius: '50%',
  cursor: 'pointer',
  bgcolor: active ? 'primary.main' : 'transparent',
  color: active ? 'primary.contrastText' : 'text.secondary',
  '&:hover': {
    bgcolor: active ? 'primary.dark' : 'action.hover',
  },
  '& svg': {
    fontSize: 16,
    animation: calculating ? `${spin} 1s linear infinite` : 'none',
  },
});

// ============================================================================
// SOLVER TAB MAP
// ============================================================================

const SolverTabMap: Record<string, React.ComponentType<{ uuid: string }>> = {
  'ray-tracer': RayTracerTab,
  'image-source': ImageSourceTab,
  'rt60': RT60Tab,
  'energy-decay': EnergyDecayTab,
  'energydecay': EnergyDecayTab,
  'beam-trace': BeamTraceTab,
  'fdtd-2d': FDTD_2DTab,
  'art': ARTTab,
};

const solverDescriptions: Record<string, string> = {
  'ray-tracer': 'Monte Carlo ray tracing',
  'image-source': 'Image source method',
  'rt60': 'Statistical reverberation',
  'fdtd-2d': 'Finite-difference time-domain',
  'energydecay': 'Energy decay analysis',
  'art': 'Acoustic radiance transfer',
  'beam-trace': 'Beam tracing',
};

// ============================================================================
// SOLVER ITEM COMPONENT
// ============================================================================

interface SolverItemProps {
  uuid: string;
  name: string;
  type: string;
  selected: boolean;
  onSelect: () => void;
  onRun: () => void;
  onDelete: () => void;
}

function SolverItem({ uuid, name, type, selected, onSelect, onRun, onDelete }: SolverItemProps) {
  return (
    <ListItem
      disablePadding
      sx={listItemSx}
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" onClick={onRun} color="primary" sx={{ p: 0.25 }}>
            <PlayArrowIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={onDelete} sx={{ p: 0.25 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={onSelect} selected={selected} dense sx={{ py: 0.25 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          <ViewInArIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={type}
          primaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
          secondaryTypographyProps={{ fontSize: '0.625rem' }}
        />
      </ListItemButton>
    </ListItem>
  );
}

// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================

export function SolversPanel() {
  const [selectedSolverId, setSelectedSolverId] = useState<string | null>(null);

  const solversData = useSolver((state) => state.solvers);
  const autoCalculate = useAppStore((state) => state.autoCalculate);
  const progressVisible = useAppStore((state) => state.progress.visible);

  const solverList = useMemo(() => {
    return Object.keys(solversData).map((uuid) => ({
      uuid,
      name: solversData[uuid].name || uuid.slice(0, 8),
      type: solverDescriptions[solversData[uuid].kind] || solversData[uuid].kind || 'Unknown',
    }));
  }, [solversData]);

  const handleSelectSolver = useCallback((uuid: string) => {
    setSelectedSolverId(uuid);
  }, []);

  const handleRunSolver = useCallback((uuid: string) => {
    emit('RUN_SOLVER', uuid);
  }, []);

  const handleDeleteSolver = useCallback((uuid: string) => {
    emit('REMOVE_SOLVERS', uuid);
    if (selectedSolverId === uuid) setSelectedSolverId(null);
  }, [selectedSolverId]);

  const handleAutoCalcToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emit('SET_AUTO_CALCULATE', !autoCalculate);
  }, [autoCalculate]);

  const selectedSolver = selectedSolverId ? solversData[selectedSolverId] : null;

  const renderProperties = () => {
    if (!selectedSolver) return null;
    const SolverTab = SolverTabMap[selectedSolver.kind];
    if (SolverTab) {
      return <SolverTab uuid={selectedSolverId!} />;
    }
    return <Typography variant="body2" color="text.secondary">Unknown solver type: {selectedSolver.kind}</Typography>;
  };

  return (
    <Box sx={panelContainerSx}>
      {/* Header with auto-calculate toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem', flex: 1 }}>
          Solvers ({solverList.length})
        </Typography>
        <Tooltip title={autoCalculate ? 'Auto-calculate ON' : 'Auto-calculate OFF'}>
          <Box
            component="span"
            role="button"
            tabIndex={0}
            onClick={handleAutoCalcToggle}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') handleAutoCalcToggle(e as unknown as React.MouseEvent);
            }}
            sx={autoCalcButtonSx(autoCalculate, autoCalculate && progressVisible)}
          >
            <AutorenewIcon />
          </Box>
        </Tooltip>
      </Box>

      <List dense disablePadding>
        {solverList.map((solver) => (
          <SolverItem
            key={solver.uuid}
            uuid={solver.uuid}
            name={solver.name}
            type={solver.type}
            selected={selectedSolverId === solver.uuid}
            onSelect={() => handleSelectSolver(solver.uuid)}
            onRun={() => handleRunSolver(solver.uuid)}
            onDelete={() => handleDeleteSolver(solver.uuid)}
          />
        ))}
      </List>

      {selectedSolver && (
        <>
          <Divider />
          <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
              {selectedSolver.name} Settings
            </Typography>
          </Box>
          <Box sx={propertiesContainerSx}>
            {renderProperties()}
          </Box>
        </>
      )}
    </Box>
  );
}

export default SolversPanel;
