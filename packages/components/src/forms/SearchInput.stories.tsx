import { useAsyncTask } from "@cyber/hooks/useAsyncTask";
import { useDebounced } from "@cyber/hooks/useDebounced";
import { wait } from "@cyber/shared/wait";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React, { useEffect, useState } from "react";
import { SearchInput } from "./SearchInput.js";

export default {
  component: SearchInput,
  decorators: [CyberAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
};

export const Empty = () => <SearchInput placeholder="Display Name" />;

// Annoying to steal focus in Storybook
// export const AutoFocus = () => (
//   <SearchInput placeholder="Display Name" autoFocusOnDesktop />
// );

export const Working = () => {
  const [value, setValue] = useState("");

  // Simulate a typical value for searching with Algolia.
  const debouncedValue = useDebounced(value, { delay: 100 });

  const searchTask = useAsyncTask({
    func: () => wait(1000),
    onError: null,
  });

  useEffect(() => {
    searchTask.run();
  }, [debouncedValue]);

  const debouncedIsRunning = useDebounced(searchTask.isRunning, { delay: 500 });

  return (
    <SearchInput
      value={value}
      onValueChange={setValue}
      working={value.length > 0 && debouncedIsRunning}
    />
  );
};

export const WithValue = () => <SearchInput defaultValue="Nick Farina" />;

export const Disabled = () => (
  <SearchInput defaultValue="Nick Farina" disabled />
);
