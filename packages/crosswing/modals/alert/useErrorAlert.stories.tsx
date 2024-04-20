import { CrosswingAppDecorator } from "../../storybook.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
import { useErrorAlert } from "./useErrorAlert.js";

export default {
  component: useErrorAlert,
  decorators: [CrosswingAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function ErrorString() {
  const errorAlert = useErrorAlert();

  return (
    <ModalStoryButtons>
      <ModalStoryButton
        onClick={() => errorAlert.show("Something bad happened!")}
      >
        Show Error Alert
      </ModalStoryButton>
    </ModalStoryButtons>
  );
}

export function ErrorObject() {
  const errorAlert = useErrorAlert();

  return (
    <ModalStoryButtons>
      <ModalStoryButton
        onClick={() => errorAlert.show(new Error("Something bad happened!"))}
      >
        Show Error Alert
      </ModalStoryButton>
    </ModalStoryButtons>
  );
}
