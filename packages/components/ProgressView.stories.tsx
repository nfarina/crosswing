import { usePropSequence } from "@cyber/hooks/usePropSequence";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import { ProgressView } from "./ProgressView";

export default {
  component: ProgressView,
  decorators: [CyberAppDecorator()],
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
