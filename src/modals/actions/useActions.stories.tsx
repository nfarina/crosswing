import { action } from "@storybook/addon-actions";
import React from "react";
import { RouterDecorator } from "../../router/storybook/RouterDecorator.js";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
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
    <ModalStoryButtons>
      <ModalStoryButton onClick={actions.show}>Show Actions</ModalStoryButton>
    </ModalStoryButtons>
  );
}
