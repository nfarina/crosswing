import { Button } from "@cyber/components";
import { styled } from "@cyber/css";
import {
  CyberColorStyle,
  CyberFontStyle,
  CyberWebStyle,
  colors,
} from "@cyber/theme";
import React, { useState } from "react";

export function App() {
  const [working, setWorking] = useState(false);

  function onClick() {
    setWorking(true);
    setTimeout(() => setWorking(false), 1000);
  }

  return (
    <StyledApp>
      <CyberColorStyle />
      <CyberFontStyle />
      <CyberWebStyle />
      <Button primary onClick={onClick} working={working}>
        Button
      </Button>
    </StyledApp>
  );
}

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: ${colors.textBackground()};
`;
