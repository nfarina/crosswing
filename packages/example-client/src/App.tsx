import { Button } from "@cyber/components/Button";
import { MobileAppFrame } from "@cyber/components/desktop/MobileAppFrame";
import { MockHostProvider } from "@cyber/host/mocks";
import { ModalRootProvider } from "@cyber/modals/context";
import { CyberApp } from "@cyber/theme/app";
import React from "react";
import { styled } from "styled-components";
import Favicon from "../icons/Favicon.svg";

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
