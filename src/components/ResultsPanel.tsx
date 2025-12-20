import React, { memo, useCallback, useEffect } from "react";

import { useResult, ResultStore } from "../store/result-store";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { on } from "../messenger";

import LTPChart from "./results/LTPChart";
import RT60Chart from "./results/RT60Chart";
import ImpulseResponseChart from "./results/ImpulseResponseChart";
import PanelEmptyText from "./panel-container/PanelEmptyText";



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
      if (currentKeys.length <= 1) {
        switchToResultTab(e.uuid);
      }
    });
  }, [switchToResultTab]);

  // When a result is selected from ResultPreview, switch to that tab
  useEffect(() => {
    return on("SELECT_RESULT_TAB", (uuid: string) => switchToResultTab(uuid));
  }, [switchToResultTab]);

  return keys.length > 0 ? (
    <div
      style={{
        margin: "0",
        background: "#fff"
      }}
    >
      <Tabs
        selectedIndex={index}
        onSelect={(index) => {
          // set((store)=>{store.openTabIndex=index})
          setIndex(index);
        }}
      >
        <TabList>
          {keys.map((key) => (
            <Tab key={key}>
              <TabTitle uuid={key} />
            </Tab>
          ))}
        </TabList>
        {keys.map((key) => (
          <TabPanel key={key}>
            <ChartSelect uuid={key} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
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
