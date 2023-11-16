import { RouterDecorator } from "@crosswing/router/storybook";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { Meta } from "@storybook/react";
import { LinkButton } from "./LinkButton";

export default {
  component: LinkButton,
  decorators: [CrosswingAppDecorator(), RouterDecorator],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LinkButton>;

export const WithText = () => <LinkButton children="Hello!" to="/somewhere" />;

export const Disabled = () => (
  <LinkButton disabled children="Hello!" to="/somewhere" />
);

export const PrimarySmaller = () => (
  <LinkButton size="smaller" primary children="Hello!" to="/somewhere" />
);

export const PrimaryNormal = () => (
  <LinkButton primary children="Hello!" to="/somewhere" />
);

export const PrimaryLarger = () => (
  <LinkButton size="larger" primary children="Hello!" to="/somewhere" />
);

export const PrimaryLargest = () => (
  <LinkButton size="largest" primary children="Hello!" to="/somewhere" />
);