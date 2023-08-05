import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { useAlert } from "../alert/useAlert.js";
import { Button, ButtonContainer } from "../storybook/Button.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";

export default {
  component: useAlert,
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
      <Button onClick={() => alert.show("Bob")}>Show Alert</Button>
    </ButtonContainer>
  );
}

export function Sticky() {
  const alert = useAlert(
    () => ({
      title: "Working…",
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

export function Stretched() {
  const alert = useAlert(() => ({ message: "Hi", onClose: action("close") }), {
    stretch: true,
  });

  return (
    <ButtonContainer>
      <Button onClick={alert.show}>Show Alert</Button>
    </ButtonContainer>
  );
}
