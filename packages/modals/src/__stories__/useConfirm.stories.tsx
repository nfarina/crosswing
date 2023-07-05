import { Button } from "@cyber/components";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { ModalDecorator } from "../ModalDecorator.js";
import { useConfirm } from "../useConfirm.js";
import { ButtonContainer } from "./ButtonContainer.js";

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
      <Button primary onClick={confirm.show}>
        Skin Cat
      </Button>
    </ButtonContainer>
  );
}
