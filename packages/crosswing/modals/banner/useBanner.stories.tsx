import { colors } from "../../theme/colors/colors";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { ModalDecorator } from "../storybook/ModalDecorator";
import {
    ModalStoryButton,
    ModalStoryButtons,
} from "../storybook/ModalStoryButtons";
import { useBanner } from "./useBanner";

export default {
  component: useBanner,
  decorators: [CrosswingAppDecorator({ layout: "fullscreen" }), ModalDecorator],
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

  return (
    <ModalStoryButtons style={{ background: colors.textBackgroundAlt() }}>
      <ModalStoryButton onClick={banner.show}>Show Banner</ModalStoryButton>
      <ModalStoryButton onClick={sticky.show}>Show Sticky</ModalStoryButton>
    </ModalStoryButtons>
  );
}
