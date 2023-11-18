import { Meta } from "@storybook/react";
import { RouterDecorator } from "../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../storybook";
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
