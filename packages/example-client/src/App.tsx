import { Button } from "@cyber/components/Button";
import { PopupMenu, PopupMenuText } from "@cyber/components/PopupMenu";
import { ModalRootProvider } from "@cyber/modals/context";
import { usePopup } from "@cyber/modals/popup";
import { CyberApp } from "@cyber/theme/app";
import Favicon from "@cyber/theme/icons/Favicon.svg";
import React from "react";
import { styled } from "styled-components";

export function AppContainer() {
  return (
    <ModalRootProvider>
      <App />
    </ModalRootProvider>
  );
}

export function App() {
  const popupMenu = usePopup(() => (
    <PopupMenu>
      <PopupMenuText children="Hello World" />
    </PopupMenu>
  ));

  return (
    <StyledApp>
      <Button
        title="Button"
        icon={<Favicon />}
        primary
        onClick={popupMenu.onClick}
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

  > * {
    flex-grow: 0;
  }
`;
