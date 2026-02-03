import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import SolverCardHeader from "./SolverCardHeader";
import RendererTab from "../parameter-config/RendererTab";

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

export interface RendererCardProps {
  defaultExpanded?: boolean;
}

export default function RendererCard({ defaultExpanded = false }: RendererCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <Box sx={cardContainerSx}>
      <SolverCardHeader
        name="Renderer"
        kind="renderer"
        expanded={expanded}
        onToggle={handleToggle}
      />
      <Box sx={cardContentSx(expanded)}>
        <Box sx={parameterSectionSx}>
          <RendererTab />
        </Box>
      </Box>
    </Box>
  );
}
