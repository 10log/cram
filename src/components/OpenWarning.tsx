import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";

export interface OpenWarningProps {
  isOpen: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onDiscard: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onSave: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

function OpenWarning(props: OpenWarningProps) {
  return (
    <Dialog
      open={props.isOpen}
      transitionDuration={100}
    >
      <DialogContent>
        <Typography>This project has unsaved changes</Typography>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            onClick={props.onDiscard}
            color="warning"
          >
            Discard Changes
          </Button>
        </Box>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={props.onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { OpenWarning };

export default OpenWarning;
