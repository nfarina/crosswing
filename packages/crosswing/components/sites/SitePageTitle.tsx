import {
  CSSProperties,
  Fragment,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { BackIcon } from "../../icons/Back.js";
import { Link } from "../../router/Link.js";
import { useRouter } from "../../router/context/RouterContext.js";
import { NavAccessoryView } from "../../router/navs/NavAccessoryView.js";
import { NavTitleView } from "../../router/navs/NavTitleView.js";
import { SiteHeaderAccessory } from "./SiteHeaderAccessory.js";

// This is pretty fancy for a breadcrumbs system.

export function SitePageTitle({
  siteTitle,
  accessories,
}: {
  siteTitle: string;
  accessories?: SiteHeaderAccessory[] | null;
}) {
  const { crumbs } = useContext(PageTitleContext);

  const sorted = Array.from(crumbs.values()).sort(
    (a, b) => a.link.length - b.link.length,
  );

  // Get the last crumb for the document title.
  const [lastCrumb] = sorted.slice(-1);

  useEffect(() => {
    if (lastCrumb) document.title = lastCrumb.title + " | " + siteTitle;
    else document.title = siteTitle;
  });

  // For mobile.
  const subtitleCrumb = [...sorted]
    .reverse()
    .find((crumb) => crumb !== lastCrumb);
  const backCrumb = [...sorted]
    .reverse()
    .find((crumb) => crumb !== lastCrumb && !crumb.intermediate);

  return (
    <StyledPageTitle>
      <DesktopPageTitle>
        {!!sorted[0] && <Link to={sorted[0].link}>{sorted[0].title}</Link>}
      </DesktopPageTitle>
      {!window && (
        <DesktopPageTitle>
          {sorted.map((crumb) => (
            <Fragment key={crumb.link}>
              <Link to={crumb.link}>{crumb.title}</Link>
              <div className="separator" children="/" />
            </Fragment>
          ))}
        </DesktopPageTitle>
      )}
      <MobilePageTitle
        style={
          { "--num-accessories": accessories?.length ?? 0 } as CSSProperties
        }
      >
        {backCrumb ? (
          <NavAccessoryView
            accessory={{ icon: <BackIcon />, to: backCrumb.link }}
            align="left"
          />
        ) : (
          <div />
        )}
        {lastCrumb ? (
          <NavTitleView
            title={lastCrumb.title || <>&nbsp;</>}
            subtitle={subtitleCrumb ? subtitleCrumb.title || <>&nbsp;</> : null}
          />
        ) : (
          <div />
        )}
      </MobilePageTitle>
    </StyledPageTitle>
  );
}

export type PageTitleContextValue = {
  crumbs: Map<number, Breadcrumb>;
  setCrumb(id: number, crumb: Breadcrumb): void;
  removeCrumb(id: number): void;
};

export const PageTitleContext = createContext<PageTitleContextValue>({
  crumbs: new Map(),
  setCrumb: () => {
    throw new Error("Expected a <PageTitleProvider> as an ancestor!");
  },
  removeCrumb: () => {
    throw new Error("Expected a <PageTitleProvider> as an ancestor!");
  },
});
PageTitleContext.displayName = "PageTitleContext";

interface Breadcrumb {
  title: ReactNode;
  link: string;
  intermediate?: boolean;
}

let nextId = 0;

export function usePageTitle(
  title: string,
  { intermediate = false }: { intermediate?: boolean } = {},
) {
  const [id] = useState(() => nextId++);
  const { setCrumb, removeCrumb } = useContext(PageTitleContext);
  const { location } = useRouter();
  const link = location.claimedHref();

  useLayoutEffect(() => {
    if (title) setCrumb(id, { title, link, intermediate });
    return () => removeCrumb(id);
  }, [title]);
}

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbs] = useState(new Map() as Map<number, Breadcrumb>);

  function setCrumb(id: number, crumb: Breadcrumb) {
    setCrumbs((oldCrumbs) => {
      const newCrumbs = new Map(oldCrumbs);
      newCrumbs.set(id, crumb);
      return newCrumbs;
    });
  }

  function removeCrumb(id: number) {
    setCrumbs((oldCrumbs) => {
      const newCrumbs = new Map(oldCrumbs);
      newCrumbs.delete(id);
      return newCrumbs;
    });
  }

  const context = useMemo(
    () => ({ crumbs, setCrumb, removeCrumb }),
    [crumbs, setCrumb, removeCrumb],
  );

  return <PageTitleContext.Provider value={context} children={children} />;
}

/** For Storybook. */
export function PageTitleDecorator(Story: () => any) {
  return <PageTitleProvider children={<Story />} />;
}

export const DesktopPageTitle = styled.div`
  display: flex;
  flex-flow: row;
  font: ${fonts.display({ size: 15 })};
  padding: 5px;
  overflow-x: auto;

  > * {
    flex-shrink: 0;
  }

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${colors.text()};
    padding: 5px;
  }

  > .separator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.mediumGray()};
  }

  > .separator:last-of-type {
    display: none;
  }

  > a:last-of-type {
    font: ${fonts.displayBold({ size: 24 })};
  }
`;

/** Mimics <Nav>'s Header. */
const MobilePageTitle = styled.div`
  display: flex;
  flex-flow: row;

  > *:nth-child(1) {
    flex-shrink: 0;
    width: 80px;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
    flex-grow: 1;
    width: 0;
  }
`;

export const StyledPageTitle = styled.div`
  display: flex;
  flex-flow: row;

  > * {
    flex-shrink: 0;
    flex-grow: 1;
    width: 0;
  }

  > ${MobilePageTitle} {
    display: none;
  }

  /* If <ListLayout> has collapsed, we want to use a mobile breadcrumb
     system that mimics <Navs>. */
  @media (max-width: 950px) {
    > ${DesktopPageTitle} {
      display: none;
    }

    > ${MobilePageTitle} {
      display: flex;
    }
  }
`;
