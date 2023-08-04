import React, { ReactNode } from "react";
import { HostContainer, HostContext } from "./HostContext.js";

export function HostProvider({
  container = "web",
  children,
}: {
  container?: HostContainer;
  children?: ReactNode;
}) {
  const value = {
    container,
    viewport: {},
    scrollToTop: () => {},
    delayUpdates: () => {},
    openUrl: () => {},
  };

  return <HostContext.Provider value={value} children={children} />;
}
