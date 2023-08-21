import { action } from "@storybook/addon-actions";
import React from "react";
import { CyberAppDecorator } from "../../theme/storybook";
import { useAlert } from "../alert/useAlert";
import { ModalDecorator } from "../storybook/ModalDecorator";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons";

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
    <ModalStoryButtons>
      <ModalStoryButton onClick={() => alert.show("Bob")}>
        Show Alert
      </ModalStoryButton>
    </ModalStoryButtons>
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
    <ModalStoryButtons>
      <ModalStoryButton onClick={showAlert}>Show Sticky Alert</ModalStoryButton>
    </ModalStoryButtons>
  );
}

export function Stretched() {
  const alert = useAlert(() => ({ message: "Hi", onClose: action("close") }), {
    stretch: true,
  });

  return (
    <ModalStoryButtons>
      <ModalStoryButton onClick={alert.show}>Show Alert</ModalStoryButton>
    </ModalStoryButtons>
  );
}
