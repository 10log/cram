import React, { useState } from "react";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import "./SettingsDrawer.css";
import { useAppStore } from "../../store";

export interface SettingsDrawerProps {
  size: number | string;
  onClose: (
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
  isOpen: boolean;
  children?: React.ReactNode | React.ReactNode[];
  onSubmit?: (((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) & ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void))
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
  const [_selectedTabId, _setSelectedTabId] = useState("renderer");
  const isOpen = useAppStore(store => store.settingsDrawerVisible);
  const set = useAppStore(store => store.set);

  const handleClose = () => set(draft => { draft.settingsDrawerVisible = false; });

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '55%',
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
        <Typography variant="h6">Settings</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="text"
            color="success"
            endIcon={<CheckIcon />}
            onClick={props.onSubmit}
          >
            Apply
          </Button>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Content would go here */}
    </Drawer>
  );
}
