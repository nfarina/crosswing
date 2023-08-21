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
