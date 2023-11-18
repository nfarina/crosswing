import { Meta, StoryObj } from "@storybook/react";
import { CrosswingAppDecorator } from "../theme/storybook";
import { ProgressBar } from "./ProgressBar";

export default {
  component: ProgressBar,
  decorators: [CrosswingAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
  },
} as Meta<typeof ProgressBar>;

type Story = StoryObj<typeof ProgressBar>;

export const Empty: Story = {
  args: { value: 0 },
};

export const EmptyRounded: Story = {
  args: { rounded: true, value: 0 },
};

export const Partial: Story = {
  args: { value: 0.4 },
};

export const PartialRounded: Story = {
  args: { rounded: true, value: 0.4 },
};

export const Full: Story = {
  args: { value: 1 },
};
