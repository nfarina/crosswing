import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "./Button.js";
import Close from "./__stories__/Close.svg";

export default {
  title: "components/Button",
  component: Button,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;

type Story = StoryFn<typeof Button>;

export const WithText: Story = (args) => <Button text="Hello!" {...args} />;

export const WithChildren: Story = (args) => (
  <Button children="Hello!" {...args} />
);

export const Disabled: Story = (args) => (
  <Button disabled text="Hello!" {...args} />
);

export const Working: Story = (args) => (
  <Button working text="Hello!" {...args} />
);

export const WorkingState: Story = (args) => {
  const [working, setWorking] = useState(false);

  function onClick() {
    setWorking(true);
    setTimeout(() => setWorking(false), 2000);
  }

  return <Button text="Hello!" onClick={onClick} working={working} {...args} />;
};

export const PrimarySmaller: Story = (args) => (
  <Button size="smaller" primary text="Hello!" {...args} />
);

export const PrimaryNormal: Story = (args) => (
  <Button primary text="Hello!" {...args} />
);

export const PrimaryNormalWithDescender: Story = (args) => (
  <Button primary text="Engage!" {...args} />
);

export const PrimaryLarger: Story = (args) => (
  <Button size="larger" primary text="Hello!" {...args} />
);

export const PrimaryLargest: Story = (args) => (
  <Button size="largest" primary text="Hello!" {...args} />
);

export const WithSubtext: Story = (args) => (
  <Button primary text="Buy Now" subtext="Terms Apply" {...args} />
);

export const WithSubtextSmaller: Story = (args) => (
  <Button
    primary
    size="smaller"
    text="Buy Now"
    subtext="Terms Apply"
    {...args}
  />
);

export const WithSubtextLarger: Story = (args) => (
  <Button
    primary
    size="larger"
    text="Buy Now"
    subtext="Terms Apply"
    {...args}
  />
);

export const IconOnly: Story = (args) => <Button icon={<Close />} {...args} />;

export const IconAndText: Story = (args) => (
  <Button icon={<Close />} text="Close" {...args} />
);
