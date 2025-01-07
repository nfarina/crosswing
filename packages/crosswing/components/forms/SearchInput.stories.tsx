import { useEffect, useState } from "react";
import { useAsyncTask } from "../../hooks/useAsyncTask.js";
import { useDebounced } from "../../hooks/useDebounced.js";
import { wait } from "../../shared/wait.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { SearchInput } from "./SearchInput.js";

export default {
  component: SearchInput,
  decorators: [CrosswingAppDecorator({ layout: "component" })],
  parameters: { layout: "centered" },
};

export const Empty = () => <SearchInput placeholder="Display Name" />;

// Disabled - it's annoying to steal focus in Storybook.
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
