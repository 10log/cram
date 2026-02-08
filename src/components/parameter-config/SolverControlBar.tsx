import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const controlBarSx: SxProps<Theme> = {
  display: "flex",
  gap: 0.5,
  px: 0.5,
  py: 0.5,
  borderBottom: "1px solid",
  borderColor: "divider",
};

const buttonSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  py: 0.25,
  fontSize: "0.7rem",
  textTransform: "none",
};

export interface SolverControlBarProps {
  onPlayPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
  canRun?: boolean;
  hasResults?: boolean;
}

export default function SolverControlBar({
  onPlayPause,
  onStop,
  onReset,
  isRunning = false,
  canRun = true,
  hasResults = false,
}: SolverControlBarProps) {
  return (
    <Box sx={controlBarSx}>
      {onPlayPause && (
        <Tooltip title={isRunning ? "Pause simulation" : "Start simulation"} placement="top">
          <span style={{ flex: 1, display: "flex" }}>
            <Button
              variant={isRunning ? "contained" : "outlined"}
              size="small"
              sx={buttonSx}
              onClick={onPlayPause}
              disabled={!canRun}
              startIcon={isRunning ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
            >
              {isRunning ? "Pause" : "Run"}
            </Button>
          </span>
        </Tooltip>
      )}
      {onStop && (
        <Tooltip title="Stop and discard in-progress pass" placement="top">
          <span style={{ flex: 1, display: "flex" }}>
            <Button
              variant="outlined"
              size="small"
              sx={buttonSx}
              onClick={onStop}
              disabled={!isRunning}
              startIcon={<StopIcon sx={{ fontSize: 16 }} />}
            >
              Stop
            </Button>
          </span>
        </Tooltip>
      )}
      {onReset && (
        <Tooltip title="Clear all traced rays and results" placement="top">
          <span style={{ flex: 1, display: "flex" }}>
            <Button
              variant="outlined"
              size="small"
              sx={buttonSx}
              onClick={onReset}
              disabled={!hasResults || isRunning}
              startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
            >
              Reset
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  );
}
