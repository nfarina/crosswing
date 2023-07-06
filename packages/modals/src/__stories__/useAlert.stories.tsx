import { Button } from "@cyber/components/Button";
import { ProgressView } from "@cyber/components/ProgressView";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { useAlert } from "../alert/useAlert.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import { ButtonContainer } from "./ButtonContainer.js";

export default {
  title: "modals/useAlert",
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const alert = useAlert((name: string) => ({
    message: `Hello ${name}!`,
    onClose: action("close"),
  }));

  return (
    <ButtonContainer>
      <Button primary onClick={() => alert.show("Bob")}>
        Show Alert
      </Button>
    </ButtonContainer>
  );
}

export function Sticky() {
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
      <Button primary onClick={showAlert}>
        Show Sticky Alert
      </Button>
    </ButtonContainer>
  );
}

export function Stretched() {
  const alert = useAlert(() => ({ message: "Hi", onClose: action("close") }), {
    stretch: true,
  });

  return (
    <ButtonContainer>
      <Button primary onClick={alert.show}>
        Show Alert
      </Button>
    </ButtonContainer>
  );
}
