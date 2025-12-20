import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { on } from "../messenger";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d0d7de;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  animation: ${(props) => (props.$visible ? slideIn : slideOut)} 0.2s ease-out forwards;
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
  font-size: 12px;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid #2d72d2;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.span`
  color: #1c2127;
  white-space: nowrap;
`;

const SolverCount = styled.span`
  color: #5c7080;
  font-size: 11px;
`;

interface ProgressState {
  visible: boolean;
  message: string;
  solverCount: number;
}

export const AutoCalculateProgress: React.FC = () => {
  const [state, setState] = useState<ProgressState>({
    visible: false,
    message: "",
    solverCount: 0
  });

  useEffect(() => {
    const unsubShow = on("SHOW_AUTO_CALC_PROGRESS", ({ message, solverCount }) => {
      setState({ visible: true, message, solverCount });
    });

    const unsubHide = on("HIDE_AUTO_CALC_PROGRESS", () => {
      setState((prev) => ({ ...prev, visible: false }));
    });

    return () => {
      unsubShow();
      unsubHide();
    };
  }, []);

  // Don't render when not visible
  if (!state.visible) {
    return null;
  }

  return (
    <Container $visible={state.visible}>
      <Spinner />
      <Message>{state.message}</Message>
      {state.solverCount > 1 && (
        <SolverCount>({state.solverCount} solvers)</SolverCount>
      )}
    </Container>
  );
};

export default AutoCalculateProgress;
