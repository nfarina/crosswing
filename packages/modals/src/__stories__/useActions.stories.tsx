import { Button } from "@cyber/components/Button";
import { RouterDecorator } from "@cyber/router/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { useActions } from "../actions/useActions.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import { ButtonContainer } from "./ButtonContainer.js";

export default {
  title: "modals/useActions",
  decorators: [
    CyberAppDecorator({ layout: "fullscreen" }),
    ModalDecorator,
    RouterDecorator,
  ],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const actions = useActions(() => [
    { title: "Copy", onClick: () => action("copy")() },
    { title: "Navigate", to: "/somewhere" },
    {
      title: "Delete",
      destructive: true,
      onClick: () => action("delete")(),
    },
  ]);

  return (
    <ButtonContainer>
      <Button primary onClick={actions.show}>
        Show Actions
      </Button>
    </ButtonContainer>
  );
}
