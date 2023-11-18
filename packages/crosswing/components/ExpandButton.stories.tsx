import { useState } from "react";
import { CrosswingAppDecorator } from "../storybook";
import { ExpandButton } from "./ExpandButton";

export default {
  component: ExpandButton,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
};

export const Default = () => <ExpandButton />;

export const Down = () => <ExpandButton rotate={180} />;

export const Dynamic = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpandButton
      rotate={expanded ? 180 : 0}
      onClick={() => setExpanded((e) => !e)}
    />
  );
};
