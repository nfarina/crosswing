import { useHost } from "../context/HostContext";

export function useHostStatusBar(): HostStatusBar | null {
  const { supportsLightStatusBar, setLightStatusBar } = useHost();
  return supportsLightStatusBar ? { setLight: setLightStatusBar } : null;
}

export type HostStatusBar = {
  setLight(isLight: boolean): void;
};
