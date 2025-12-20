import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useSolver, removeSolver } from "../../store/solver-store";
import { emit, on } from "../../messenger";
import SolverCardHeader from "./SolverCardHeader";
import RayTracer from "../../compute/raytracer";
import { BeamTraceSolver } from "../../compute/beam-trace";
import ImageSourceSolver from "../../compute/raytracer/image-source";

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
  const [isCalculating, setIsCalculating] = useState(false);

  const solver = useSolver((state) => state.solvers[uuid]);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    removeSolver(uuid);
  }, [uuid]);

  // Track calculation state for beam-trace solver
  useEffect(() => {
    if (!solver) return;
    if (solver.kind === "beamtrace") {
      const unsubStart = on("BEAMTRACE_CALCULATE", (id) => {
        if (id === uuid) setIsCalculating(true);
      });
      const unsubComplete = on("BEAMTRACE_CALCULATE_COMPLETE", (id) => {
        if (id === uuid) setIsCalculating(false);
      });
      return () => { unsubStart(); unsubComplete(); };
    }
  }, [solver, uuid]);

  // Check if solver can calculate (has sources and receivers configured)
  const canCalculate = useMemo(() => {
    if (!solver) return false;
    switch (solver.kind) {
      case "beamtrace": {
        const bt = solver as BeamTraceSolver;
        return bt.sourceIDs?.length > 0 && bt.receiverIDs?.length > 0;
      }
      case "image-source": {
        const is = solver as ImageSourceSolver;
        return is.sourceIDs?.length > 0 && is.receiverIDs?.length > 0;
      }
      case "ray-tracer": {
        const rt = solver as RayTracer;
        return rt.sourceIDs?.length > 0 && rt.receiverIDs?.length > 0;
      }
      case "rt60":
        return true;
      default:
        return false;
    }
  }, [solver]);

  // Calculate handler (RT60 relies on auto-calculate, so not included here)
  const handleCalculate = useCallback(() => {
    if (!solver) return;
    switch (solver.kind) {
      case "beamtrace":
        emit("BEAMTRACE_CALCULATE", uuid);
        break;
      case "image-source":
        emit("UPDATE_IMAGESOURCE", uuid);
        break;
      case "ray-tracer":
        emit("RAYTRACER_SET_PROPERTY", { uuid, property: "isRunning", value: true });
        break;
    }
  }, [solver, uuid]);

  // Clear handler
  const handleClear = useCallback(() => {
    if (!solver) return;
    switch (solver.kind) {
      case "beamtrace":
        emit("BEAMTRACE_RESET", uuid);
        break;
      case "image-source":
        emit("RESET_IMAGESOURCE", uuid);
        break;
      case "ray-tracer":
        emit("RAYTRACER_CLEAR_RAYS", uuid);
        break;
    }
  }, [solver, uuid]);

  // If solver doesn't exist (was deleted), don't render
  if (!solver) {
    return null;
  }

  // Determine if this solver supports calculate/clear
  // RT60 relies on auto-calculate, so no manual calculate button needed
  const supportsCalculate = ["beamtrace", "image-source", "ray-tracer"].includes(solver.kind);
  const supportsClear = ["beamtrace", "image-source", "ray-tracer"].includes(solver.kind);

  const ParameterComponent = SolverComponentMap.get(solver.kind);

  return (
    <CardContainer>
      <SolverCardHeader
        name={solver.name}
        kind={solver.kind}
        expanded={expanded}
        canCalculate={canCalculate}
        isCalculating={isCalculating}
        onToggle={handleToggle}
        onCalculate={supportsCalculate ? handleCalculate : undefined}
        onClear={supportsClear ? handleClear : undefined}
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
