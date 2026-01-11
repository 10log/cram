import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { emit } from '../messenger';
import { useAppStore } from '../store/app-store';
import { pickProps } from '../common/helpers';

export const SaveDialog = () => {
  const { projectName, saveDialogVisible, set } = useAppStore(useShallow(store => pickProps(["projectName", "saveDialogVisible", "set"], store)));
  const [fileName, setFileName] = useState(projectName);

  const handleClose = () => {
    set(store => { store.saveDialogVisible = false; });
  };

  const handleSave = () => {
    emit("SAVE", handleClose);
  };

  return (
    <Dialog
      open={saveDialogVisible}
      onClose={handleClose}
      transitionDuration={100}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Save Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="File name"
          type="text"
          fullWidth
          variant="outlined"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveDialog;