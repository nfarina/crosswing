import Debug from "debug";
import {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { flattenChildren } from "../../hooks/flattenChildren";
import { useHost } from "../../host/context/HostContext";
import { safeArea } from "../../host/features/safeArea";
import { RouterLocation } from "../RouterLocation";
import { RouterContext, useRouter } from "../context/RouterContext";
import { Redirect } from "../redirect/Redirect";
import { StyledTabBar, TabBar, TabBarContext } from "./TabBar.js";
import { TabProps } from "./TabLink.js";

export * from "./TabBar.js";
export * from "./TabLink.js";
export * from "./UnreadBadge.js";

const debug = Debug("router:Tabs");

export function Tabs({
  children,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  // Coerce children to array, flattening fragments and falsy conditionals.
  const tabs = flattenChildren(children).filter(isTab);

  // Pull our route information from context.
  const { location, nextLocation, history, parent, flags } = useRouter();

  // Grab the viewport information from our native host so we can hide
  // the tab bar if the keyboard is visible.
  const { viewport, container } = useHost();

  // Construct our storage for inactive tabs.
  const { current: tabLocations } = useRef(new Map<string, RouterLocation>());

  debug(
    `Render <Tabs> with location "${location}" and next location "${nextLocation}"`,
  );

  // The tab that will be selected next, regardless of whether it is loaded.
  const nextSelected = selectTab(tabs, nextLocation);

  // The "deferred" contents we are rendering currently.
  const selected = selectTab(tabs, location);
  const { path } = selected.tab.props;

  // Update the path of our currently selected tab.
  useEffect(() => {
    if (!selected.redirect) tabLocations.set(path, selected.location);
  });

  // Request IDs from children that desire the tab bar to be hidden.
  const [hideRequests, setHideRequests] = useState<Set<string>>(new Set());

  const isTabBarHidden = hideRequests.size > 0;

  const setTabBarHidden = (requestId: string, hidden: boolean) => {
    const newRequests = new Set(hideRequests);
    if (hidden) {
      newRequests.add(requestId);
    } else {
      newRequests.delete(requestId);
    }
    setHideRequests(newRequests);
  };

  //
  // Render
  //

  if (selected.redirect) {
    debug(`Location does not match any tabs. Redirecting to "${path}"`);
    return <Redirect to={selected.location.href()} />;
  }

  debug(`Render <Tabs> with child location "${selected.location}"`);

  function getTabLink(tab: ReactElement<TabProps>): string {
    const tabLocation = tabLocations.get(tab.props.path);

    // If we've visited this tab before, and we're not currently viewing it,
    // then when the user clicks it, they should be taken back to whatever
    // "deep" content they had navigated to previously.
    if (tabLocation && tab !== selected.tab) return tabLocation.href();

    // Link to the root path, unless the user wants a specific path here.
    return location.linkTo(tab.props.path);
  }

  function renderTabContents(tab: ReactElement<TabProps>): ReactNode {
    const { path: tabPath, render } = tab.props;

    const isSelected = tab === selected.tab;
    const childLocation = isSelected
      ? selected.location
      : tabLocations.get(tabPath);

    const isNextSelected = tab === nextSelected.tab;
    const nextChildLocation = isNextSelected
      ? nextSelected.location
      : tabLocations.get(tabPath);

    // Do we have a current or old location for this tab? Render it if so.
    if (childLocation && nextChildLocation) {
      const childContext = {
        history,
        location: childLocation,
        nextLocation: nextChildLocation,
        parent,
        flags,
      };
      const className = isSelected ? "active" : "inactive";

      return (
        <TabContent key={childLocation.claimedHref()} className={className}>
          <RouterContext.Provider value={childContext}>
            {render()}
          </RouterContext.Provider>
        </TabContent>
      );
    }

    // Render a placeholder until the users visits this tab.
    return <TabContent key={tabPath} className="inactive" />;
  }

  // No longer auto-collapsing the tab bar on android. It's just worse. I don't
  // care if it's the "android way".
  // const atTabRoot = location.unclaimedPath() === selected.tab.props.path;

  // const collapsed = viewport.keyboardVisible; //|| (container === "android" && !atTabRoot);

  // Keyboard detection isn't working well on some Android devices.
  const collapsed = container !== "android" && viewport.keyboardVisible;

  return (
    <StyledTabs
      data-container={container}
      data-collapsed={collapsed}
      data-tab-bar-hidden={isTabBarHidden}
      {...rest}
    >
      <TabBarContext.Provider value={{ isTabBarHidden, setTabBarHidden }}>
        {tabs.map(renderTabContents)}
        <TabBar
          tabs={tabs}
          selectedTab={nextSelected.tab}
          getTabLink={getTabLink}
          collapsed={collapsed}
        />
      </TabBarContext.Provider>
    </StyledTabs>
  );
}

interface SelectedTab {
  tab: ReactElement<TabProps>;
  location: RouterLocation;
  redirect?: boolean;
}

function selectTab(
  tabs: ReactElement<TabProps>[],
  location: RouterLocation,
): SelectedTab {
  // Look to see if the desired path matches any of our child tabs.
  for (const tab of tabs) {
    const tabPath = tab.props.path;
    const childLocation = location.tryClaim(tabPath);

    if (childLocation) {
      return { tab, location: childLocation };
    }
  }

  // Redirect to the first tab by default.
  const firstTab = tabs[0];
  const { path } = firstTab.props;

  return {
    tab: firstTab,
    location: location.rewrite(path),
    redirect: true,
  };
}

export function Tab({}: TabProps) {
  // Our own render method is never called.
  return null;
}
// We use this instead of comparing item.type === Tab because that class pointer
// is not stable during development with hot reloading.
Tab.isTab = true;

function isTab(item: ReactNode): item is ReactElement<TabProps> {
  return isValidElement(item) && !!item.type?.["isTab"];
}

const TabContent = styled.div``;

export const StyledTabs = styled.div`
  position: relative; /* Reset z-index. */
  background: ${colors.textBackground()};
  overflow: hidden; /* For tab bars that are hidden, so they don't expand the browser's rendering area. */

  > ${TabContent}.inactive, > ${TabContent}.active {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: calc(49px + ${safeArea.bottom()});
    display: flex;

    > * {
      flex-grow: 1;
    }
  }

  &[data-collapsed="true"] {
    > ${TabContent}.inactive, > ${TabContent}.active {
      bottom: 0;
    }
  }

  &[data-container="android"] {
    > ${TabContent}.inactive, > ${TabContent}.active {
      bottom: calc(58px + ${safeArea.bottom()});
    }
  }

  > ${TabContent}.active {
    z-index: 1;
  }

  > ${TabContent}.inactive {
    /* display: none; */ /* Causes images to flash as they are reloaded when switching back to an already-loaded tab. */
    visibility: hidden;
  }

  > ${StyledTabBar} {
    z-index: 2;
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: transform 0.2s ease-in-out;
  }

  &[data-tab-bar-hidden="true"] {
    > ${TabContent}.inactive, > ${TabContent}.active {
      bottom: 0;
    }

    > ${StyledTabBar} {
      transform: translateY(calc(100% + 1px)); /* Add 1px for top border. */
    }
  }
`;
