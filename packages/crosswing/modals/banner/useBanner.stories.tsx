import { colors } from "../../colors/colors.js";
import { RouterDecorator } from "../../router/storybook/RouterDecorator.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { useAlert } from "../alert/useAlert.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
import { ModalDecorator } from "../storybook/decorators.js";
import { useBanner } from "./useBanner.js";

export default {
  component: useBanner,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    ModalDecorator,
    RouterDecorator,
  ],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const banner = useBanner(() => ({
    title: "New comment on Whole Foods",
    message: "Bob: How's the Quinoa here? I heard it's tasty.",
    onClick: () => console.log("click"),
  }));

  const sticky = useBanner(() => ({
    title: "New Version Available",
    message: "Click to update to the latest version of Crosswing.",
    sticky: true,
    onClick: () => console.log("click"),
    onClose: () => console.log("close"),
  }));

  const alert = useAlert(() => ({
    title: "Alert That Unmounts",
    message:
      "The banner should remain visible after clicking OK to dismiss the Alert.",
    children: <ShowBannerButton />,
  }));

  return (
    <ModalStoryButtons style={{ background: colors.textBackgroundAlt() }}>
      <ModalStoryButton onClick={banner.show}>Show Banner</ModalStoryButton>
      <ModalStoryButton onClick={sticky.show}>Show Sticky</ModalStoryButton>
      <ModalStoryButton onClick={alert.show}>Show Alert First</ModalStoryButton>
    </ModalStoryButtons>
  );
}

function ShowBannerButton() {
  const banner = useBanner(() => ({
    title: "New comment on Whole Foods",
    message: "Bob: How's the Quinoa here? I heard it's tasty.",
    sticky: true,
    onClick: () => console.log("click"),
  }));

  return (
    <ModalStoryButton style={{ margin: "10px" }} onClick={banner.show}>
      Show Sticky Banner
    </ModalStoryButton>
  );
}
