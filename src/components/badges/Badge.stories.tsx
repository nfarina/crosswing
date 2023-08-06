import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { Badge } from "./Badge.js";

export default {
  component: Badge,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Badge>;

type Story = StoryFn<typeof Badge>;

export const Normal: Story = (args) => <Badge>Recent</Badge>;
