import { useAsyncTask } from "@cyber/hooks/useAsyncTask";
import { wait } from "@cyber/shared/wait";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
import { Toggle } from "./Toggle.js";

export default {
  title: "components/Toggle",
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
};

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
      smaller
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