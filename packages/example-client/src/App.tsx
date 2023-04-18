import { styled } from "@cyber/css";
import { CyberColorStyle, colors } from "@cyber/theme";
import React from "react";

export function App() {
  return (
    <StyledApp>
      <CyberColorStyle />
      Hello World
    </StyledApp>
  );
}

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  padding: 10px;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  font-size: 50px;
  font-weight: bold;
`;
