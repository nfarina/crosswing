import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { useConfirm } from "../confirm/useConfirm.js";
import { ButtonContainer, ModalDecorator } from "../storybook/index.js";
import { Button } from "./Button.js";

export default {
  title: "modals/useConfirm",
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const confirm = useConfirm(() => ({
    title: "Skin Cat",
    message: "Are you sure you want to skin the cat this particular way?",
    destructiveText: "Skin it",
    onConfirm: () => action("skinned")(),
  }));

  return (
    <ButtonContainer>
      <Button onClick={confirm.show}>Skin Cat</Button>
    </ButtonContainer>
  );
}
