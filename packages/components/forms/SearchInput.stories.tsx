import { useAsyncTask } from "@crosswing/hooks/useAsyncTask";
import { useDebounced } from "@crosswing/hooks/useDebounced";
import { wait } from "@crosswing/shared/wait";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { useEffect, useState } from "react";
import { SearchInput } from "./SearchInput";

export default {
  component: SearchInput,
  decorators: [CrosswingAppDecorator({ width: "wide" })],
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
