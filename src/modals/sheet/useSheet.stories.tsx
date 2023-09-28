import { StoryObj } from "@storybook/react";
import { MockHostProvider } from "../../host/mocks/MockHostProvider";
import { NavLayout } from "../../router/navs/NavLayout";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { colors } from "../../theme/colors/colors";
import { CyberAppDecorator } from "../../theme/storybook";
import { ModalContextProvider } from "../context/ModalContextProvider";
import { ModalDecorator } from "../storybook/ModalDecorator";
import {
  ModalStoryButton,
  ModalStoryButtons,
} from "../storybook/ModalStoryButtons";
import { useSheet } from "./useSheet";

export default {
  component: useSheet,
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
    <MockHostProvider container="ios">
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
    <ModalStoryButtons>
      <ModalStoryButton onClick={sheet.show}>Show Sheet</ModalStoryButton>
    </ModalStoryButtons>
  );
}
