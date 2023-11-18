import Attachment from "../../icons/Attachment.svg?react";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { SeparatorDecorator } from "../SeparatorLayout";
import { TextCell } from "./TextCell";

export default {
  component: TextCell,
  decorators: [
    SeparatorDecorator,
    CrosswingAppDecorator({ width: "wide" }),
    RouterDecorator,
  ],
  parameters: { layout: "centered" },
};

export const Normal = () => (
  <TextCell title="Select an account" onClick={() => {}} />
);

export const WithSubtitle = () => (
  <TextCell
    title="Select an account"
    subtitle="Money can be exchanged for goods and services"
  />
);

export const Disabled = () => (
  <TextCell
    disabled
    title="Select an account"
    subtitle="Money can be exchanged for goods and services"
    onClick={() => {}} // Must define to be a clickable thing
  />
);

export const WithIcon = () => (
  <TextCell icon={<Attachment />} action="Attach a Receipt" />
);

export const WithLabel = () => <TextCell label="User" title="Nick Farina" />;

export const OverStuffed = () => (
  <TextCell
    label="Check out this really long label, we're just labeling a lot of things over here."
    title="This is a really long title, like incredibly long!"
    subtitle="And this is an equally long subtitle, see how it goes on and on forever."
  />
);

export const Ellipsised = () => (
  <TextCell
    ellipsize
    label="Check out this really long label, we're just labeling a lot of things over here."
    title="This is a really long title, like incredibly long!"
    subtitle="And this is an equally long subtitle, see how it goes on and on forever."
  />
);
