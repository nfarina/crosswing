import React, { ReactNode, useMemo } from "react";
import { HostContext, defaultHostContext } from "../context/HostContext.js";
import { StyledHostProvider } from "../context/HostProvider.js";
import { HostContextValue } from "../util/types.js";

/**
 * Useful for hosting Storybook stories that use Host from context.
 */
export function MockHostProvider({
  children,
  ...host
}: { children?: ReactNode } & Partial<HostContextValue>) {
  const value = useMemo(() => defaultHostContext(host), [host]);

  return (
    <HostContext.Provider value={value}>
      {/* We need an actual HTML element in the DOM to attach our CSS custom properties to. */}
      <StyledHostProvider $safeArea={value.safeArea} children={children} />
    </HostContext.Provider>
  );
}
