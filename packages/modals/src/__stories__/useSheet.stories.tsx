import { Button } from "@cyber/components";
import { MockHostProvider } from "@cyber/host/storybook";
import { NavLayout } from "@cyber/router";
import { RouterDecorator } from "@cyber/router/storybook";
import { colors } from "@cyber/theme";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { StoryObj } from "@storybook/react";
import React from "react";
import { ModalContextProvider } from "../ModalContextProvider.js";
import { ModalDecorator } from "../ModalDecorator.js";
import { useSheet } from "../useSheet.js";
import { ButtonContainer } from "./ButtonContainer.js";

export default {
  title: "modals/useSheet",
};

export const Normal: StoryObj = {
  render: () => <SheetPresenter />,
  decorators: [
    CyberAppDecorator({ layout: "mobile" }),
    ModalDecorator,
    RouterDecorator,
  ],
  parameters: { layout: "centered" },
};

export const Sliding: StoryObj = {
  render: () => (
    // Simulate an iOS device which gets the slide-up animation.
    <MockHostProvider container="wkwebview">
      {/* Redeclare this to pick up the simulated host. */}
      <ModalContextProvider>
        <SheetPresenter />
      </ModalContextProvider>
    </MockHostProvider>
  ),
  decorators: [
    CyberAppDecorator({ layout: "mobile" }),
    ModalDecorator,
    RouterDecorator,
  ],
  parameters: { layout: "centered" },
};

export const Desktop: StoryObj = {
  render: () => (
    <ModalContextProvider allowDesktopPresentation>
      <SheetPresenter />
    </ModalContextProvider>
  ),
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    CyberAppDecorator({ layout: "fullscreen" }),
    ModalDecorator,
    RouterDecorator,
  ],
};

//
// Actual Sheet
//

function SheetPresenter() {
  const sheet = useSheet(() => (
    <NavLayout
      isApplicationRoot
      title="Sheet Nav"
      right={{ title: "Done", onClick: sheet.hide }}
      style={{ background: colors.textBackground() }}
    />
  ));

  return (
    <ButtonContainer>
      <Button primary onClick={sheet.show}>
        Show Sheet
      </Button>
    </ButtonContainer>
  );
}
