import { deepEqual } from "@cyber/shared";
import { DependencyList, useEffect } from "react";
import { useResettableState } from "./useResettableState.js";

/**
 * Returns the result of executing the given factory function, then
 * periodically calls the factory function again at the given interval
 * until it returns something different (using deep equality), then will
 * return the new result. Also checks the given dependencies and re-runs
 * the factory function if any of them change.
 */
export function usePeriodicMemo<T>(
  factory: () => T,
  deps: DependencyList,
  { interval = 1000 }: { interval?: number } = {},
): T {
  const [lastValue, setLastValue] = useResettableState(factory(), deps);

  useEffect(() => {
    function checkForChange() {
      const nextValue = factory();
      if (!deepEqual(nextValue, lastValue)) {
        // console.log(
        //   `usePeriodicMemo value changed to ${truncate(
        //     JSON.stringify(nextValue),
        //   )}`,
        // );

        setLastValue(nextValue);
      }
    }

    const intervalId = setInterval(checkForChange, interval);

    return () => clearInterval(intervalId);
  }, [interval, lastValue]);

  return lastValue;
}
