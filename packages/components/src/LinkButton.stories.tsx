import { RouterDecorator } from "@cyber/router/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { LinkButton } from "./LinkButton.js";

export default {
  title: "components/LinkButton",
  decorators: [CyberAppDecorator(), RouterDecorator],
  parameters: { layout: "centered" },
};

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
