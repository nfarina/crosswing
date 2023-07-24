import { ReactNode, createElement } from "react";
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

  return createElement(HostContext.Provider, { value }, children);
}
