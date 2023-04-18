import { styled } from "@cyber/css";
import {
  CyberColorStyle,
  CyberFontStyle,
  CyberWebStyle,
  colors,
  fonts,
} from "@cyber/theme";
import React from "react";

export function App() {
  return (
    <StyledApp>
      <CyberColorStyle />
      <CyberFontStyle />
      <CyberWebStyle />
      Lorem Ipsum
    </StyledApp>
  );
}

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  padding: 10px;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  font: ${fonts.firaSansBlack({ size: 40 })};
`;
