import { CyberApp } from "@cyber/theme";
import React from "react";
import { styled } from "styled-components";

export function Manager() {
  return <StyledManager>Manager</StyledManager>;
}

export const StyledManager = styled(CyberApp)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;
