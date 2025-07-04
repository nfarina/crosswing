import { HTMLAttributes, ReactNode, use } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
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
  ...rest
}: Parameters<typeof Link>[0] & {
  icon?: ReactNode;
}) {
  const { nextLocation } = use(RouterContext);

  const path = nextLocation.linkTo(rest.to ?? "");
  const isSelected = !!nextLocation.tryClaim(path);

  return (
    <StyledNewSiteSidebarText {...rest} data-is-selected={isSelected}>
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
  padding: 10px 12px;

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
  ...rest
}: Parameters<typeof Link>[0] & {
  icon?: ReactNode;
  children: ReactNode;
  selected?: boolean;
}) {
  return (
    <StyledNewSiteSidebarSubtext data-is-selected={selected} {...rest}>
      {icon ? <div className="icon">{icon}</div> : <div className="dot" />}
      <div className="line" />
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
  position: relative;

  > .icon {
    width: 14px;
    height: 14px;
    color: ${colors.textSecondary({ alpha: 0.5 })};
    position: absolute;
    left: 16px;
    top: calc(50% - 0.5px);
    transform: translateY(-50%);

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
    background: ${colors.textSecondary({ alpha: 0.3 })};
    /* background: ${colors.textSecondary()}; */
    position: absolute;
    left: 19px;
    top: 50%;
    transform: translateY(-50%);
  }

  > .line {
    display: none;
    width: 1px;
    height: 13px;
    background: ${colors.textSecondary({ alpha: 0.3 })};
    position: absolute;
    left: 21.5px;
    top: -6px;
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
    /* background: ${colors.linkActiveBackground()}; */

    > .dot {
      background: ${colors.textSecondary()};
    }

    > .icon {
      > svg {
        color: ${colors.textSecondary()};
      }
    }

    > .children {
      font: ${fonts.displayBold({ size: 15 })};
    }
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
