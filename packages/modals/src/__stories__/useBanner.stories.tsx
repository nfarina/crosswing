import { Button } from "@cyber/components";
import { colors } from "@cyber/theme";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { ModalDecorator } from "../ModalDecorator.js";
import { useBanner } from "../useBanner.js";
import { ButtonContainer } from "./ButtonContainer.js";

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
      <Button primary onClick={banner.show}>
        Show Banner
      </Button>
      <Button primary onClick={sticky.show}>
        Show Sticky
      </Button>
    </ButtonContainer>
  );
}
