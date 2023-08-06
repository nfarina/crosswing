import React from "react";
import { styled } from "styled-components";
import { Button } from "../components/Button.js";
import { MobileAppFrame } from "../components/desktop/MobileAppFrame.js";
import { MockHostProvider } from "../host/mocks/MockHostProvider.js";
import { ModalRootProvider } from "../modals/context/ModalRootProvider.js";
import { CyberApp } from "../theme/app.js";
import Favicon from "./Favicon.svg";

export function App() {
  return (
    <MockHostProvider container="ios">
      <CyberApp>
        <ModalRootProvider>
          <MobileAppFrame restorationKey={App}>
            <AppContent />
          </MobileAppFrame>
        </ModalRootProvider>
      </CyberApp>
    </MockHostProvider>
  );
}

function AppContent() {
  return (
    <StyledApp>
      <Button primary title="Hello World" icon={<Favicon />} />
    </StyledApp>
  );
}

const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;
