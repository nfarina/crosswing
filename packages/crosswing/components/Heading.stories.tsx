import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import { CrosswingAppDecorator } from "../theme/storybook";
import { Button } from "./Button";
import { Heading } from "./Heading";

export default {
  component: Heading,
  decorators: [CrosswingAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Heading>;

type Story = StoryFn<typeof Heading>;

export const Default: Story = () => <Heading>Section Title</Heading>;

export const WithRight: Story = () => (
  <Heading right={<Button title="Action" onClick={action("action click")} />}>
    Section Title
  </Heading>
);
