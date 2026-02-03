import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useSolver, removeSolver } from "../../store/solver-store";
import { emit, on } from "../../messenger";
import SolverCardHeader from "./SolverCardHeader";

// Lazy load solver parameter components for code splitting
const RayTracerTab = lazy(() => import("../parameter-config/RayTracerTab"));
const ImageSourceTab = lazy(() => import("../parameter-config/image-source-tab/ImageSourceTab").then(m => ({ default: m.ImageSourceTab })));
const RT60Tab = lazy(() => import("../parameter-config/RT60Tab"));
const FDTD_2DTab = lazy(() => import("../parameter-config/FDTD_2DTab"));
const EnergyDecayTab = lazy(() => import("../parameter-config/EnergyDecayTab"));
const ARTTab = lazy(() => import("../parameter-config/ARTTab"));
const BeamTraceTab = lazy(() => import("../parameter-config/BeamTraceTab"));

const cardContainerSx: SxProps<Theme> = {
  borderBottom: "1px solid #e1e4e8",
};

const cardContentSx = (expanded: boolean): SxProps<Theme> => ({
  display: expanded ? "block" : "none",
  pl: "20px",
});

const parameterSectionSx: SxProps<Theme> = {
  py: "4px",
};

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
  // Using duck typing to avoid importing solver classes
  const canCalculate = useMemo(() => {
    if (!solver) return false;
    // Duck type for solvers with sourceIDs/receiverIDs
    const s = solver as { sourceIDs?: string[]; receiverIDs?: string[] };
    switch (solver.kind) {
      case "beamtrace":
      case "image-source":
      case "ray-tracer":
        return (s.sourceIDs?.length ?? 0) > 0 && (s.receiverIDs?.length ?? 0) > 0;
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
    <Box sx={cardContainerSx}>
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
      <Box sx={cardContentSx(expanded)}>
        {ParameterComponent && (
          <Box sx={parameterSectionSx}>
            <Suspense fallback={<div style={{ padding: '8px', color: '#666' }}>Loading...</div>}>
              <ParameterComponent uuid={uuid} />
            </Suspense>
          </Box>
        )}
      </Box>
    </Box>
  );
}
