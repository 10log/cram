/**
 * ObjectsPanel - Object list and properties, extracted from PropertiesPanel
 *
 * Shows grouped object list (rooms, sources, receivers, surfaces) with
 * select/visibility/delete. When an object is selected, its properties
 * render inline below the list.
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
import Divider from '@mui/material/Divider';
import type { SxProps, Theme } from '@mui/material/styles';
import { useShallow } from 'zustand/react/shallow';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SensorsIcon from '@mui/icons-material/Sensors';
import SquareIcon from '@mui/icons-material/Square';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

import { useContainer } from '../../../store';
import { emit, postMessage } from '../../../messenger';

import SourceTab from '../../parameter-config/SourceTab';
import ReceiverTab from '../../parameter-config/ReceiverTab';
import RoomTab from '../../parameter-config/RoomTab';
import SurfaceTab from '../../parameter-config/SurfaceTab';

// ============================================================================
// STYLES
// ============================================================================

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

const categoryHeaderSx: SxProps<Theme> = {
  py: 0.5,
  px: 1.5,
  bgcolor: 'background.default',
  borderBottom: 1,
  borderColor: 'divider',
};

const emptyStateSx: SxProps<Theme> = {
  py: 3,
  px: 2,
  textAlign: 'center',
};

const propertiesContainerSx: SxProps<Theme> = {
  p: 1,
  '& > *': { mb: 0.5 },
};

// ============================================================================
// TYPE ICONS
// ============================================================================

const typeIcons: Record<string, React.ReactNode> = {
  room: <HomeIcon fontSize="small" />,
  source: <GraphicEqIcon fontSize="small" />,
  receiver: <SensorsIcon fontSize="small" />,
  surface: <SquareIcon fontSize="small" />,
};

// ============================================================================
// OBJECT ITEM COMPONENT
// ============================================================================

interface ObjectItemProps {
  uuid: string;
  name: string;
  type: string;
  visible: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onHover?: () => void;
  onUnhover?: () => void;
}

function ObjectItem({ uuid, name, type, visible, selected, onSelect, onToggleVisibility, onDelete, onHover, onUnhover }: ObjectItemProps) {
  return (
    <ListItem
      disablePadding
      sx={listItemSx}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" onClick={onToggleVisibility} sx={{ p: 0.25 }}>
            {visible ? <VisibilityIcon sx={{ fontSize: 16 }} /> : <VisibilityOffIcon sx={{ fontSize: 16 }} />}
          </IconButton>
          <IconButton size="small" onClick={onDelete} sx={{ p: 0.25 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={onSelect} selected={selected} dense sx={{ py: 0.25 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          {typeIcons[type] || <ViewInArIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
        />
      </ListItemButton>
    </ListItem>
  );
}

// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================

export function ObjectsPanel() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const { containers, version } = useContainer(useShallow((state) => ({
    containers: state.containers,
    version: state.version,
  })));

  // Group objects by type
  const objectsByKind = useMemo(() => {
    const result = {
      rooms: [] as { uuid: string; name: string; visible: boolean }[],
      sources: [] as { uuid: string; name: string; visible: boolean }[],
      receivers: [] as { uuid: string; name: string; visible: boolean }[],
      surfaces: [] as { uuid: string; name: string; visible: boolean }[],
    };

    Object.keys(containers).forEach((uuid) => {
      const container = containers[uuid];
      const item = { uuid, name: container.name || uuid.slice(0, 8), visible: container.visible !== false };

      switch (container.kind) {
        case 'room': result.rooms.push(item); break;
        case 'source': result.sources.push(item); break;
        case 'receiver': result.receivers.push(item); break;
        case 'surface': result.surfaces.push(item); break;
      }
    });

    return result;
  }, [containers, version]);

  const objectCount = objectsByKind.rooms.length + objectsByKind.sources.length +
    objectsByKind.receivers.length + objectsByKind.surfaces.length;

  // Handlers
  const handleSelectObject = useCallback((uuid: string) => {
    setSelectedObjectId(uuid);
    postMessage('SELECT_OBJECT', uuid);
    const container = containers[uuid];
    if (container) {
      emit('SET_SELECTION', [container]);
    }
  }, [containers]);

  const handleToggleVisibility = useCallback((uuid: string) => {
    emit('TOGGLE_CONTAINER_VISIBLE', uuid);
  }, []);

  const handleDeleteObject = useCallback((uuid: string) => {
    emit('REMOVE_CONTAINERS', uuid);
    if (selectedObjectId === uuid) setSelectedObjectId(null);
  }, [selectedObjectId]);

  const handleSurfaceHover = useCallback((uuid: string) => {
    emit('SURFACE_HOVER', uuid);
  }, []);

  const handleSurfaceUnhover = useCallback((uuid: string) => {
    emit('SURFACE_UNHOVER', uuid);
  }, []);

  const selectedObject = selectedObjectId ? containers[selectedObjectId] : null;

  const renderProperties = () => {
    if (!selectedObject) return null;
    switch (selectedObject.kind) {
      case 'source': return <SourceTab uuid={selectedObjectId!} />;
      case 'receiver': return <ReceiverTab uuid={selectedObjectId!} />;
      case 'room': return <RoomTab uuid={selectedObjectId!} />;
      case 'surface': return <SurfaceTab uuid={selectedObjectId!} />;
      default: return <Typography variant="body2" color="text.secondary">Unknown object type</Typography>;
    }
  };

  const renderCategory = (
    label: string,
    items: { uuid: string; name: string; visible: boolean }[],
    type: string,
    withHover = false,
  ) => {
    if (items.length === 0) return null;

    return (
      <>
        <ListItem sx={categoryHeaderSx}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label} ({items.length})
          </Typography>
        </ListItem>
        {items.map((obj) => (
          <ObjectItem
            key={obj.uuid}
            uuid={obj.uuid}
            name={obj.name}
            type={type}
            visible={obj.visible}
            selected={selectedObjectId === obj.uuid}
            onSelect={() => handleSelectObject(obj.uuid)}
            onToggleVisibility={() => handleToggleVisibility(obj.uuid)}
            onDelete={() => handleDeleteObject(obj.uuid)}
            onHover={withHover ? () => handleSurfaceHover(obj.uuid) : undefined}
            onUnhover={withHover ? () => handleSurfaceUnhover(obj.uuid) : undefined}
          />
        ))}
      </>
    );
  };

  return (
    <Box sx={panelContainerSx}>
      {objectCount === 0 ? (
        <Box sx={emptyStateSx}>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            No objects. Import a model or add from menu.
          </Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {renderCategory('ROOMS', objectsByKind.rooms, 'room')}
          {renderCategory('SOURCES', objectsByKind.sources, 'source')}
          {renderCategory('RECEIVERS', objectsByKind.receivers, 'receiver')}
          {renderCategory('SURFACES', objectsByKind.surfaces, 'surface', true)}
        </List>
      )}

      {selectedObject && (
        <>
          <Divider />
          <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
              {selectedObject.name || selectedObject.kind} Properties
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

export default ObjectsPanel;
