import { Button } from "@cyber/components";
import { CyberApp } from "@cyber/theme";
import React, { useState } from "react";
import { styled } from "styled-components";
import Favicon from "../icons/Favicon.svg";

export function App() {
  const [working, setWorking] = useState(false);

  function onClick() {
    setWorking(true);
    setTimeout(() => setWorking(false), 1000);
  }

  return (
    <StyledApp>
      <Button
        text="Button"
        icon={<Favicon />}
        primary
        onClick={onClick}
        working={working}
      />
    </StyledApp>
  );
}

export const StyledApp = styled(CyberApp)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;
