import { action } from "@storybook/addon-actions";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { CyberAppDecorator } from "../../theme/storybook";
import { ModalDecorator } from "../storybook/ModalDecorator";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons";
import { useActions } from "./useActions";

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
