import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import { ModalDecorator } from "../storybook/ModalDecorator";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons";
import { useConfirm } from "./useConfirm";

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
    <ModalStoryButtons>
      <ModalStoryButton onClick={confirm.show}>Skin Cat</ModalStoryButton>
    </ModalStoryButtons>
  );
}
