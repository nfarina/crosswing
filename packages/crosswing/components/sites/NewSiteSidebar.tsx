import { HTMLAttributes, MouseEvent, ReactNode, use } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { PanelIcon } from "../../icons/Panel";
import { SidebarIcon } from "../../icons/Sidebar";
import { SidebarMenuIcon } from "../../icons/SidebarMenu";
import { tooltip } from "../../modals/popup/TooltipView";
import { RouterContext } from "../../router/context/RouterContext";
import { Link } from "../../router/Link";
import { AutoBorderView } from "../AutoBorderView";
import { Button } from "../Button";
import { NewSiteContext } from "./NewSiteContext";

export function NewSiteSidebar({
  children,
  logo,
  accessories,
  footer,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  logo?: ReactNode;
  accessories?: ReactNode;
  footer?: ReactNode;
}) {
  const { setSidebarVisible, siteLayout } = use(NewSiteContext);

  return (
    <StyledNewSiteSidebar {...rest}>
      <AutoBorderView className="header">
        <Button
          newStyle
          className="sidebar-toggle"
          icon={siteLayout === "mobile" ? <SidebarMenuIcon /> : <SidebarIcon />}
          onClick={() => setSidebarVisible(false)}
          {...tooltip("Close sidebar", { hotkey: "ctrl+s" })}
        />
        <div className="accessories">{accessories}</div>
      </AutoBorderView>
      <div className="children">{children}</div>
      {footer && (
        <AutoBorderView side="top" className="footer">
          {footer}
        </AutoBorderView>
      )}
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
    padding: 8px 7px;
    height: 56px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    > .sidebar-toggle {
      align-self: flex-start;
      flex-shrink: 0;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    > .accessories {
      display: flex;
      flex-flow: row;
      align-items: center;
      gap: 10px;
    }
  }

  > .children {
    height: 0;
    flex-grow: 1;
    padding: 5px;
    padding-top: 10px;
    display: flex;
    flex-flow: column;
    overflow-y: auto;

    > * {
      flex-shrink: 0;
    }
  }

  > .footer {
    display: flex;
    flex-flow: column;

    > * {
      flex-shrink: 0;
      flex-grow: 1;
    }
  }
`;

export function NewSiteSidebarText({
  icon,
  children,
  leaveOpen = false,
  onClick,
  ...rest
}: Parameters<typeof Link>[0] & {
  icon?: ReactNode;
  /** Set to true to keep the sidebar open when the link is selected (in overlay mode). */
  leaveOpen?: boolean;
}) {
  const { nextLocation } = use(RouterContext);
  const { setSidebarVisible, siteLayout } = use(NewSiteContext);

  const path = nextLocation.linkTo(rest.to ?? "");
  const isSelected = !!nextLocation.tryClaim(path);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!leaveOpen && siteLayout === "mobile") {
      setSidebarVisible(false);
    }
    onClick?.(e);
  };

  return (
    <StyledNewSiteSidebarText
      {...rest}
      data-is-selected={isSelected}
      onClick={handleClick}
    >
      <div className="icon">{icon}</div>
      <div className="children">{children}</div>
    </StyledNewSiteSidebarText>
  );
}

export const StyledNewSiteSidebarText = styled(Link)`
  display: flex;
  flex-flow: row;
  align-items: center;
  color: ${colors.text()};
  text-decoration: none;
  gap: 10px;
  border-radius: 9px;
  padding: 8px 12px;

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
    font: ${fonts.display({ size: 15 })};
    transform: translateY(-1px);
  }

  &:hover {
    background: ${colors.buttonBackgroundGlow()};
  }

  &[data-prefix-active="true"],
  &[data-is-selected="true"] {
    background: ${colors.linkActiveBackground()};

    > .icon {
      > svg {
        opacity: 1;
      }
    }

    > .children {
      font: ${fonts.displayBold({ size: 15 })};
    }
  }
`;

export function NewSiteSitebarSubtext({
  icon,
  children,
  selected,
  smaller,
  leaveOpen = false,
  onClick,
  ...rest
}: Parameters<typeof Link>[0] & {
  icon?: ReactNode;
  children: ReactNode;
  selected?: boolean;
  smaller?: boolean;
  /** Set to true to keep the sidebar open when the link is selected (in overlay mode). */
  leaveOpen?: boolean;
}) {
  const { setSidebarVisible, siteLayout } = use(NewSiteContext);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!leaveOpen && siteLayout === "mobile") {
      setSidebarVisible(false);
    }
    onClick?.(e);
  };

  return (
    <StyledNewSiteSidebarSubtext
      data-is-selected={selected}
      data-is-smaller={smaller}
      onClick={handleClick}
      {...rest}
    >
      {icon ? (
        <div className="icon">{icon}</div>
      ) : (
        !smaller && <div className="dot" />
      )}
      <div className="children">{children}</div>
    </StyledNewSiteSidebarSubtext>
  );
}

const StyledNewSiteSidebarSubtext = styled(Link)`
  display: flex;
  flex-flow: row;
  align-items: center;
  color: ${colors.text()};
  text-decoration: none;
  gap: 10px;
  border-radius: 9px;
  padding: 9px 12px 9px 42px;
  margin-left: 10px;
  position: relative;

  > .icon {
    width: 14px;
    height: 14px;
    position: absolute;
    left: 16px;
    top: calc(50% - 0.5px);
    transform: translateY(-50%);
    color: ${colors.gray400()};

    @media (prefers-color-scheme: dark) {
      color: ${colors.gray500()};
    }

    > svg {
      width: 14px;
      height: 14px;

      * {
        stroke-width: 3px;
      }
    }
  }

  > .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    left: 19px;
    top: 50%;
    transform: translateY(-50%);
    background: ${colors.gray300()};

    @media (prefers-color-scheme: dark) {
      background: ${colors.gray600()};
    }
  }

  > .children {
    font: ${fonts.display({ size: 13 })};
    transform: translateY(-1px);
  }

  &[data-is-smaller="true"] {
    padding-left: 54px;

    > .children {
      font: ${fonts.display({ size: 13, line: "15px" })};
    }
  }

  &:hover {
    background: ${colors.buttonBackgroundGlow()};
  }

  &[data-prefix-active="true"],
  &[data-is-selected="true"] {
    > .dot {
      background: ${colors.gray500()};

      @media (prefers-color-scheme: dark) {
        background: ${colors.gray350()};
      }
    }

    > .icon {
      > svg {
        color: ${colors.gray600()};

        @media (prefers-color-scheme: dark) {
          color: ${colors.gray300()};
        }
      }
    }

    > .children {
      font: ${fonts.displayBold({ size: 13 })};
    }
  }

  &[data-is-smaller="true"][data-prefix-active="true"],
  &[data-is-smaller="true"][data-is-selected="true"] {
    > .children {
      font: ${fonts.displayBold({ size: 13 })};
    }
  }
`;

/**
 * Header for a group of subtext items in the sidebar.
 * Aligns with the text of NewSiteSitebarSubtext items.
 */
export function NewSiteSubtextHeader({
  children,
  smaller,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  smaller?: boolean;
}) {
  return (
    <StyledNewSiteSubtextHeader data-is-smaller={smaller} {...rest}>
      {children}
    </StyledNewSiteSubtextHeader>
  );
}

export const StyledNewSiteSubtextHeader = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.textSecondary()};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 4px 12px 4px 42px;
  margin-top: 5px;

  &[data-is-smaller="true"] {
    margin-left: 10px;
  }
`;

/**
 * For wrapping a group of subtext items in the sidebar.
 */
export function NewSiteSubtextGroup(props: HTMLAttributes<HTMLDivElement>) {
  return <StyledNewSiteSubtextGroup {...props} />;
}

export const StyledNewSiteSubtextGroup = styled.div`
  display: flex;
  flex-flow: column;
  margin-top: 5px;
  margin-bottom: 8px;

  > * {
    flex-shrink: 0;
  }
`;

export function NewSiteOpenPanelButton({
  panelVisible,
  setPanelVisible,
  ...rest
}: Parameters<typeof Button>[0] & {
  panelVisible: boolean;
  setPanelVisible: (visible: boolean) => void;
}) {
  const { siteLayout } = use(NewSiteContext);

  if (siteLayout !== "mobile" && panelVisible) {
    return null;
  }

  return (
    <Button
      newStyle
      icon={<PanelIcon />}
      style={{ marginRight: "5px" }}
      onClick={() => setPanelVisible(true)}
      {...tooltip("Open panel", { hotkey: "ctrl+e" })}
      {...rest}
    />
  );
}
