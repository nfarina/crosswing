import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import React from "react";
import { RouterDecorator } from "../router/storybook/RouterDecorator";
import { CyberAppDecorator } from "../theme/storybook";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { LinkButton } from "./LinkButton";

export default {
  component: ButtonGroup,
  decorators: [CyberAppDecorator(), RouterDecorator],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonGroup>;

export const WithSingleButton = () => (
  <ButtonGroup>
    <Button children="Hello" onClick={action("onClick")} />
  </ButtonGroup>
);

export const WithLinkButton = () => (
  <ButtonGroup>
    <LinkButton to="/somewhere" children="Hello" />
  </ButtonGroup>
);

export const WithMultipleButtons = () => (
  <ButtonGroup>
    <Button children="One Fish" onClick={action("onClick [one fish]")} />
    <LinkButton to="/somewhere" children="Two Fish" />
  </ButtonGroup>
);

export const Disabled = () => (
  <ButtonGroup>
    <Button children="One Fish" onClick={action("onClick [one fish]")} />
    <Button
      children="Two Fish"
      disabled
      onClick={action("onClick [two fish]")}
    />
  </ButtonGroup>
);
