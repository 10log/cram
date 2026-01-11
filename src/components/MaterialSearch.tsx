import React, { useMemo } from 'react';
import Surface from '../objects/surface';
import { emit } from '../messenger';
import { AcousticMaterial } from '../db/acoustic-material';
import { absorptionGradient } from './AbsorptionGradient';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ObjectView from './object-view/ObjectView';
import { useAppStore, useContainer, useMaterial } from '../store';
import { pickProps } from '../common/helpers';
import { useShallow } from 'zustand/react/shallow';

import "./MaterialSearch.css";

const min = (a: number, b: number) => (a < b ? a : b);

type MaterialDrawerListItemProps = {
  item: AcousticMaterial;
}

const MaterialDrawerListItem = ({ item }: MaterialDrawerListItemProps) => {
  const {set, selectedMaterial } = useMaterial(useShallow(state => pickProps(["set", "selectedMaterial"], state)));

  const onClick = () => set(store=>{
    store.selectedMaterial = item.uuid
  })

  return (
    <div 
      className={`material_drawer-list_item-${selectedMaterial===item.uuid?"selected":"container"}`} 
      onClick={onClick}>
      <div className="material_drawer-list_item-material">{item.material}</div>
      <div className="material_drawer-list_item-right">
        <div className="material_drawer-list_item-absorption" style={{background: `${absorptionGradient(item.absorption)}`}} />
      </div>
    </div>
  )
};

const Absorption = ({absorption}: {absorption: AcousticMaterial["absorption"]}) => {
  return (
    <div className={"material_drawer-display-material_absorption"}>
      {
        Object.keys(absorption).map((frequency) => (
          <div key={`${frequency}-${absorption[frequency]}`}>
            <div className="material_drawer-display-material_absorption-header">{frequency}Hz</div>
            <div className="material_drawer-display-material_absorption-value">{absorption[frequency]}</div>
          </div>
        ))
      }
    </div>
  )
}

const MaterialProperties = () => {
  const material = useMaterial(state => state.materials.get(state.selectedMaterial));
  return material ? (
    <div>
    <div className={"material_drawer-display-material_name"}><span>{material.name}</span></div>
    <div className={"material_drawer-display-material_material"}>
      <span>{material.material}</span>
      <span className="muted-text" style={{ textAlign: "right" }}>{material.uuid}</span>
    </div>
    <Absorption absorption={material.absorption}/>
  </div>
  ) : <div>Nothing Selected</div>
}

const MaterialList = () => {
  const { bufferLength, query, search} = useMaterial(useShallow(state=>pickProps(["bufferLength", "query", "search"], state)));
  const filteredItems = useMemo(()=>search(query), [query, search]);
  return (
    <div className="material_drawer-list" >
      {filteredItems.slice(0, min(bufferLength, filteredItems.length)).map(item => <MaterialDrawerListItem item={item} key={`item-${item.uuid}`} />)}
    </div>
  );
}

const MaterialAssignButton = () => {
  const selectedObjects = useContainer(state => state.selectedObjects);
  const selectedSurfaces = useMemo(() => [...selectedObjects].filter(x=>x.kind==="surface") as Surface[], [selectedObjects]);
  const selectedMaterial = useMaterial(state => state.materials.get(state.selectedMaterial));
  return (
    <div className={"material_drawer-display-assign_button"}>
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckIcon />}
        disabled={selectedSurfaces.length === 0}
        onClick={() => {
          if(selectedMaterial){
            emit("ASSIGN_MATERIAL", {
              material: selectedMaterial as AcousticMaterial,
              target: selectedSurfaces
            });
          }
        }}
      >
        Assign
      </Button>
    </div>
  )
}

export const MaterialSearch = () => {
  const { query, set } = useMaterial(useShallow(state=>pickProps(["query", "set"], state)));
  const {materialDrawerOpen, set: setAppStore} = useAppStore(useShallow(state=>pickProps(["materialDrawerOpen", "set"], state)));

  const setQuery = (query: string) => set(store=>{ store.query = query });
  const handleClose = () => setAppStore(draft=>{ draft.materialDrawerOpen = false });

  return (
    <Drawer
      anchor="right"
      open={materialDrawerOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: '600px',
        }
      }}
    >
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

      <div className="material_drawer-grid">
        <div className="material_drawer-surface-container">
            <ObjectView />
        </div>
        <div className="material_drawer-container">
          <div className="material_drawer-searchbar-container">
            <TextField
              size="small"
              fullWidth
              placeholder="Search materials..."
              value={query}
              onChange={e=>setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <MaterialList />
          <div>
            <button
              type="button"
              className="show-more"
              onClick={() => set(store=> { store.bufferLength = store.bufferLength + 15 })}
            >
              show more...
            </button>
          </div>
          <div className={"material_drawer-display-container"}>
            <MaterialProperties />
            <MaterialAssignButton />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

