import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";
import { Checkbox } from "./Checkbox.js";

export default {
  title: "components/Checkbox",
  component: Checkbox,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
  argTypes: {
    checked: { control: "boolean" },
    onClick: { action: "onClick" },
  },
} as Meta<typeof Checkbox>;

type Story = StoryFn<typeof Checkbox>;

export const Unchecked: Story = (args) => <Checkbox {...args} />;

export const Checked: Story = (args) => <Checkbox checked {...args} />;

export const WithHandler: Story = ({ onClick, ...args }) => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onClick={(e) => {
        setChecked(!checked);
        onClick?.(e);
      }}
      {...args}
    />
  );
};
