import React, { memo, useCallback, useEffect } from "react";

import { useResult, ResultStore } from "../store/result-store";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { on } from "../messenger";

import Box from "@mui/material/Box";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import type { SxProps, Theme } from "@mui/material/styles";

import LTPChart from "./results/LTPChart";
import RT60Chart from "./results/RT60Chart";
import ImpulseResponseChart from "./results/ImpulseResponseChart";
import PanelEmptyText from "./panel-container/PanelEmptyText";

const tabsSx: SxProps<Theme> = {
  minHeight: 28,
  bgcolor: "action.hover",
  borderBottom: 1,
  borderColor: "divider",
  "& .MuiTabs-indicator": {
    height: 2,
  },
};

const tabSx: SxProps<Theme> = {
  minHeight: 28,
  py: 0,
  px: 1.5,
  fontSize: "0.75rem",
  textTransform: "none",
  minWidth: 0,
};

const TabTitle = memo(({ uuid }: { uuid: string }) => {
  const name = useResult((state) => state.results[uuid].name);
  return <span>{name}</span>;
});


const resultKeys = (state: ResultStore) => Object.keys(state.results);

export const ResultsPanel = () => {
  const keys = useResult(useShallow(resultKeys));
  const [index, setIndex] = useState(0);

  // Shared logic for switching to a result tab by uuid
  const switchToResultTab = useCallback((resultUuid: string) => {
    setTimeout(() => {
      const currentKeys = Object.keys(useResult.getState().results);
      const newIndex = currentKeys.indexOf(resultUuid);
      if (newIndex !== -1) {
        setIndex(newIndex);
      }
    }, 0);
  }, []);

  // When a new result is added, only switch if it's the first result
  // This prevents auto-calculate from disrupting the user's current view
  useEffect(() => {
    return on("ADD_RESULT", (e) => {
      const currentKeys = Object.keys(useResult.getState().results);
      // Only auto-switch if this is the first result (list was empty before this add)
      if (currentKeys.length === 1) {
        switchToResultTab(e.uuid);
      }
    });
  }, [switchToResultTab]);

  // When a result is selected from ResultPreview, switch to that tab
  useEffect(() => {
    return on("SELECT_RESULT_TAB", (uuid: string) => switchToResultTab(uuid));
  }, [switchToResultTab]);

  // Clamp index if results were removed
  const safeIndex = Math.min(index, Math.max(keys.length - 1, 0));
  const activeKey = keys[safeIndex];

  return keys.length > 0 ? (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MuiTabs
        value={safeIndex}
        onChange={(_e, newIndex) => setIndex(newIndex)}
        variant="scrollable"
        scrollButtons="auto"
        sx={tabsSx}
      >
        {keys.map((key) => (
          <MuiTab key={key} label={<TabTitle uuid={key} />} sx={tabSx} />
        ))}
      </MuiTabs>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {activeKey && <ChartSelect uuid={activeKey} />}
      </Box>
    </Box>
  ) : <PanelEmptyText>No Results Yet!</PanelEmptyText>;
};

const ChartSelect = memo(({ uuid }: { uuid: string }) => {
  const kind = useResult((state) => state.results[uuid]?.kind);

  switch (kind) {
    case "linear-time-progression":
      return <LTPChart uuid={uuid} events />

    case "statisticalRT60":
      return <RT60Chart uuid={uuid} events />

    case "impulseResponse":
      return <ImpulseResponseChart uuid={uuid} events />

    default:
      return null;
  }
});

declare global {
  interface EventTypes {
    SELECT_RESULT_TAB: string;
  }
}
