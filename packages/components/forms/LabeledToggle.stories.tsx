import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { useState } from "react";
import { SeparatorDecorator } from "../SeparatorLayout";
import { LabeledToggle } from "./LabeledToggle";

export default {
  component: LabeledToggle,
  decorators: [SeparatorDecorator, CrosswingAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
};

export const Normal = () => {
  const [ludicrous, setLudicrous] = useState(true);

  return (
    <LabeledToggle
      label="Ludicrous Mode"
      on={ludicrous}
      onClick={() => setLudicrous(!ludicrous)}
    />
  );
};

export const Smaller = () => {
  const [ludicrous, setLudicrous] = useState(true);

  return (
    <LabeledToggle
      label="Ludicrous Mode"
      on={ludicrous}
      size="smaller"
      onClick={() => setLudicrous(!ludicrous)}
    />
  );
};

export const Disabled = () => (
  <LabeledToggle
    disabled
    label="Ludicrous Mode"
    on={true}
    onClick={() => {
      throw new Error("Shouldn't happen");
    }}
  />
);

export const Working = () => (
  <LabeledToggle
    working
    label="Ludicrous Mode"
    on={true}
    onClick={() => {
      throw new Error("Shouldn't happen");
    }}
  />
);

export const WithDetail = () => (
  <LabeledToggle
    label="Ludicrous Mode"
    detail="Turns your car into a spaceship."
    on={true}
  />
);

export const WithLongDetail = () => (
  <LabeledToggle
    label="Ludicrous Mode"
    detail="Turns your car into a spaceship. This is highly dangerous and not advised."
    on={true}
  />
);
