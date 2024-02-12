import { Meta, StoryFn } from "@storybook/react";
import { CrosswingAppDecorator } from "../../storybook.js";
import { Badge } from "./Badge.js";

export default {
  component: Badge,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Badge>;

type Story = StoryFn<typeof Badge>;

export const Normal: Story = (args) => <Badge>Recent</Badge>;
