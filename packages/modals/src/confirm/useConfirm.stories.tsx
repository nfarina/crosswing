import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Button, ButtonContainer } from "../storybook/Button.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import { useConfirm } from "./useConfirm.js";

export default {
  component: useConfirm,
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
