import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import type { SxProps, Theme } from "@mui/material/styles";
import { on } from "../messenger";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const containerSx = (visible: boolean): SxProps<Theme> => ({
  position: "fixed",
  bottom: 16,
  right: 16,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  p: "8px 14px",
  bgcolor: "rgba(255, 255, 255, 0.95)",
  border: "1px solid #d0d7de",
  borderRadius: "6px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
  animation: `${visible ? slideIn : slideOut} 0.2s ease-out forwards`,
  pointerEvents: visible ? "auto" : "none",
  fontSize: 12,
});

const spinnerSx: SxProps<Theme> = {
  width: 14,
  height: 14,
  border: "2px solid #2d72d2",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 0.8s linear infinite`,
};

interface ProgressState {
  visible: boolean;
  message: string;
  solverCount: number;
}

export const AutoCalculateProgress: React.FC = () => {
  const [state, setState] = useState<ProgressState>({
    visible: false,
    message: "",
    solverCount: 0
  });

  useEffect(() => {
    const unsubShow = on("SHOW_AUTO_CALC_PROGRESS", ({ message, solverCount }) => {
      setState({ visible: true, message, solverCount });
    });

    const unsubHide = on("HIDE_AUTO_CALC_PROGRESS", () => {
      setState((prev) => ({ ...prev, visible: false }));
    });

    return () => {
      unsubShow();
      unsubHide();
    };
  }, []);

  // Don't render when not visible
  if (!state.visible) {
    return null;
  }

  return (
    <Box sx={containerSx(state.visible)}>
      <Box sx={spinnerSx} />
      <Typography component="span" sx={{ color: "#1c2127", whiteSpace: "nowrap" }}>
        {state.message}
      </Typography>
      {state.solverCount > 1 && (
        <Typography component="span" sx={{ color: "#5c7080", fontSize: 11 }}>
          ({state.solverCount} solvers)
        </Typography>
      )}
    </Box>
  );
};

export default AutoCalculateProgress;
