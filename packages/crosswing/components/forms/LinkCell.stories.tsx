import { action } from "@storybook/addon-actions";
import Attachment from "../../icons/Attachment.svg?react";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../../storybook";
import { SeparatorDecorator } from "../SeparatorLayout";
import { LinkCell } from "./LinkCell";

export default {
  component: LinkCell,
  decorators: [
    SeparatorDecorator,
    CrosswingAppDecorator({ width: "wide" }),
    RouterDecorator,
  ],
  parameters: { layout: "centered" },
};

export const Normal = () => (
  <LinkCell title="Select an account" onClick={action("click")} />
);

export const WithSubtitle = () => (
  <LinkCell
    title="Select an account"
    subtitle="Money can be exchanged for goods and services"
    onClick={action("click")}
  />
);

export const WithIcon = () => (
  <LinkCell
    icon={<Attachment />}
    title="Attach a Receipt"
    onClick={action("click")}
  />
);

export const WithAction = () => (
  <LinkCell action="Attach a Receipt" onClick={action("click")} />
);

export const WithLabel = () => (
  <LinkCell label="User" title="Nick Farina" onClick={action("click")} />
);

export const Disabled = () => (
  <LinkCell disabled title="Select an account" onClick={action("click")} />
);

export const OverStuffed = () => (
  <LinkCell
    label="Check out this really long label, we're just labeling a lot of things over here."
    action="Here's a very long action, the text just keeps going on and on."
    title="This is a really long title, like incredibly long!"
    subtitle="And this is an equally long subtitle, see how it goes on and on forever."
    onClick={action("click")}
  />
);

export const Ellipsised = () => (
  <LinkCell
    ellipsize
    label="Check out this really long label, we're just labeling a lot of things over here."
    action="Here's a very long action, the text just keeps going on and on."
    title="This is a really long title, like incredibly long!"
    subtitle="And this is an equally long subtitle, see how it goes on and on forever."
    onClick={action("click")}
  />
);
