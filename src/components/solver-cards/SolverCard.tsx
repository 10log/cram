import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useSolver, removeSolver } from "../../store/solver-store";
import { emit } from "../../messenger";
import SolverCardHeader from "./SolverCardHeader";
import RayTracer from "../../compute/raytracer";

// Import solver parameter components
import RayTracerTab from "../parameter-config/RayTracerTab";
import { ImageSourceTab } from "../parameter-config/image-source-tab/ImageSourceTab";
import RT60Tab from "../parameter-config/RT60Tab";
import FDTD_2DTab from "../parameter-config/FDTD_2DTab";
import EnergyDecayTab from "../parameter-config/EnergyDecayTab";
import ARTTab from "../parameter-config/ARTTab";
import BeamTraceTab from "../parameter-config/BeamTraceTab";

const CardContainer = styled.div`
  border-bottom: 1px solid #e1e4e8;
`;

const CardContent = styled.div<{ $expanded: boolean }>`
  display: ${(props) => (props.$expanded ? "block" : "none")};
  padding-left: 20px;
`;

const ParameterSection = styled.div`
  padding: 4px 0;
`;

/**
 * Maps solver kind to its parameter configuration component
 */
const SolverComponentMap = new Map<string, React.ComponentType<{ uuid: string }>>([
  ["image-source", ImageSourceTab],
  ["ray-tracer", RayTracerTab],
  ["rt60", RT60Tab],
  ["fdtd-2d", FDTD_2DTab],
  ["energydecay", EnergyDecayTab],
  ["art", ARTTab],
  ["beam-trace", BeamTraceTab],
]);

export interface SolverCardProps {
  uuid: string;
  defaultExpanded?: boolean;
}

export default function SolverCard({ uuid, defaultExpanded = false }: SolverCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const solver = useSolver((state) => state.solvers[uuid]);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    removeSolver(uuid);
  }, [uuid]);

  const handleRunningToggle = useCallback(() => {
    if (solver && 'isRunning' in solver) {
      const isRunning = (solver as RayTracer).isRunning;
      emit("RAYTRACER_SET_PROPERTY", { uuid, property: "isRunning", value: !isRunning });
    }
  }, [solver, uuid]);

  // Check if solver can run (has sources and receivers configured)
  const canRun = useMemo(() => {
    if (!solver || solver.kind !== "ray-tracer") return false;
    const rt = solver as RayTracer;
    return rt.sourceIDs?.length > 0 && rt.receiverIDs?.length > 0;
  }, [solver]);

  // If solver doesn't exist (was deleted), don't render
  if (!solver) {
    return null;
  }

  const ParameterComponent = SolverComponentMap.get(solver.kind);

  return (
    <CardContainer>
      <SolverCardHeader
        name={solver.name}
        kind={solver.kind}
        expanded={expanded}
        isRunning={'isRunning' in solver && (solver as { isRunning: boolean }).isRunning}
        canRun={canRun}
        onToggle={handleToggle}
        onRunningToggle={handleRunningToggle}
        onDelete={handleDelete}
      />
      <CardContent $expanded={expanded}>
        {ParameterComponent && (
          <ParameterSection>
            <ParameterComponent uuid={uuid} />
          </ParameterSection>
        )}
      </CardContent>
    </CardContainer>
  );
}
