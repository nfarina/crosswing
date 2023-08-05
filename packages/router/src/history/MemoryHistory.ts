import Debug from "debug";
import { RouterLocation } from "../RouterLocation.js";
import { NavigateListener } from "./BrowserHistory.js";

const debug = Debug("router:MemoryHistory");

export class MemoryHistory {
  public type: "memory" = "memory";
  public location: RouterLocation;
  public listeners: Set<NavigateListener> = new Set();

  constructor(initialPath?: string) {
    if (initialPath) {
      this.location = RouterLocation.fromHref(initialPath);
    } else {
      this.location = new RouterLocation();
    }
  }

  public top() {
    return this.location;
  }

  public navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
    if (!to.startsWith("/")) {
      throw new Error(
        `Cannot navigate to the relative path "${to}". Try calling location.linkTo() from your current context to get an absolute path.`,
      );
    }

    debug(`navigate("${to}", {replace: ${replace}}`);

    const location = RouterLocation.fromHref(to);
    this.location = location;

    debug(`Notify ${this.listeners.size} listeners.`);
    for (const listener of this.listeners) listener(location);
  }

  public listen(listener: NavigateListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
