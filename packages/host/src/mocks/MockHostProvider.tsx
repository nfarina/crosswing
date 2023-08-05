import React, { ReactNode, useMemo } from "react";
import {
  HostContext,
  HostContextValue,
  defaultHostContext,
} from "../context/HostContext.js";

/**
 * Useful for hosting Storybook stories that use Host from context.
 */
export function MockHostProvider({
  children,
  ...host
}: { children?: ReactNode } & Partial<HostContextValue>) {
  const context = useMemo(() => defaultHostContext(host), [host]);

  return <HostContext.Provider value={context} children={children} />;
}
