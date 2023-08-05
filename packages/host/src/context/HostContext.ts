import { DeepPartial, merge } from "@cyber/shared/merge";
import { createContext, useContext } from "react";

export type HostContextValue = {
  container: HostContainer;
  viewport: HostViewport;
  /** Attempts to scroll to the top based on what looks scrolled, if on iOS. Otherwise does nothing. */
  scrollToTop(): void;
  /** Delays automatic updates (browser reloads) for the given amount of time. */
  delayUpdates(duration: number): void;
  openUrl(url: string): void;
};

export type HostContainer = "ios" | "android" | "electron" | "web";

export interface HostViewport {
  height?: number;
  keyboardVisible?: boolean;
}

export const HostContext = createContext<HostContextValue>(
  defaultHostContext(),
);
HostContext.displayName = "HostContext";

export function useHost(): HostContextValue {
  return useContext(HostContext);
}

export function defaultHostContext(
  mergeContext: DeepPartial<HostContextValue> = {},
): HostContextValue {
  const defaultContext: HostContextValue = {
    container: "web",
    viewport: {},
    scrollToTop: () => {},
    delayUpdates: () => {},
    openUrl: () => {},
  };

  return merge(defaultContext, mergeContext);
}

export const AndroidBackButtonClassName = "hardware-back";
