import Debug from "debug";
import { RouterLocation } from "../RouterLocation";

const debug = Debug("router:BrowserHistory");

export type NavigateListener = (location: RouterLocation) => any;
export type Unsubscribe = () => void;

export class BrowserHistory {
  public type: "browser" = "browser";
  private listeners: Set<NavigateListener> = new Set();

  // You can set a base path and it will cause all navigation events to be
  // "rooted" under this path. Useful for embedding an <Router> inside
  // another <Router> - the child router will live in its own "universe" and
  // navigating to absolute paths won't cause it to leave that universe since
  // basePath is always prepended.
  public basePath: string;

  // If true, always reload the page when navigating. Useful for traditional
  // "website" behavior. If false (default), we will try to use pushState() to
  // navigate to the new page without reloading, which is best for single-page
  // apps.
  public alwaysReloadPage: boolean;

  constructor({
    basePath = "",
    alwaysReloadPage = false,
  }: { basePath?: string; alwaysReloadPage?: boolean } = {}) {
    this.basePath = basePath;
    this.alwaysReloadPage = alwaysReloadPage;
  }

  public top() {
    return RouterLocation.fromLocation(document.location, this.basePath);
  }

  public navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
    const { basePath } = this;

    if (!to.startsWith("/")) {
      throw new Error(
        `Cannot navigate to the relative path "${to}". Try calling location.linkTo() from your current context to get an absolute path.`,
      );
    }

    const href = basePath + to;

    debug(`navigate("${href}", {replace: ${replace}}`);

    if (replace) {
      window.history.replaceState({}, "", href);
    } else {
      window.history.pushState({}, "", href);
    }

    const location = RouterLocation.fromLocation(window.location, basePath);

    debug(`Notify ${this.listeners.size} listeners.`);
    for (const listener of this.listeners) listener(location);
  }

  public listen(listener: NavigateListener) {
    this.listeners.add(listener);

    const popstateListener = () => {
      const location = this.top();
      debug(`Popstate called with location "${location}"`);
      listener(location);
    };

    window.addEventListener("popstate", popstateListener);

    return () => {
      this.listeners.delete(listener);
      window.removeEventListener("popstate", popstateListener);
    };
  }
}
