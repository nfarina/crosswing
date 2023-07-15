import { colors } from "@cyber/theme/colors";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { useBanner } from "../banner/useBanner.js";
import { ButtonContainer, ModalDecorator } from "../storybook/index.js";
import { Button } from "./Button.js";

export default {
  title: "modals/useBanner",
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
    <ButtonContainer style={{ background: colors.textBackgroundAlt() }}>
      <Button onClick={banner.show}>Show Banner</Button>
      <Button onClick={sticky.show}>Show Sticky</Button>
    </ButtonContainer>
  );
}
