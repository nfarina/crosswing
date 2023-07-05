import { DeepPartial, merge } from "@cyber/shared";
import { createContext, useContext } from "react";

export type Host = {
  container: HostContainer;
  viewport: HostViewport;
  /** Attempts to scroll to the top based on what looks scrolled, if on iOS. Otherwise does nothing. */
  scrollToTop(): void;
  /** Delays automatic updates (browser reloads) for the given amount of time. */
  delayUpdates(duration: number): void;
};

export type HostContainer = "wkwebview" | "android" | "electron" | "web";

export interface HostViewport {
  height?: number;
  keyboardVisible?: boolean;
}

export const HostContext = createContext<Host>(defaultHostContext());

export function useHost(): Host {
  return useContext(HostContext);
}

export function defaultHostContext(mergeContext: DeepPartial<Host> = {}): Host {
  const defaultContext: Host = {
    container: "web",
    viewport: {},
    scrollToTop: () => {},
    delayUpdates: () => {},
  };

  return merge(defaultContext, mergeContext);
}
