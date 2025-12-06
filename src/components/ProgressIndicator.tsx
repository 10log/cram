import React from "react";
import styled, { keyframes } from "styled-components";
import { useAppStore } from "../store/app-store";

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 50px; /* Below navbar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${(props) => (props.$visible ? slideIn : slideOut)} 0.2s ease-out forwards;
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
`;

const Message = styled.span`
  font-size: 12px;
  color: #1c2127;
  white-space: nowrap;
`;

const ProgressBarContainer = styled.div`
  width: 120px;
  height: 4px;
  background: #e1e4e8;
  border-radius: 2px;
  overflow: hidden;
`;

const indeterminateAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const ProgressBarFill = styled.div<{ $progress: number; $indeterminate: boolean }>`
  height: 100%;
  background: #2d72d2;
  border-radius: 2px;
  transition: width 0.2s ease-out;
  width: ${(props) => (props.$indeterminate ? "50%" : `${props.$progress}%`)};
  animation: ${(props) => (props.$indeterminate ? indeterminateAnimation : "none")} 1s ease-in-out infinite;
`;

export const ProgressIndicator: React.FC = () => {
  const progress = useAppStore((state) => state.progress);

  if (!progress.visible) {
    return null;
  }

  const isIndeterminate = progress.progress < 0;

  return (
    <Container $visible={progress.visible}>
      <Message>{progress.message}</Message>
      <ProgressBarContainer>
        <ProgressBarFill $progress={progress.progress} $indeterminate={isIndeterminate} />
      </ProgressBarContainer>
      {!isIndeterminate && (
        <Message>{Math.round(progress.progress)}%</Message>
      )}
    </Container>
  );
};

export default ProgressIndicator;
