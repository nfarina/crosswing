import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { useRouter } from "./context/RouterContext.js";
import { BrowserHistory } from "./history/BrowserHistory.js";
import { MemoryHistory } from "./history/MemoryHistory.js";

export function Link({
  to,
  replace,
  children,
  onClick,
  ...rest
}: Omit<AnchorHTMLAttributes<HTMLElement>, "href"> & {
  to?: string | null;
  replace?: boolean;
  children?: ReactNode;
}) {
  const { location, nextLocation, history } = useRouter();

  function getHref(): [href: string, basePath: string] {
    // Allow the `to` parameter to be optional, which creates a dead link that
    // acts like a <div> and does nothing when pushed. Useful for banging things
    // out during development.
    if (!to) return ["#", ""];

    // You can link to anywhere on the web, too.
    if (looksLikeHref(to)) {
      return [to, ""];
    }

    // OK, we're linking you somewhere internal to the router.

    // Take our router's basePath into account when rendering the official href
    // attribute on the anchor, even though we intercept clicks and navigate
    // internally, you might hold option to open in a new tab, or copy/paste
    // the URL, and we want it to function as expected.
    const basePath = history instanceof BrowserHistory ? history.basePath : "";

    return [location.linkTo(to), basePath];
  }

  function onAnchorClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!to) {
      e.preventDefault();
      onClick?.(e);
      return;
    }

    onClick?.(e);

    const [href] = getHref();

    if (shouldNavigate(history, href, rest.target, e)) {
      e.preventDefault();
      history.navigate(href, { replace });
    }
  }

  const [href, basePath] = getHref();
  const [path] = href.split("?");

  // Consider the "nextLocation" when rendering the link, so that the active
  // state updates immediately even if content is still loading via
  // <Suspense>.
  const currentPath = nextLocation.href({ excludeSearch: true });
  const active = currentPath === path;
  const prefixActive = active || currentPath.startsWith(path + "/");

  return (
    <StyledLink
      onClick={onAnchorClick}
      href={basePath + href}
      data-active={active}
      data-prefix-active={prefixActive}
      {...rest}
    >
      {children}
    </StyledLink>
  );
}

function shouldNavigate(
  history: BrowserHistory | MemoryHistory,
  href: string,
  target: string | undefined,
  e: MouseEvent,
): boolean {
  // If we are always reloading the page, we can just let the anchor handle this.
  if (history.type === "browser" && history.alwaysReloadPage) {
    return false;
  }

  return (
    target !== "_blank" &&
    !href.startsWith("http://") &&
    !href.startsWith("https://") &&
    !href.startsWith("mailto:") &&
    !e.defaultPrevented &&
    e.button === 0 &&
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
  );
}

export function looksLikeHref(link: string): boolean {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("blob:")
  );
}

export const StyledLink = styled.a`
  &[data-active="true"],
  &:active {
    /* TODO: do something here, but also need to refactor every component based on Link! */
  }
`;
