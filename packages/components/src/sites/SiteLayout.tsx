import { flattenChildren } from "@cyber/hooks/flattenChildren";
import { useMatchMedia } from "@cyber/hooks/useMatchMedia";
import { Redirect } from "@cyber/router/redirect";
import { Route, Switch } from "@cyber/router/switch";
import { colors } from "@cyber/theme/colors";
import Menu from "@cyber/theme/icons/Menu.svg";
import React, {
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { styled } from "styled-components";
import { Clickable } from "../Clickable.js";
import { NoContent } from "../NoContent.js";
import { PageTitleProvider } from "./PageTitle.js";
import { SiteHeader, StyledSiteHeader } from "./SiteHeader.js";
import {
  SiteSidebar,
  SiteSidebarArea,
  SiteSidebarAreaProps,
  SiteSidebarLink,
  SiteSidebarLinkProps,
  StyledSiteSidebar,
} from "./SiteSidebar.js";

export interface SiteAreaProps extends SiteSidebarAreaProps {
  render?: () => ReactElement<any>;
}

export interface SiteLinkProps extends SiteSidebarLinkProps {
  render?: () => ReactElement<any>;
}

export function SiteLayout({
  children,
  title,
  logo,
  accountButton,
  tasksButton,
  searchButton,
}: {
  /** Expects <SiteAreaProps> */
  children?: ReactNode;
  title: string;
  logo?: ReactNode;
  accountButton?: ReactNode;
  tasksButton?: ReactNode;
  searchButton?: ReactNode;
}) {
  // The sidebar defaults to hidden in a mobile layout but can be shown with
  // a button.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Automaticaly close the sidebar when the current location changes.
  // const { location } = useMobileRouter();

  // useEffect(() => {
  //   setSidebarOpen(false);
  // }, [location.href({ excludeSearch: true })]);

  const mobileLayout = useMatchMedia("(max-width: 500px)");

  function onLinkClick(path: string) {
    setSidebarOpen(false);
  }

  // Coerce children to array, flattening fragments and falsy conditionals.
  const areas = flattenChildren(children).filter(isSiteArea);

  function renderSidebarArea(area: ReactElement<SiteAreaProps>) {
    const { path, title, icon, classicIcon, children, badge } = area.props;

    const links = flattenChildren(children).filter(isSiteLink);

    return (
      <SiteSidebarArea
        key={path}
        path={path}
        title={title}
        icon={icon}
        badge={badge}
        classicIcon={classicIcon}
      >
        {links.map(renderSidebarLink)}
      </SiteSidebarArea>
    );
  }

  function renderSidebarLink(link: ReactElement<SiteLinkProps>) {
    const { path, title } = link.props;

    return <SiteSidebarLink key={path} path={path} title={title} />;
  }

  function renderAreaRoutes(area: ReactElement<SiteAreaProps>) {
    const { path, children, render } = area.props;

    const links = flattenChildren(children).filter(isSiteLink);

    const renderRedirect = () => {
      // Redirect to first link if area has child links.
      if (links[0]) {
        return <Redirect to={links[0].props.path} />;
      } else {
        return <NoContent title="Nothing Selected" />;
      }
    };

    return (
      <Fragment key={path}>
        {links.map((link) => renderLinkRoutes(area, link))}
        <Route path={path} render={render ?? renderRedirect} />
      </Fragment>
    );
  }

  function renderLinkRoutes(
    area: ReactElement<SiteAreaProps>,
    link: ReactElement<SiteLinkProps>,
  ) {
    const { path, render } = link.props;

    const fullPath = `${area.props.path}/${path}`;

    return render && <Route key={path} path={fullPath} render={render} />;
  }

  // Create a button to open the sidebar, when on mobile.
  const sidebarButton = (
    <SidebarButton onClick={() => setSidebarOpen(true)} children={<Menu />} />
  );

  return (
    <PageTitleProvider>
      <StyledSiteLayout data-sidebar-open={sidebarOpen}>
        <SiteHeader
          siteTitle={title}
          // leftButton={sidebarButton}
          tasksButton={tasksButton}
          searchButton={searchButton}
          rightButton={mobileLayout ? sidebarButton : accountButton}
        />
        <SiteSidebar
          logo={logo}
          accountButton={mobileLayout && accountButton}
          onLinkClick={onLinkClick}
        >
          {areas.map(renderSidebarArea)}
        </SiteSidebar>
        <div className="content">
          <Switch>
            {areas.map(renderAreaRoutes)}
            {/* Site default redirect. */}
            <Route
              render={() =>
                areas[0] ? (
                  <Redirect to={areas[0].props.path} />
                ) : (
                  <NoContent title="Nothing Selected" />
                )
              }
            />
          </Switch>
        </div>
        <div className="bottom-border" />
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      </StyledSiteLayout>
    </PageTitleProvider>
  );
}

export function SiteArea({}: SiteAreaProps) {
  // Our own render method is never called.
  return null;
}
// We use this instead of comparing item.type === SiteArea because that class
// pointer is not stable during development with hot reloading.
SiteArea.isSiteArea = true;

export function SiteLink({}: SiteLinkProps) {
  // Our own render method is never called.
  return null;
}
SiteLink.isSiteLink = true;

function isSiteArea(child: ReactNode): child is ReactElement<SiteAreaProps> {
  return isValidElement(child) && !!child.type?.["isSiteArea"];
}

function isSiteLink(child: ReactNode): child is ReactElement<SiteLinkProps> {
  return isValidElement(child) && !!child.type?.["isSiteLink"];
}

export const StyledSiteLayout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 60px 1fr;
  position: relative;
  background: ${colors.textBackground()};
  padding-bottom: env(safe-area-inset-bottom);

  > ${StyledSiteHeader} {
    grid-column: 2;
    grid-row: 1;
    box-shadow: 0 1px 0 ${colors.separator()};
    z-index: 1;
  }

  > ${StyledSiteSidebar} {
    grid-column: 1;
    grid-row: 1 / 3;
    z-index: 3;
    box-shadow: 1px 0 0 ${colors.separator()};
  }

  > .content {
    grid-column: 2;
    grid-row: 2;
    z-index: 0;
    display: flex;
    flex-flow: column;

    > * {
      flex-grow: 1;
      height: 0;
    }
  }

  > .bottom-border {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: calc(env(safe-area-inset-bottom) - 1px);
    height: 1px;
    background: ${colors.separator()};
  }

  > .sidebar-overlay {
    grid-column: 1;
    grid-row: 1 / 3;
    /* From useDialog */
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    z-index: 2;
    transition: opacity 0.2s ease-out;
    pointer-events: none;
  }

  /* Mobile layout */
  @media (max-width: 500px) {
    /* Remove the sidebar from the grid and make it float on the left. */
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;

    > ${StyledSiteSidebar} {
      grid-column: 1;
      grid-row: 1 / 3;
      transform: translateX(calc(-100% - 1px));
      transition:
        box-shadow 0.2s ease-out,
        transform 0.2s ease-out;
    }

    > ${StyledSiteHeader} {
      grid-column: 1;
    }

    > .content {
      grid-column: 1;
      grid-row: 2;
    }

    &[data-sidebar-open="true"] {
      > ${StyledSiteSidebar} {
        transform: translateX(0);
        box-shadow:
          1px 0 0 ${colors.separator()},
          5px 0 22px rgba(0, 0, 0, 0.5);
      }

      > .sidebar-overlay {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
`;

const SidebarButton = styled(Clickable)`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;

  > svg {
    width: 24px;
    height: 24px;

    > path {
      fill: ${colors.text()};
    }
  }
`;