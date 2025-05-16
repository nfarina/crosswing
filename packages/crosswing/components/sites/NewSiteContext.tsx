import { createContext, RefObject, use, useEffect, useState } from "react";
import { RouterContext } from "../../router/context/RouterContext";
import { PanelLayoutMode } from "../PanelLayout";
import { SiteHeaderAccessory } from "./SiteHeaderAccessory";

export type NewSiteContextValue = {
  isDefaultContext: boolean;
  /** True if the site sidebar is visible. */
  sidebarVisible: boolean;
  /** Set the sidebar visibility. */
  setSidebarVisible(visible: boolean): void;
  /** The mode of the sidebar layout. */
  sidebarMode: Omit<PanelLayoutMode, "auto">;
  /** Ref to one of any <NewSiteInsertionPoint> children. */
  getSidebarInsertionRef(name: string): NewSiteInsertionRef;
  /** For any <NewSiteInsertionPoint> children. */
  setSidebarInsertionRef(name: string, insertionRef: NewSiteInsertionRef): void;
  /** The current page and any ancestor pages. */
  pages: Map<number, NewSitePage>;
  /** Set a page by id. Used by useNewSitePageTitle(). */
  setPage(id: number, page: NewSitePage): void;
  /** Remove a page by id. Used by useNewSitePageTitle(). */
  removePage(id: number): void;
  /** The current site accessories. */
  accessories: SiteHeaderAccessory[];
};

export type NewSitePage = {
  title: string;
  link: string;
  intermediate?: boolean;
};

export type NewSiteRef = RefObject<HTMLDivElement | null>;
export type NewSiteInsertionRef = RefObject<HTMLDivElement | null>;

export const NewSiteContext = createContext<NewSiteContextValue>({
  isDefaultContext: true,
  sidebarVisible: true,
  setSidebarVisible: alwaysThrows,
  sidebarMode: "shrink",
  getSidebarInsertionRef: alwaysThrows,
  setSidebarInsertionRef: alwaysThrows,
  pages: new Map(),
  setPage: alwaysThrows,
  removePage: alwaysThrows,
  accessories: [],
});

function alwaysThrows(): never {
  throw new Error(
    "Cannot set sidebar visibility without a parent <NewSiteLayout>.",
  );
}

let nextId = 0;
function getNextId() {
  return nextId++;
}

export function useNewSitePageTitle(
  title: string,
  { intermediate = false }: { intermediate?: boolean } = {},
) {
  const [id] = useState(getNextId);
  const { isDefaultContext, setPage, removePage } = use(NewSiteContext);
  const { location } = use(RouterContext);
  const link = location.claimedHref();

  useEffect(() => {
    if (isDefaultContext) return;
    if (title) setPage(id, { title, link, intermediate });
    return () => removePage(id);
  }, [title]);
}
