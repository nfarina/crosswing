import { Meta, StoryFn } from "@storybook/react";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { Badge } from "./Badge";

export default {
  component: Badge,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Badge>;

type Story = StoryFn<typeof Badge>;

export const Normal: Story = (args) => <Badge>Recent</Badge>;
