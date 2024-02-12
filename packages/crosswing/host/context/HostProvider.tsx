import { HTMLAttributes, useMemo } from "react";
import { styled } from "styled-components";
import {
  badgeAppIcon,
  closePlaid,
  delayUpdates,
  detectContainer,
  getBrightness,
  getContacts,
  login,
  openPlaid,
  openSettings,
  openUrl,
  post,
  requestLocationUpdate,
  requestLocationWhenInUseAuthorization,
  requestNotificationAuthorization,
  requestTemporaryFullAccuracyLocationAuthorization,
  send,
  sendSignInLink,
  setBrightness,
  setLightStatusBar,
  setWakeLock,
  showEmailSheet,
  showMessageSheet,
  showShareSheet,
  startSmsRetriever,
} from "../util/ipc.js";
import {
  HostContainer,
  HostContextValue,
  HostFeatures,
  HostPlatform,
  HostPlugin,
  SafeArea,
} from "../util/types.js";
import { useBackButton } from "../util/useBackButton.js";
import { useClipboard } from "../util/useClipboard.js";
import { useDeepLinks } from "../util/useDeepLinks.js";
import { useFeatures } from "../util/useFeatures.js";
import { useHostViewport } from "../util/useHostViewport.js";
import { usePreferredFontSize } from "../util/usePreferredFontSize.js";
import { useSafeArea } from "../util/useSafeArea.js";
import { useScrollToTop } from "../util/useScrollToTop.js";
import { useWindowListener } from "../util/useWindowListener.js";
import { HostContext } from "./HostContext.js";

export * from "./HostContext.js";

export function HostProvider({
  container = detectContainer(),
  deviceId,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** Allow setting the HostContainer directly for certain debugging situations. */
  container?: HostContainer;
  /** Allow setting the device ID directly for certain debugging situations. */
  deviceId?: string;
}) {
  const features = useFeatures();
  const viewport = useHostViewport();
  const safeArea = useSafeArea(container, features, viewport);
  const deepLink = useDeepLinks(features);
  const clipboard = useClipboard(features);
  const preferredFontSize = usePreferredFontSize(features);

  // Initialize back button handling for Android.
  useBackButton();

  // Initialize scroll-to-top when tapping status bar on iOS.
  const scrollToTop = useScrollToTop(container);

  // We want to be really careful about constructing the context value,
  // because React compares it by strict equality to determine if ALL
  // consumers of this context need to be re-rendered.
  const value = useMemo<HostContextValue | undefined>(() => {
    if (features && viewport && safeArea && deepLink) {
      return {
        container,
        platform: (features.platform as HostPlatform) ?? "unknown",
        safeArea,
        viewport,
        preferredFontSize,
        deepLink,
        deviceId: deviceId ?? features.identifier,
        clientUrl: features.clientUrl,
        webBundle: features.webBundle,
        supportsEmailSignIn: !!features.emailSignIn,
        supportsLogin: !!features.login,
        supportsNotifications:
          container === "android" || !!features.notifications, // All android devices support notifications without prompting.
        supportsShareSheet: !!features.shareSheet,
        supportsMessageSheet: !!features.messageSheet,
        supportsEmailSheet: !!features.emailSheet,
        supportsContacts: !!features.contacts,
        supportsWakeLock: !!features.wakeLock,
        supportsBrightness: !!features.brightness,
        supportsPlaid: !!features.plaid,
        supportsLightStatusBar: container === "ios", // All iOS versions support this.
        requiresNotificationAuthorization: !!features.notificationAuthorization,
        smsAutoVerificationToken: features.smsAutoVerificationToken,
        getPlugin: (plugin: string) => buildPlugin(features, plugin),
        openUrl,
        sendSignInLink,
        login,
        requestNotificationAuthorization,
        requestLocationWhenInUseAuthorization,
        requestTemporaryFullAccuracyLocationAuthorization,
        requestLocationUpdate,
        openSettings,
        badgeAppIcon,
        scrollToTop,
        copyToClipboard: clipboard.copy,
        showShareSheet,
        showMessageSheet,
        showEmailSheet,
        getContacts,
        startSmsRetriever,
        setWakeLock,
        getBrightness,
        setBrightness,
        setLightStatusBar,
        openPlaid,
        closePlaid,
        delayUpdates,
        unsafe_features: () => features,
        unsafe_send: send,
        unsafe_post: post,
      };
    }
  }, [container, features, viewport, preferredFontSize, safeArea, deepLink]);

  //
  // Render
  //

  if (!value) {
    return null; // Not loaded yet.
  }

  return (
    <HostContext.Provider value={value}>
      {/* We need an actual HTML element in the DOM to attach our CSS custom properties to. */}
      <StyledHostProvider $safeArea={value.safeArea} {...rest} />
    </HostContext.Provider>
  );
}

export const StyledHostProvider = styled.div<{
  $safeArea: SafeArea;
}>`
  display: flex;
  flex-flow: column;

  --safe-area-top: ${(p) => p.$safeArea.top};
  --safe-area-bottom: ${(p) => p.$safeArea.bottom};
  --safe-area-left: ${(p) => p.$safeArea.left};
  --safe-area-right: ${(p) => p.$safeArea.right};

  > * {
    flex-grow: 1;
  }
`;

function buildPlugin(
  features: HostFeatures,
  plugin: string,
): HostPlugin | null {
  const pluginFeatures = features.plugins?.[plugin];

  if (!pluginFeatures) {
    // Plugin not supported on this platform.
    return null;
  }

  return {
    ...pluginFeatures,
    send: (name, args) => send(name, { ...args, plugin }),
    post: (name, args) => post(name, { ...args, plugin }),
    useListener: (name, listener) => {
      useWindowListener(`${plugin}_${name}`, listener);
    },
  };
}
