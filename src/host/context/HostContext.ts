import { createContext, useContext } from "react";
import { detectContainer } from "../util/ipc.js";
import { openExternalLink } from "../util/openExternalLink.js";
import { DeepLink, HostContextValue } from "../util/types.js";

export const HostContext = createContext<HostContextValue>(
  defaultHostContext(),
);
HostContext.displayName = "HostContext";

export function useHost(): HostContextValue {
  return useContext(HostContext);
}

export function defaultHostContext(
  merge?: Partial<HostContextValue>,
): HostContextValue {
  return {
    container: detectContainer(),
    viewport: {},
    safeArea: {
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
    preferredFontSize: 17, // From iOS defaults.
    deepLink: new DeepLink(),
    supportsEmailSignIn: false,
    supportsLogin: false,
    supportsNotifications: false,
    supportsContacts: false,
    requiresNotificationAuthorization: false,
    supportsLightStatusBar: false,
    supportsPlaid: false,
    getPlugin: () => null,
    openUrl: async (url) => openExternalLink(url),
    sendSignInLink: async () => {},
    login: async () => {},
    requestNotificationAuthorization: async () => {},
    requestLocationWhenInUseAuthorization: async () => {},
    requestTemporaryFullAccuracyLocationAuthorization: async () => {},
    requestLocationUpdate: async () => {},
    openSettings: async () => {},
    badgeAppIcon: async () => {},
    scrollToTop: () => {},
    copyToClipboard: (dataString: string) => {
      navigator.clipboard.writeText(dataString);
    },
    showShareSheet: () => {},
    showMessageSheet: () => {},
    showEmailSheet: () => {},
    getContacts: async () => [],
    startSmsRetriever: async () => {},
    setWakeLock: async () => {},
    getBrightness: async () => 0,
    setBrightness: async () => {},
    setLightStatusBar: async () => {},
    openPlaid: async () => {},
    closePlaid: async () => {},
    delayUpdates: async () => {},
    unsafe_features: () => ({}),
    unsafe_send: async () => ({}),
    unsafe_post: () => {},
    ...merge,
  };
}

export const AndroidBackButtonClassName = "hardware-back";
