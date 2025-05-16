import {
  HTMLAttributes,
  ReactElement,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { RouterContext } from "../../router/context/RouterContext";
import { PanelLayout, PanelLayoutMode } from "../PanelLayout";
import {
  NewSiteContext,
  NewSiteContextValue,
  NewSiteInsertionRef,
  NewSitePage,
} from "./NewSiteContext";
import { NewSiteHeader, StyledNewSiteHeader } from "./NewSiteHeader";
import { SiteHeaderAccessory } from "./SiteHeaderAccessory";

export function NewSiteLayout({
  sidebarDefaultSize = 225,
  sidebarMinSize = 200,
  sidebarMaxSize = 300,
  desktopBreakpoint = 800,
  siteTitle,
  children,
  accessories = [],
}: HTMLAttributes<HTMLDivElement> & {
  sidebarDefaultSize?: number;
  sidebarMinSize?: number;
  sidebarMaxSize?: number;
  desktopBreakpoint?: number;
  siteTitle: string;
  children: [ReactElement, ReactElement];
  accessories?: SiteHeaderAccessory[];
}) {
  const { location } = use(RouterContext);

  const ref = useRef<HTMLDivElement>(null);
  const [sidebarVisible, setSidebarVisible] = useLocalStorage(
    `NewSiteLayout:sidebarVisible`,
    false,
  );

  const layout = useResponsiveLayout(ref, {
    desktop: { minWidth: desktopBreakpoint },
    mobile: {},
  });

  const sidebarMode: PanelLayoutMode =
    layout === "desktop" ? "shrink" : "overlay";

  // Auto-hide sidebar when navigating to a new page in overlay mode.
  const path = location.href({ excludeSearch: true });
  const [lastPath, setLastPath] = useState(path);
  useEffect(() => {
    if (sidebarMode === "overlay" && path !== lastPath) {
      setSidebarVisible(false);
      setLastPath(path);
    }
  }, [sidebarMode, path, lastPath]);

  //
  // Sidebar insertion points
  //

  const [sidebarInsertionRefs, setSidebarInsertionRefs] = useState<
    Record<string | symbol, NewSiteInsertionRef>
  >({});

  const [, setForceRender] = useState(0);

  function getSidebarInsertionRef(name: string | symbol): NewSiteInsertionRef {
    const ref = sidebarInsertionRefs[name];
    if (!ref) return { current: null };
    return ref;
  }

  function setSidebarInsertionRef(
    name: string | symbol,
    ref: NewSiteInsertionRef,
  ) {
    setSidebarInsertionRefs((refs) => ({ ...refs, [name]: ref }));
    setForceRender((n) => n + 1);
  }

  //
  // Page management
  //

  const [pages, setPages] = useState(new Map() as Map<number, NewSitePage>);

  function setPage(id: number, page: NewSitePage) {
    setPages((oldPages) => {
      const newPages = new Map(oldPages);
      newPages.set(id, page);
      return newPages;
    });
  }

  function removePage(id: number) {
    setPages((oldPages) => {
      const newPages = new Map(oldPages);
      newPages.delete(id);
      return newPages;
    });
  }

  //
  // Render
  //

  const context: NewSiteContextValue = {
    isDefaultContext: false,
    sidebarVisible,
    setSidebarVisible,
    sidebarMode,
    getSidebarInsertionRef,
    setSidebarInsertionRef,
    pages,
    setPage,
    removePage,
    accessories,
  };

  const [sidebar, content] = children;

  return (
    <StyledNewSiteLayout ref={ref}>
      <NewSiteContext value={context}>
        <PanelLayout
          edge="left"
          panelDefaultSize={sidebarDefaultSize}
          panelMinSize={sidebarMinSize}
          panelMaxSize={sidebarMaxSize}
          mode={sidebarMode}
          hideDragHandle
          restorationKey={NewSiteLayout}
          panelVisible={sidebarVisible}
          onPanelVisibleChange={setSidebarVisible}
        >
          <Content>
            <NewSiteHeader siteTitle={siteTitle} />
            {content}
          </Content>
          {sidebar}
        </PanelLayout>
      </NewSiteContext>
    </StyledNewSiteLayout>
  );
}

export const StyledNewSiteLayout = styled.div`
  display: flex;
  flex-flow: column;

  > * {
    height: 0;
    flex-grow: 1;
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;

  > ${StyledNewSiteHeader} {
    flex-shrink: 0;
    z-index: 1;
    /* Prevents width overscroll when toolbar overflows. */
    width: 0;
    min-width: 100%;
  }

  /* Content */
  > *:nth-child(2) {
    height: 0;
    flex-grow: 1;
    z-index: 0;
  }
`;
