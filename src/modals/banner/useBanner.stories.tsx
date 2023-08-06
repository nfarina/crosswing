import React from "react";
import { colors } from "../../theme/colors/colors.js";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons.js";
import { useBanner } from "./useBanner.js";

export default {
  component: useBanner,
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
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
    message: "Click to update to the latest version of Cyber.",
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
