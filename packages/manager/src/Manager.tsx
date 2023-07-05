import { CyberApp } from "@cyber/theme";
import React from "react";
import { styled } from "styled-components";
import { ModalRootProvider } from "../../modals/src/ModalRootProvider.js";

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
