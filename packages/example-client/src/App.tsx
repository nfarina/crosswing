import { Button } from "@cyber/components";
import { styled } from "@cyber/css";
import { CyberApp } from "@cyber/theme";
import Close from "@cyber/theme/icons/Close.svg";
import React, { useState } from "react";

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
        icon={<Close />}
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
