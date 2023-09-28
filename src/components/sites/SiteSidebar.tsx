import {
  CSSProperties,
  Fragment,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import { styled } from "styled-components";
import CyberLogoIcon from "../../../icons/CyberLogo.svg?react";
import PlaceholderIcon from "../../../icons/Placeholder.svg?react";
import { flattenChildren } from "../../hooks/flattenChildren";
import { useRouter } from "../../router/context/RouterContext";
import { Link } from "../../router/Link";
import { UnreadBadge } from "../../router/tabs/UnreadBadge";
import { colors, HexColorBuilder } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts";
import {
  SiteHeaderAccessory,
  SiteHeaderAccessoryView,
  StyledSiteHeaderAccessoryView,
} from "./SiteHeaderAccessory";

export type SiteSidebarAreaProps = {
  path: string;
  title: ReactNode;
  classicIcon?: ReactNode;
  icon?: ReactNode;
  /** Expects <SiteSidebarLink> */
  children?: ReactNode;
  badge?: number | null | "any";
};

export type SiteSidebarLinkProps = {
  path: string;
  title: ReactNode;
};

export function SiteSidebar({
  logo = <CyberLogoIcon style={{ width: "50px", height: "50px" }} />,
  tint = colors.orange,
  accessories,
  children,
  onLinkClick,
  style,
  ...rest
}: {
  logo?: ReactNode;
  tint?: HexColorBuilder;
  accessories?: SiteHeaderAccessory[] | null;
  children?: ReactNode;
  onLinkClick?: (path: string) => void;
} & HTMLAttributes<HTMLDivElement>) {
  // Coerce children to array, flattening fragments and falsy conditionals.
  const areas = flattenChildren(children).filter(isSidebarArea);

  // Pull our route information from context. Use "nextLocation" so we can
  // highlight the link that is *being* navigated to, not the one that is
  // currently being viewed.
  const { nextLocation } = useRouter();

  function renderArea(area: ReactElement<SiteSidebarAreaProps>) {
    const {
      path,
      title,
      icon: standardIcon = <PlaceholderIcon />,
      classicIcon,
      children,
      badge,
    } = area.props;

    const links = flattenChildren(children).filter(isSidebarLink);

    const isSelected = !!nextLocation.tryClaim(path);

    const onAreaClick = () => onLinkClick?.(path);

    return (
      <Fragment key={path}>
        <Link
          className="area-link"
          to={path}
          data-selected={isSelected}
          data-is-classic-icon={!!classicIcon}
          onClick={links.length === 0 ? onAreaClick : undefined}
        >
          {classicIcon ?? standardIcon}
          <div className="title">{title}</div>
          {!!badge && (
            <UnreadBadge children={badge === "any" ? <>&nbsp;</> : badge} />
          )}
        </Link>
        {links.map((link) =>
          renderLink(area, link, link === links[links.length - 1]),
        )}
      </Fragment>
    );
  }

  function renderLink(
    area: ReactElement<SiteSidebarAreaProps>,
    link: ReactElement<SiteSidebarLinkProps>,
    isLast: boolean,
  ) {
    const { path: areaPath } = area.props;
    const { path, title } = link.props;

    const fullPath = `${areaPath}/${path}`;

    const isSelected = !!nextLocation.tryClaim(fullPath);
    const isAreaSelected = !!nextLocation.tryClaim(areaPath);

    return (
      <Link
        className="link"
        key={path}
        to={fullPath}
        data-selected={isSelected}
        data-area-selected={isAreaSelected}
        data-last={isLast}
        onClick={() => onLinkClick?.(fullPath)}
        // Don't allow tabbing focus to the link if it's not visible.
        tabIndex={isAreaSelected ? undefined : -1}
      >
        <div className="title">{title}</div>
      </Link>
    );
  }

  const cssProperties = {
    ...style,
    "--tint-color": tint(),
    "--tint-color-light": tint({ lighten: 0.1 }),
    "--tint-color-lighter": tint({ lighten: 0.18 }),
  } as CSSProperties;

  return (
    <StyledSiteSidebar
      {...rest}
      style={cssProperties}
      data-showing-accessories={!!accessories?.length}
    >
      <Link className="home" to="/" children={logo} />
      <div className="menu">{areas.map(renderArea)}</div>
      {accessories?.map((accessory, i) => (
        <SiteHeaderAccessoryView
          key={String(`accessory-${i}`)}
          accessory={accessory}
        />
      ))}
    </StyledSiteSidebar>
  );
}

export function SiteSidebarArea({}: SiteSidebarAreaProps) {
  // Our own render method is never called.
  return null;
}
// We use this instead of comparing item.type === SidebarArea because that class
// pointer is not stable during development with hot reloading.
SiteSidebarArea.isSiteSidebarArea = true;

export function SiteSidebarLink({}: SiteSidebarLinkProps) {
  // Our own render method is never called.
  return null;
}
SiteSidebarLink.isSiteSidebarLink = true;

function isSidebarArea(
  item: ReactNode,
): item is ReactElement<SiteSidebarAreaProps> {
  return isValidElement(item) && !!item.type?.["isSiteSidebarArea"];
}

function isSidebarLink(
  item: ReactNode,
): item is ReactElement<SiteSidebarLinkProps> {
  return isValidElement(item) && !!item.type?.["isSiteSidebarLink"];
}

export const StyledSiteSidebar = styled.div`
  display: flex;
  flex-flow: column;
  background: ${colors.textBackground()};
  padding: 10px;
  overflow: auto;
  width: 150px;
  box-sizing: border-box;

  > * {
    flex-shrink: 0;
  }

  > ${StyledSiteHeaderAccessoryView} {
    height: 60px;
    margin: -10px;
    border-bottom: 1px solid ${colors.separator()};
  }

  > .home {
    box-sizing: border-box;
    height: calc(150px - 20px);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      > * {
        fill: ${colors.primary()};
      }
    }
  }

  > .menu {
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    margin-top: 10px;

    > .area-link {
      display: flex;
      flex-flow: row;
      align-items: center;
      text-decoration: none;
      min-height: 29px;

      > * {
        flex-shrink: 0;
      }

      > svg {
        width: 20px;
        height: 20px;
        margin-left: -2.5px;
        margin-right: 6.5px;

        * {
          fill: ${colors.text({ alpha: 0.5 })};

          @media (prefers-color-scheme: dark) {
            fill: ${colors.text({ alpha: 0.35 })};
          }
        }
      }

      &[data-is-classic-icon="true"] {
        > svg {
          width: 29px;
          height: 29px;
          /* Our classic icons often have built-in padding, so compensate for that. */
          margin-left: -6px;
          margin-right: 0;
        }
      }

      > .title {
        font: ${fonts.display({ size: 15 })};
        color: ${colors.text()};
        white-space: nowrap;
      }

      > ${UnreadBadge} {
        margin-left: 5px;
      }

      &[data-selected="true"] {
        > svg {
          * {
            fill: var(--tint-color-light);
          }
        }

        > .title {
          font: ${fonts.displayBold({ size: 15 })};
          color: var(--tint-color);
        }
      }
    }

    > .link {
      height: 24px;
      text-decoration: none;
      transition: height 0.2s ease-in-out;
      overflow: hidden;

      > .title {
        font: ${fonts.display({ size: 15 })};
        color: ${colors.text()};
        white-space: nowrap;
        margin-left: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      &[data-selected="true"] {
        > .title {
          font: ${fonts.displayMedium({ size: 15 })};
          color: var(--tint-color-light);

          @media (prefers-color-scheme: dark) {
            color: var(--tint-color-lighter);
          }
        }
      }

      &[data-last="true"] {
        height: calc(24px + 10px);

        > title {
          margin-bottom: 10px;
        }
      }

      &[data-area-selected="false"] {
        height: 0;
      }
    }
  }

  &[data-showing-accessories="true"] {
    flex-direction: column-reverse;

    > .menu {
      margin: 20px 0;
    }

    > .home {
      margin: -10px 0;
    }
  }
`;
