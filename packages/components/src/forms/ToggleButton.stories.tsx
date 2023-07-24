import { CyberAppDecorator } from "@cyber/theme/storybook";
import React, { useState } from "react";
import { ToggleButton } from "./ToggleButton.js";

export default {
  component: ToggleButton,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
};

export const Normal = () => {
  const [newsletter, setNewsletter] = useState(true);

  return (
    <ToggleButton
      title="Newsletter"
      on={newsletter}
      onClick={() => setNewsletter(!newsletter)}
    />
  );
};

export const Smaller = () => {
  const [newsletter, setNewsletter] = useState(true);

  return (
    <ToggleButton
      title="Newsletter"
      on={newsletter}
      smaller
      onClick={() => setNewsletter(!newsletter)}
    />
  );
};

export const Disabled = () => (
  <ToggleButton
    disabled
    title="Newsletter"
    on={true}
    onClick={() => {
      throw new Error("Shouldn't happen");
    }}
  />
);

export const Working = () => (
  <ToggleButton
    working
    title="Newsletter"
    on={true}
    onClick={() => {
      throw new Error("Shouldn't happen");
    }}
  />
);
