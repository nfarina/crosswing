import { Meta } from "@storybook/react";
import { usePropSequence } from "../hooks/usePropSequence.js";
import { CrosswingAppDecorator } from "../storybook.js";
import { ProgressView } from "./ProgressView.js";

export default {
  component: ProgressView,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProgressView>;

export const Indeterminate = () => <ProgressView size="50px" />;

export const Progress = () => {
  const props = usePropSequence<typeof ProgressView>(
    [{ progress: 0, animated: false }, { progress: 0.5 }, { progress: 1 }],
    { interval: 1000 },
  );

  return <ProgressView size="50px" {...props} />;
};

export const IndeterminateTiny = () => (
  <ProgressView thickness={0.5} size="12px" />
);

export const ProgressTiny = () => {
  const props = usePropSequence<typeof ProgressView>(
    [{ progress: 0, animated: false }, { progress: 0.5 }, { progress: 1 }],
    { interval: 1000 },
  );

  return <ProgressView thickness={0.5} size="12px" {...props} />;
};
