import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalculateIcon from "@mui/icons-material/Calculate";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSolver } from "../../store/solver-store";
import { useAppStore } from "../../store/app-store";
import { emit } from "../../messenger";
import SolverCard from "./SolverCard";
import RendererCard from "./RendererCard";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const listContainerSx: SxProps<Theme> = {
  overflowY: "auto",
};

const groupHeaderSx = (expanded: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: "4px 8px",
  bgcolor: expanded ? "#e8ecef" : "transparent",
  cursor: "pointer",
  userSelect: "none",
  borderBottom: "1px solid #e1e4e8",
  "&:hover": {
    bgcolor: "#e8ecef",
  },
});

const expandIconSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  mr: "4px",
  color: "#5c6670",
  "& svg": {
    fontSize: 16,
  },
};

const iconContainerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  mr: "6px",
  color: "#5c6670",
  "& svg": {
    fontSize: 14,
  },
};

const groupTitleSx: SxProps<Theme> = {
  flex: 1,
  fontSize: 12,
  fontWeight: 500,
  color: "#1c2127",
};

const countBadgeSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 14,
  height: 14,
  px: "4px",
  bgcolor: "#8c959f",
  borderRadius: "7px",
  fontSize: 10,
  fontWeight: 600,
  color: "white",
};

const autoCalcButtonSx = (active: boolean, calculating: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  ml: "6px",
  p: 0,
  border: "none",
  borderRadius: "4px",
  bgcolor: active ? "#2d72d2" : "transparent",
  color: active ? "white" : "#5c6670",
  cursor: "pointer",
  transition: "background-color 0.15s, color 0.15s",
  "&:hover": {
    bgcolor: active ? "#215db0" : "#d3d8de",
  },
  "& svg": {
    fontSize: 16,
    animation: calculating ? `${spin} 1s linear infinite` : "none",
  },
});

const groupContentSx = (expanded: boolean): SxProps<Theme> => ({
  display: expanded ? "block" : "none",
  pl: "20px",
});

const emptyStateSx: SxProps<Theme> = {
  p: "16px",
  textAlign: "center",
  color: "#8c959f",
  fontSize: 12,
};

export default function SolverCardList() {
  const [expanded, setExpanded] = useState(true);
  const solversData = useSolver((state) => state.solvers);
  const autoCalculate = useAppStore((state) => state.autoCalculate);
  const progressVisible = useAppStore((state) => state.progress.visible);

  const solverUuids = useMemo(() => {
    return Object.keys(solversData);
  }, [solversData]);

  // Count solvers + 1 for renderer
  const totalCount = solverUuids.length + 1;

  const handleAutoCalcToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't toggle expand/collapse
    emit("SET_AUTO_CALCULATE", !autoCalculate);
  };

  return (
    <Box sx={listContainerSx}>
      <Box sx={groupHeaderSx(expanded)} onClick={() => setExpanded(!expanded)}>
        <Box sx={expandIconSx}>
          {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </Box>
        <Box sx={iconContainerSx}>
          <CalculateIcon />
        </Box>
        <Box sx={groupTitleSx}>Solvers</Box>
        <Box sx={countBadgeSx}>{totalCount}</Box>
        <Box
          component="button"
          sx={autoCalcButtonSx(autoCalculate, autoCalculate && progressVisible)}
          onClick={handleAutoCalcToggle}
          title={autoCalculate ? "Auto-calculate enabled" : "Auto-calculate disabled"}
        >
          <AutorenewIcon />
        </Box>
      </Box>
      <Box sx={groupContentSx(expanded)}>
        {solverUuids.length > 0 ? (
          solverUuids.map((uuid) => (
            <SolverCard key={uuid} uuid={uuid} />
          ))
        ) : (
          <Box sx={emptyStateSx}>
            No solvers yet. Add one from the menu.
          </Box>
        )}
        <RendererCard />
      </Box>
    </Box>
  );
}
