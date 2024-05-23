import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import { CloseIcon } from "../icons/Close.js";
import { WarningIcon } from "../icons/Warning.js";
import { CrosswingAppDecorator } from "../storybook.js";
import { Button } from "./Button.js";

export default {
  component: Button,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;

type Story = StoryFn<typeof Button>;

export const WithText: Story = () => (
  <Button title="Hello!" onClick={action("onClick")} />
);

export const WithChildren: Story = () => (
  <Button children="Hello!" onClick={action("onClick")} />
);

export const Disabled: Story = () => (
  <Button disabled title="Hello!" onClick={action("onClick")} />
);

export const Working: Story = () => (
  <Button working title="Hello!" onClick={action("onClick")} />
);

export const WorkingState: Story = () => {
  const [working, setWorking] = useState(false);

  function onClick() {
    setWorking(true);
    setTimeout(() => setWorking(false), 2000);
  }

  return <Button title="Hello!" onClick={onClick} working={working} />;
};

export const PrimarySmaller: Story = () => (
  <Button size="smaller" primary title="Hello!" onClick={action("onClick")} />
);

export const PrimaryNormal: Story = () => (
  <Button primary title="Hello!" onClick={action("onClick")} />
);

export const PrimaryNormalWithDescender: Story = () => (
  <Button primary title="Engage!" onClick={action("onClick")} />
);

export const PrimaryLarger: Story = () => (
  <Button size="larger" primary title="Hello!" onClick={action("onClick")} />
);

export const PrimaryLargest: Story = () => (
  <Button size="largest" primary title="Hello!" onClick={action("onClick")} />
);

export const WithSubtitle: Story = () => (
  <Button
    primary
    title="Buy Now"
    subtitle="Terms Apply"
    onClick={action("onClick")}
  />
);

export const WithSubtitleSmaller: Story = () => (
  <Button
    primary
    size="smaller"
    title="Buy Now"
    subtitle="Terms Apply"
    onClick={action("onClick")}
  />
);

export const WithSubtitleLarger: Story = () => (
  <Button
    primary
    size="larger"
    title="Buy Now"
    subtitle="Terms Apply"
    onClick={action("onClick")}
  />
);

export const IconOnly: Story = () => (
  <Button icon={<CloseIcon />} onClick={action("onClick")} />
);

export const IconAndText: Story = () => (
  <Button
    icon={<WarningIcon />}
    title="Error Details"
    onClick={action("onClick")}
  />
);
