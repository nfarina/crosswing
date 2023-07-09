import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Badge } from "../Badge.js";

export default {
  title: "components/Badge",
  component: Badge,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Badge>;

type Story = StoryFn<typeof Badge>;

export const Normal: Story = (args) => <Badge>Recent</Badge>;
