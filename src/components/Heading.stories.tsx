import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { CyberAppDecorator } from "../theme/storybook.js";
import { Button } from "./Button.js";
import { Heading } from "./Heading.js";

export default {
  component: Heading,
  decorators: [CyberAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Heading>;

type Story = StoryFn<typeof Heading>;

export const Default: Story = () => <Heading>Section Title</Heading>;

export const WithRight: Story = () => (
  <Heading right={<Button title="Action" onClick={action("action click")} />}>
    Section Title
  </Heading>
);
