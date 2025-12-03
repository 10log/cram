import React, { useEffect, useRef } from "react";

import { useResult, getResultKeys, ResultStore } from "../store/result-store";

import { v4 as uuid } from 'uuid';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import LTPChart from "./results/LTPChart";
import RT60Chart from "./results/RT60Chart";
import { ParentSize } from "@visx/responsive";
import PanelEmptyText from "./panel-container/PanelEmptyText";



const TabTitle = ({ uuid }) => {
  const name = useResult((state) => state.results[uuid].name);
  return <span>{name}</span>;
};


const resultKeys = (state: ResultStore) => Object.keys(state.results);

export const ResultsPanel = () => {
  const keys = useResult(useShallow(resultKeys));
  const [index, setIndex] = useState(0); 

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
          <TabPanel key={key}><ChartSelect uuid={key}/>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  ) : <PanelEmptyText>No Results Yet!</PanelEmptyText>;
};

const ChartSelect = (uuid) => {
  const kind = useResult((state) => state.results[uuid.uuid]?.kind);

  switch (kind) {
    case "linear-time-progression":
      return <LTPChart uuid={uuid.uuid} events />

    case "statisticalRT60":
      return <RT60Chart uuid={uuid.uuid} events />

    default:
      return null;
  }
};
