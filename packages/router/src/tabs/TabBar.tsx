import { useHost } from "@cyber/host/context";
import { safeArea } from "@cyber/host/plugins/SafeArea";
import { colors } from "@cyber/theme/colors";
import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { styled } from "styled-components";
import { useMobileRouter } from "../context/RouterContext.js";
import { StyledTabLink, TabLink } from "./TabLink.js";
import { TabProps } from "./Tabs.js";

export function TabBar({
  tabs,
  selectedTab,
  collapsed,
  getTabLink,
}: {
  tabs: ReactElement<TabProps>[];
  selectedTab: ReactElement<TabProps>;
  collapsed?: boolean;
  getTabLink: (tab: ReactElement<TabProps>) => string;
}) {
  const { container } = useHost();

  if (collapsed) {
    return <StyledTabBar data-container={container} data-collapsed />;
  }

  return (
    <StyledTabBar data-container={container}>
      {tabs.map((tab) => (
        <TabLink
          key={tab.props.path}
          to={getTabLink(tab)}
          active={tab === selectedTab}
          tab={tab}
        />
      ))}
    </StyledTabBar>
  );
}

export const StyledTabBar = styled.div`
  background: ${colors.textBackground()};
  box-shadow: 0 -1px 0 ${colors.separator()};
  height: 49px;
  padding-left: ${safeArea.left()};
  padding-right: ${safeArea.right()};
  padding-bottom: ${safeArea.bottom()};
  display: flex;
  align-items: center;

  &[data-container="android"] {
    height: 58px;
  }

  > ${StyledTabLink} {
    flex-basis: 0;
    flex-grow: 1;
  }

  &[data-collapsed="true"] {
    display: none;
  }
`;

//
// TabBar Context for hide requests from children.
//

export type TabBarContextValue = {
  isTabBarHidden: boolean;
  setTabBarHidden: (requestId: string, hidden: boolean) => void;
  isDefault?: boolean;
  isMock?: boolean;
};

export const TabBarContext = React.createContext<TabBarContextValue>({
  isTabBarHidden: false,
  setTabBarHidden: () => {},
  isDefault: true,
});
TabBarContext.displayName = "TabBarContext";

export function useTabBarContext({
  ignoreDefaultWarning,
}: { ignoreDefaultWarning?: boolean } = {}): TabBarContextValue {
  const context = useContext(TabBarContext);

  if (!ignoreDefaultWarning && context.isDefault && !context.isMock) {
    console.warn(
      "You are attempting to use a TabBarContext without a <Tabs> ancestor. Things like TabBar hiding will not work.",
    );
  }

  return context;
}

export function MockTabBarProvider({ children }: { children?: ReactNode }) {
  return (
    <TabBarContext.Provider
      value={{ isMock: true, isTabBarHidden: false, setTabBarHidden: () => {} }}
      children={children}
    />
  );
}

let nextId = 0;

/**
 * Automatically hides the tab bar when rendered at the current location.
 */
export function useAutoHidesTabBar() {
  const [id] = useState(() => String(++nextId));
  const { setTabBarHidden } = useTabBarContext();

  const { history, location } = useMobileRouter();

  const top = history.top();
  const fullyClaimed = location.claimIndex === location.segments.length;
  const pathMatches = top.segments.join("/") === location.segments.join("/");
  const hidden = pathMatches && fullyClaimed;

  useEffect(() => {
    setTabBarHidden(id, hidden);
  }, [hidden]);

  // Make sure we clear the visibility flag when we are unmounted.
  useEffect(() => {
    return () => {
      setTabBarHidden(id, false);
    };
  }, []);
}
