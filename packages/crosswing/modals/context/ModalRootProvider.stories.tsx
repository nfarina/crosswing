import { Meta } from "@storybook/react";
import { colors } from "../../colors/colors.js";
import { RouterDecorator } from "../../router/storybook/RouterDecorator.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
import { ModalRootProvider, useModalContext } from "./ModalRootProvider.js";

export default {
  component: ModalRootProvider,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    RouterDecorator,
    (Story) => <ModalRootProvider>{Story()}</ModalRootProvider>,
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ModalRootProvider>;

export function ShowToast() {
  const { showToast } = useModalContext();

  return (
    <ModalStoryButtons style={{ background: colors.textBackgroundAlt() }}>
      <ModalStoryButton onClick={() => showToast("Hello World!")}>
        Show Toast
      </ModalStoryButton>
      <ModalStoryButton
        onClick={() => showToast({ title: "Message", message: "Hello World!" })}
      >
        With Title
      </ModalStoryButton>
      <ModalStoryButton
        onClick={() =>
          showToast({
            title: "Message",
            message: "Hello World!",
            sticky: true,
          })
        }
      >
        Sticky
      </ModalStoryButton>
    </ModalStoryButtons>
  );
}
