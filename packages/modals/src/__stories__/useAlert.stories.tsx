import { Button, ProgressView } from "@cyber/components";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { styled } from "styled-components";
import { ModalDecorator } from "../ModalDecorator.js";
import { useAlert } from "../useAlert.js";

export default {
  title: "modals/useAlert",
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Alert() {
  const alert = useAlert((name: string) => ({
    message: `Hello ${name}!`,
    onClose: action("close"),
  }));

  return (
    <ButtonContainer>
      <Button onClick={() => alert.show("Bob")}>Show Alert</Button>
    </ButtonContainer>
  );
}

export function StickyAlert() {
  const alert = useAlert(
    () => ({
      title: "Working…",
      message: (
        <>
          <br />
          <ProgressView size="50px" />
        </>
      ),
      hideButtons: true,
    }),
    { sticky: true },
  );

  function showAlert() {
    alert.show();
    setTimeout(() => alert.hide(), 5000);
  }

  return (
    <ButtonContainer>
      <Button onClick={showAlert}>Show Sticky Alert</Button>
    </ButtonContainer>
  );
}

export function StretchedAlert() {
  const alert = useAlert(() => ({ message: "Hi", onClose: action("close") }), {
    stretch: true,
  });

  return (
    <ButtonContainer>
      <Button onClick={alert.show}>Show Alert</Button>
    </ButtonContainer>
  );
}

//
// Styles
//

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: 10px;
  }
`;
