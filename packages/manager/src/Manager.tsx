import { ModalRootProvider } from "@cyber/modals/context";
import { CyberApp } from "@cyber/theme/app";
import React from "react";
import { styled } from "styled-components";

export function Manager() {
  return (
    <ModalRootProvider>
      <StyledManager>Manager</StyledManager>
    </ModalRootProvider>
  );
}

export const StyledManager = styled(CyberApp)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;
