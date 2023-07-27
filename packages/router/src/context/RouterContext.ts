import { createContext, useContext } from "react";
import { BrowserHistory } from "../history/BrowserHistory.js";
import { MemoryHistory } from "../history/MemoryHistory.js";
import { RouterLocation } from "../history/RouterLocation.js";

export type Router = {
  location: RouterLocation;
  nextLocation: RouterLocation;
  history: MemoryHistory | BrowserHistory;
  back?: string; // href for Nav descendants to render a Back link.
  parent?: Router;
  flags?: RouterFlags;
};

export type RouterFlags = {
  /** True if this is the default context (no provider detected). */
  isDefault?: boolean;
  /** True if this Router is a mock one, for Storybook or some other purpose. Used to prevent triggering certain runtime warnings. */
  isMock?: boolean;
  /** True to hint to certain components that you're running inside a mobile app. Used for warnings like improper back button behavior on Android. */
  isMobileApp?: boolean;
};

export const RouterContext = createContext<Router>({
  location: new RouterLocation(),
  nextLocation: new RouterLocation(),
  history: new MemoryHistory(),
  flags: {
    isDefault: true,
  },
});
RouterContext.displayName = "RouterContext";

export function useRouter({
  ignoreDefaultWarning,
}: { ignoreDefaultWarning?: boolean } = {}): Router {
  const context = useContext(RouterContext);

  if (!ignoreDefaultWarning && context.flags?.isDefault) {
    console.warn(
      "You are attempting to use a RouterContext without an <AppRouter> ancestor. Things like links may not work.",
    );
  }

  return context;
}
