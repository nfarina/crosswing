import { styled } from "@cyber/css";
import { CyberColorStyle, CyberFontStyle, colors, fonts } from "@cyber/theme";
import React from "react";

export function App() {
  return (
    <StyledApp>
      <CyberColorStyle />
      <CyberFontStyle />
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
