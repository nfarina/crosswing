import { CrosswingApp } from "crosswing/app";
import { colors } from "crosswing/colors";
import { Button } from "crosswing/components/Button";
import { MobileAppFrame } from "crosswing/components/desktop/MobileAppFrame";
import { MockHostProvider } from "crosswing/host/mocks";
import { useAlert } from "crosswing/modals/alert";
import { ModalRootProvider } from "crosswing/modals/context";
import { styled } from "styled-components";
import Favicon from "./Favicon.svg?react";

export function App() {
  return (
    <MockHostProvider container="ios">
      <CrosswingApp
        colors={[
          colors.primaryGradient.override({
            light: colors.blueGradient,
          }),
        ]}
      >
        <ModalRootProvider>
          <MobileAppFrame restorationKey={App}>
            <AppContent />
          </MobileAppFrame>
        </ModalRootProvider>
      </CrosswingApp>
    </MockHostProvider>
  );
}

function AppContent() {
  const alert = useAlert(() => ({
    title: "Hello World!",
    message: "You clicked a button.",
  }));

  return (
    <StyledApp>
      <Button
        primary
        title="Hello World"
        icon={<Favicon />}
        onClick={alert.show}
      />
    </StyledApp>
  );
}

const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;
