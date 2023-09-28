import { styled } from "styled-components";
import { Button } from "../components/Button";
import { MobileAppFrame } from "../components/desktop/MobileAppFrame";
import { MockHostProvider } from "../host/mocks/MockHostProvider";
import { ModalRootProvider } from "../modals/context/ModalRootProvider";
import { CyberApp } from "../theme/app";
import Favicon from "./Favicon.svg?react";

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
