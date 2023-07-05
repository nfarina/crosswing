import { createContext, createElement, ReactNode, useContext } from "react";

// A barely-stubbed-out version of the "native-host" package which supports
// interop with iOS and Android native app wrappers.

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

export const HostContext = createContext<Host>({
  container: "web",
  viewport: {},
  scrollToTop: () => {},
  delayUpdates: () => {},
});

export function useHost(): Host {
  return useContext(HostContext);
}

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
  };

  return createElement(HostContext.Provider, { value }, children);
}

export const safeArea = {
  top: () => "env(safe-area-inset-top, 0px)",
  right: () => "env(safe-area-inset-right, 0px)",
  bottom: () => "env(safe-area-inset-bottom, 0px)",
  left: () => "env(safe-area-inset-left, 0px)",
};

//
// Plugin stubs
//
// In the future these will be real plugins supported by the native app
// wrappers. For now, we are assuming web-only. But a lot of the existing
// code we extracted is already using these, so we need to provide stubs.
//

export function useHostStatusBar(): HostStatusBar | null {
  return null;
}

export type HostStatusBar = {
  setLight(isLight: boolean): void;
};

export const AndroidBackButtonClassName = "hardware-back";
