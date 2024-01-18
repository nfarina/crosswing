import { Meta, StoryFn } from "@storybook/react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { CrosswingAppDecorator } from "../../storybook";
import { PopupView } from "./PopupView.js";

export default {
  component: PopupView,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
  argTypes: {
    background: { control: "color" },
    arrowBackground: { control: "color" },
    arrowBackgroundDark: { control: "color" },
  },
} satisfies Meta<typeof PopupView>;

type Story = StoryFn<typeof PopupView>;

export const Normal: Story = (args) => {
  return (
    <PopupView {...args}>
      <ContentView>Hello, World!</ContentView>
    </PopupView>
  );
};

const ContentView = styled.div`
  padding: 10px;
  font: ${fonts.display({ size: 14 })};
  color: ${colors.text()};
`;

export const CustomBackground: Story = (args) => {
  return (
    <PopupView {...args}>
      <WhiteContentView>Hello, World!</WhiteContentView>
    </PopupView>
  );
};

CustomBackground.args = {
  background: colors.primary(),
  arrowBackground: colors.primary(),
};

const WhiteContentView = styled(ContentView)`
  color: ${colors.white()};
`;
