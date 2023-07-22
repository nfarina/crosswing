import { RouterDecorator } from "@cyber/router/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Button } from "../storybook/Button.js";
import { ButtonContainer, ModalDecorator } from "../storybook/index.js";
import { useActions } from "./useActions.js";

export default {
  component: useActions,
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
      <Button onClick={actions.show}>Show Actions</Button>
    </ButtonContainer>
  );
}
