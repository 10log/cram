import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import type { SxProps, Theme } from "@mui/material/styles";
import { useAppStore } from "../store/app-store";

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const indeterminateAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const containerSx = (visible: boolean): SxProps<Theme> => ({
  position: "fixed",
  top: 50, // Below navbar
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  p: "8px 16px",
  bgcolor: "#fff",
  border: "1px solid #d0d7de",
  borderRadius: "6px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  animation: `${visible ? slideIn : slideOut} 0.2s ease-out forwards`,
  pointerEvents: visible ? "auto" : "none",
});

const messageSx: SxProps<Theme> = {
  fontSize: 12,
  color: "#1c2127",
  whiteSpace: "nowrap",
};

const progressBarContainerSx: SxProps<Theme> = {
  width: 120,
  height: 4,
  bgcolor: "#e1e4e8",
  borderRadius: "2px",
  overflow: "hidden",
};

const progressBarFillSx = (progress: number, indeterminate: boolean): SxProps<Theme> => ({
  height: "100%",
  bgcolor: "#2d72d2",
  borderRadius: "2px",
  transition: "width 0.2s ease-out",
  width: indeterminate ? "50%" : `${progress}%`,
  animation: indeterminate ? `${indeterminateAnimation} 1s ease-in-out infinite` : "none",
});

export const ProgressIndicator: React.FC = () => {
  const progress = useAppStore((state) => state.progress);

  if (!progress.visible) {
    return null;
  }

  const isIndeterminate = progress.progress < 0;

  return (
    <Box sx={containerSx(progress.visible)}>
      <Typography component="span" sx={messageSx}>
        {progress.message}
      </Typography>
      <Box sx={progressBarContainerSx}>
        <Box sx={progressBarFillSx(progress.progress, isIndeterminate)} />
      </Box>
      {!isIndeterminate && (
        <Typography component="span" sx={messageSx}>
          {Math.round(progress.progress)}%
        </Typography>
      )}
    </Box>
  );
};

export default ProgressIndicator;
