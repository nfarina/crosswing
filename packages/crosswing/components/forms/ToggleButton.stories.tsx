import { useState } from "react";
import { CrosswingAppDecorator } from "../../theme/storybook";
import { ToggleButton } from "./ToggleButton";

export default {
  component: ToggleButton,
  decorators: [CrosswingAppDecorator()],
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
      size="smaller"
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
