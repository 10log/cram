import React, {useEffect, useMemo, useState} from 'react';
import {on} from '../../messenger';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

import './ParameterConfig.css';
import RayTracerTab from './RayTracerTab';
import RendererTab from './RendererTab';
import FDTD_2DTab from './FDTD_2DTab';
import { ImageSourceTab } from './image-source-tab/ImageSourceTab';
import { useContainer, useSolver } from '../../store';
import RT60Tab from './RT60Tab';
import EnergyDecayTab from './EnergyDecayTab';
import RoomTab from './RoomTab';
import SourceTab from './SourceTab';
import ReceiverTab from './ReceiverTab';
import SurfaceTab from './SurfaceTab';
import ARTTab from './ARTTab';
import BeamTraceTab from './BeamTraceTab';
import type Container from '../../objects/container';

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  index: string;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

const selectContainerSx: SxProps<Theme> = {
  display: "grid",
  m: "0 1em 1em 1em",
};

const tabTextSx: SxProps<Theme> = {
  userSelect: "none",
};

export interface ParameterConfigState {
  selectedTabIndex: number;
  tabNames: string[];
}

type TabComponentProps = { uuid: string };
type TabComponent = React.ComponentType<TabComponentProps>;

const SolverComponentMap = new Map<string, TabComponent>([
  ["image-source", ImageSourceTab],
  ["ray-tracer", RayTracerTab],
  ["rt60", RT60Tab],
  ["fdtd-2d", FDTD_2DTab],
  ["energydecay", EnergyDecayTab],
  ["art", ARTTab],
  ["beam-trace", BeamTraceTab]
]);

const ObjectComponentMap = new Map<string, TabComponent>([
  ["room", RoomTab],
  ["source", SourceTab],
  ["receiver", ReceiverTab],
  ["surface", SurfaceTab],
]);

const SolverOptionTitle = ({ uuid }: { uuid: string }) => {
  const name = useSolver((state) => state.solvers[uuid].name);
  return (
    <option value={uuid}>{name}</option>
  );
};



export const SolversTab = () => {
  const solversData = useSolver((state) => state.solvers);
  const solvers = useMemo(() => {
    const map = new Map<string, string>();
    Object.keys(solversData).forEach(key => {
      map.set(key, solversData[key].kind);
    });
    return map;
  }, [solversData]);
  const [_index, _setIndex] = useState(0);
  useEffect(() => {
    return on("NEW", () => _setIndex(0));
  }, []);
  const [selectedSolverId, setSelectedSolverId] = useState("choose");


  const SolverParameterConfig = SolverComponentMap.get(solvers.get(selectedSolverId)!)!;
  return (
    <div>
      <Box sx={selectContainerSx}>
        <select value={selectedSolverId} onChange={event => setSelectedSolverId(event.currentTarget.value)}>
          <option value="choose">Choose a Solver</option>
          {[...solvers].map(([uuid, _], i) => <SolverOptionTitle key={`${uuid}-${i}-tab`} uuid={uuid} />)}
        </select>
      </Box>
      {solvers.has(selectedSolverId) ? <SolverParameterConfig uuid={selectedSolverId} /> : <></>}
    </div>
  );
};


const ObjectOptionTitle = ({ uuid }: { uuid: string }) => {
  const name = useContainer((state) => state.containers[uuid].name);
  return (
    <option value={uuid}>{name}</option>
  );
};

export const ObjectsTab = () => {
  const containersData = useContainer((state) => state.containers);
  const objects = useMemo(() => {
    const map = new Map<string, string>();
    Object.keys(containersData).forEach(key => {
      map.set(key, containersData[key].kind);
    });
    return map;
  }, [containersData]);
  const [_index, _setIndex] = useState(0);

  const [selectedObjectId, setSelectedObjectId] = useState("choose");

  useEffect(() => {
    return on("NEW", () => _setIndex(0));
  }, []);
  useEffect(() => {
    return on("SET_SELECTION", (containers: Container[]) => {
      setSelectedObjectId(containers[0].uuid);
    });
  }, []);
  useEffect(() => {
    return on("APPEND_SELECTION", (containers: Container[]) => {
      setSelectedObjectId(containers[containers.length - 1].uuid);
    });
  }, []);
  const validSelection = selectedObjectId && objects.has(selectedObjectId);
  const ObjectParameterConfig = ObjectComponentMap.get(objects.get(selectedObjectId)!)!;
  return (
    <div>
      <Box sx={selectContainerSx}>
        <select value={selectedObjectId} onChange={event => setSelectedObjectId(event.currentTarget.value)}>
        <option value="choose">Choose an Object</option>
          {[...objects].map(([uuid, _], i) => <ObjectOptionTitle key={`${uuid}-${i}-tab`} uuid={uuid} />)}
        </select>
      </Box>
      {validSelection ? <ObjectParameterConfig uuid={selectedObjectId} /> : <></>}
    </div>
  );
};





export const ParameterConfig = () => {
  const [_index, _setIndex] = useState(0);
  useEffect(() => {
    return on("NEW", () => _setIndex(0));
  }, []);

  const [selectedTabId, setSelectedTabId] = useState("renderer")

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTabId(newValue);
  };

  return (
    <div className="parameter-config-tabs-container">
      <Tabs
        value={selectedTabId}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="renderer" label={<Typography sx={tabTextSx}>Renderer</Typography>} />
        <Tab value="solvers" label={<Typography sx={tabTextSx}>Solvers</Typography>} />
        <Tab value="objects" label={<Typography sx={tabTextSx}>Objects</Typography>} />
      </Tabs>
      <TabPanel value={selectedTabId} index="renderer">
        <RendererTab />
      </TabPanel>
      <TabPanel value={selectedTabId} index="solvers">
        <SolversTab />
      </TabPanel>
      <TabPanel value={selectedTabId} index="objects">
        <ObjectsTab />
      </TabPanel>
    </div>
  );
};
 