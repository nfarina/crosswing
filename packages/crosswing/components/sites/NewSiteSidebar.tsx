import { HTMLAttributes, ReactNode, use } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { SidebarIcon } from "../../icons/Sidebar";
import { SidebarMenuIcon } from "../../icons/SidebarMenu";
import { RouterContext } from "../../router/context/RouterContext";
import { Link } from "../../router/Link";
import { AutoBorderView } from "../AutoBorderView";
import { Button } from "../Button";
import { Scrollable, StyledScrollable } from "../Scrollable";
import { NewSiteContext } from "./NewSiteContext";
import { SiteHeaderAccessoryView } from "./SiteHeaderAccessory";

export function NewSiteSidebar({
  children,
  logo,
  logoTo,
  onLogoClick,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  logo?: ReactNode;
  logoTo?: string;
  onLogoClick?: () => void;
}) {
  const { sidebarVisible, setSidebarVisible, sidebarMode, accessories } =
    use(NewSiteContext);

  return (
    <StyledNewSiteSidebar {...rest}>
      <AutoBorderView className="header">
        <Button
          data-tooltip="Close sidebar"
          className="sidebar-toggle"
          icon={
            sidebarMode === "overlay" ? <SidebarMenuIcon /> : <SidebarIcon />
          }
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
        <div className="accessories">
          {accessories
            .filter((accessory) => accessory.placement === "sidebar")
            .map((accessory) => (
              <SiteHeaderAccessoryView
                key={accessory.key}
                accessory={accessory}
              />
            ))}
        </div>
      </AutoBorderView>
      <Scrollable>
        <div className="children">
          {children}
          <div className="flex" />
          {logoTo ? (
            <Link
              className="logo"
              to={logoTo}
              onClick={onLogoClick}
              children={logo}
            />
          ) : (
            <div className="logo">{logo}</div>
          )}
        </div>
      </Scrollable>
    </StyledNewSiteSidebar>
  );
}

export const StyledNewSiteSidebar = styled.div`
  display: flex;
  flex-flow: column;
  background: ${colors.textBackgroundPanel()};

  > * {
    flex-shrink: 0;
  }

  > .header {
    z-index: 1;
    box-sizing: border-box;
    padding: 10px;
    height: 50px;
    display: flex;
    flex-flow: row;
    align-items: center;

    > .sidebar-toggle {
      align-self: flex-start;
      flex-shrink: 0;
      min-width: 35px;
      background: ${colors.textBackground()};

      &:not(:hover) {
        background: transparent;
      }
    }

    > .accessories {
      padding-right: 5px;
      flex-grow: 1;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
  }

  > ${StyledScrollable} {
    height: 0;
    flex-grow: 1;

    > .children {
      padding: 5px;
      display: flex;
      flex-flow: column;

      > * {
        flex-shrink: 0;
      }

      > .flex {
        flex-grow: 1;
      }

      > .logo {
        padding: 18px 10px;
        align-self: center;
      }
    }
  }
`;

export function NewSiteSidebarText({
  icon,
  children,
  ...rest
}: Parameters<typeof Link>[0] & {
  icon?: ReactNode;
}) {
  const { nextLocation } = use(RouterContext);

  const path = nextLocation.linkTo(rest.to ?? "");
  const isSelected = !!nextLocation.tryClaim(path);

  return (
    <StyledNewSiteSidebarLink {...rest} data-is-selected={isSelected}>
      <div className="icon">{icon}</div>
      <div className="children">{children}</div>
    </StyledNewSiteSidebarLink>
  );
}

export const StyledNewSiteSidebarLink = styled(Link)`
  display: flex;
  flex-flow: row;
  align-items: center;
  color: ${colors.text()};
  text-decoration: none;
  gap: 10px;
  border-radius: 6px;
  padding: 10px 11px;

  > .icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 20px;
      height: 20px;
      opacity: 0.85;
    }
  }

  > .children {
    font: ${fonts.display({ size: 15, line: "1" })};
  }

  &:hover {
    background: ${colors.lightGray({ alpha: 0.333 })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.extraDarkGray({ alpha: 0.8 })};
    }
  }

  &[data-prefix-active="true"],
  &[data-is-selected="true"] {
    background: ${colors.lightGray()};

    @media (prefers-color-scheme: dark) {
      background: ${colors.extraDarkGray({ lighten: 0.25 })};
    }

    > .icon {
      > svg {
        opacity: 1;
      }
    }

    > .children {
      font: ${fonts.displayBold({ size: 15, line: "1" })};
    }
  }
`;
