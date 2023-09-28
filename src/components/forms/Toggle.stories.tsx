import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { useState } from "react";
import { useAsyncTask } from "../../hooks/useAsyncTask";
import { wait } from "../../shared/wait";
import { CyberAppDecorator } from "../../theme/storybook";
import { Toggle } from "./Toggle";

export default {
  component: Toggle,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toggle>;

export const On = () => <Toggle on onClick={action("click")} />;

export const Off = () => <Toggle onClick={action("click")} />;

export const Disabled = () => <Toggle disabled onClick={action("click")} />;

export const WithHandler = () => {
  const [on, setOn] = useState(false);
  return (
    <Toggle
      on={on}
      onClick={() =>
        setOn((prevOn) => {
          action("setOn")(!prevOn);
          return !prevOn;
        })
      }
    />
  );
};

export const Smaller = () => {
  const [on, setOn] = useState(false);
  return (
    <Toggle
      size="smaller"
      on={on}
      onClick={() =>
        setOn((prevOn) => {
          action("setOn")(!prevOn);
          return !prevOn;
        })
      }
    />
  );
};

export const WithDelayedHandler = () => {
  const [on, setOn] = useState(false);

  const waiting = useAsyncTask({
    func: () => wait(2000),
    onComplete: () => setOn(!on),
    onError: null,
  });

  return <Toggle on={on} onClick={waiting.run} disabled={waiting.isRunning} />;
};
