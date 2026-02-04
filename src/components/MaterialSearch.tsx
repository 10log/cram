import React, { useMemo } from 'react';
import Surface from '../objects/surface';
import { emit } from '../messenger';
import { AcousticMaterial } from '../db/acoustic-material';
import { absorptionGradient } from './AbsorptionGradient';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ObjectView from './object-view/ObjectView';
import { useAppStore, useContainer, useMaterial } from '../store';
import { pickProps } from '../common/helpers';
import { useShallow } from 'zustand/react/shallow';
import type { SxProps, Theme } from '@mui/material/styles';

const min = (a: number, b: number) => (a < b ? a : b);

// Extracted sx constants for list items (used in loop)
const LIST_ITEM_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
  px: 1,
  fontSize: '0.75rem',
  '&:hover': {
    bgcolor: 'action.hover',
  },
} as const;

const LIST_ITEM_SELECTED_SX: SxProps<Theme> = {
  ...LIST_ITEM_SX,
  bgcolor: 'primary.light',
  '&:hover': {
    bgcolor: 'primary.light',
  },
} as const;

const ABSORPTION_GRADIENT_SX: SxProps<Theme> = {
  width: 100,
  height: 16,
  borderRadius: 0.5,
} as const;

const FREQUENCY_CELL_SX: SxProps<Theme> = {
  textAlign: 'center',
  px: 0.5,
} as const;

type MaterialDrawerListItemProps = {
  item: AcousticMaterial;
}

const MaterialDrawerListItem = ({ item }: MaterialDrawerListItemProps) => {
  const { set, selectedMaterial } = useMaterial(useShallow(state => pickProps(["set", "selectedMaterial"], state)));
  const isSelected = selectedMaterial === item.uuid;

  const onClick = () => set(store => {
    store.selectedMaterial = item.uuid;
  });

  return (
    <ListItemButton
      onClick={onClick}
      selected={isSelected}
      sx={isSelected ? LIST_ITEM_SELECTED_SX : LIST_ITEM_SX}
    >
      <Typography variant="body2" sx={{ fontSize: '0.75rem', flex: 1 }}>
        {item.material}
      </Typography>
      <Box sx={{ ...ABSORPTION_GRADIENT_SX, background: absorptionGradient(item.absorption) }} />
    </ListItemButton>
  );
};

const Absorption = ({ absorption }: { absorption: AcousticMaterial["absorption"] }) => {
  const frequencies = Object.keys(absorption);
  return (
    <Box sx={{ display: 'flex', gap: 0.5, my: 1 }}>
      {frequencies.map((frequency) => (
        <Box key={`${frequency}-${(absorption as Record<string, number>)[frequency]}`} sx={FREQUENCY_CELL_SX}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {frequency}Hz
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {(absorption as Record<string, number>)[frequency]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MaterialProperties = () => {
  const material = useMaterial(state => state.materials.get(state.selectedMaterial));

  if (!material) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Nothing Selected
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {material.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">{material.material}</Typography>
        <Typography variant="caption" color="text.secondary">
          {material.uuid}
        </Typography>
      </Box>
      <Absorption absorption={material.absorption} />
    </Box>
  );
};

const MaterialList = () => {
  const { bufferLength, query, search } = useMaterial(useShallow(state => pickProps(["bufferLength", "query", "search"], state)));
  const filteredItems = useMemo(() => search(query), [query, search]);

  return (
    <List
      sx={{
        maxHeight: '25vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
        p: 0,
      }}
    >
      {filteredItems.slice(0, min(bufferLength, filteredItems.length)).map((item: AcousticMaterial) => (
        <MaterialDrawerListItem item={item} key={`item-${item.uuid}`} />
      ))}
    </List>
  );
};

const MaterialAssignButton = () => {
  const selectedObjects = useContainer(state => state.selectedObjects);
  const selectedSurfaces = useMemo(() => [...selectedObjects].filter(x => x.kind === "surface") as Surface[], [selectedObjects]);
  const selectedMaterial = useMaterial(state => state.materials.get(state.selectedMaterial));

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckIcon />}
        disabled={selectedSurfaces.length === 0}
        onClick={() => {
          if (selectedMaterial) {
            emit("ASSIGN_MATERIAL", {
              material: selectedMaterial as AcousticMaterial,
              target: selectedSurfaces
            });
          }
        }}
      >
        Assign
      </Button>
    </Box>
  );
};

export const MaterialSearch = () => {
  const { query, set } = useMaterial(useShallow(state => pickProps(["query", "set"], state)));
  const { materialDrawerOpen, set: setAppStore } = useAppStore(useShallow(state => pickProps(["materialDrawerOpen", "set"], state)));

  const setQuery = (query: string) => set(store => { store.query = query; });
  const handleClose = () => setAppStore(draft => { draft.materialDrawerOpen = false; });

  return (
    <Drawer
      anchor="right"
      open={materialDrawerOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 600,
          bgcolor: 'background.paper',
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">Material Selection</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        flex: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}>
        {/* Left Panel - Object Tree */}
        <Box sx={{
          overflow: 'auto',
          p: 2,
          borderRight: 1,
          borderColor: 'divider',
        }}>
          <ObjectView />
        </Box>

        {/* Right Panel - Materials */}
        <Box sx={{
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Search Field */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search materials..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Material List */}
          <MaterialList />

          {/* Show More Link */}
          <Link
            component="button"
            variant="body2"
            onClick={() => set(store => { store.bufferLength = store.bufferLength + 15; })}
            sx={{ mt: 1, textAlign: 'left' }}
          >
            show more...
          </Link>

          <Divider sx={{ my: 2 }} />

          {/* Material Properties */}
          <MaterialProperties />

          {/* Assign Button */}
          <MaterialAssignButton />
        </Box>
      </Box>
    </Drawer>
  );
};
