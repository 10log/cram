import React, { useState, useCallback } from "react";
import styled from "styled-components";
import SolverCardHeader from "./SolverCardHeader";
import RendererTab from "../parameter-config/RendererTab";

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

export interface RendererCardProps {
  defaultExpanded?: boolean;
}

export default function RendererCard({ defaultExpanded = false }: RendererCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <CardContainer>
      <SolverCardHeader
        name="Renderer"
        kind="renderer"
        expanded={expanded}
        onToggle={handleToggle}
      />
      <CardContent $expanded={expanded}>
        <ParameterSection>
          <RendererTab />
        </ParameterSection>
      </CardContent>
    </CardContainer>
  );
}
