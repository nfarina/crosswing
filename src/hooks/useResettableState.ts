import { DependencyList, Dispatch, SetStateAction, useState } from "react";

/**
 * This is like useState() but with the added feature of returning the initial
 * value whenever the dependency list changes. This is super useful for allowing
 * components to "reset" some internal state as a result of getting new props.
 */
export function useResettableState<S>(
  initial: S | (() => S),
  deps: DependencyList,
): [S, Dispatch<SetStateAction<S>>] {
  const [innerValue, setInnerValue] = useState(initial);
  const [prevDeps, setPrevDeps] = useState(deps);

  // If the deps changed, reset our state to initial.
  // Calling setState during render is rare but supported!
  // https://github.com/facebook/react/issues/14738#issuecomment-461868904
  if (depsChanged(deps, prevDeps)) {
    setPrevDeps(deps);
    setInnerValue(initial);
  }

  return [innerValue, setInnerValue];
}

function depsChanged(
  previous: DependencyList | undefined,
  current: DependencyList | undefined,
): boolean {
  if (previous === undefined && current === undefined) return false;
  if (previous === undefined || current === undefined) return true;

  if (previous.length !== current.length) {
    console.error(
      "useResettableState(): Dependency array size changed between renders!",
    );
    return false;
  }

  // Lengths are the same; must compare values.
  for (let i = 0; i < previous.length; i += 1) {
    if (previous[i] !== current[i]) {
      return true;
    }
  }

  // Unchanged!
  return false;
}
