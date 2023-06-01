import React, { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { BrowserHistory } from "./BrowserHistory.js";
import { useMobileRouter } from "./context.js";

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
  const { location, history } = useMobileRouter();

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

    if (shouldNavigate(href, rest.target, e)) {
      e.preventDefault();
      history.navigate(href, { replace });
    }
  }

  const [href, basePath] = getHref();
  const [path] = href.split("?");
  const currentPath = location.href({ excludeSearch: true });
  const active = currentPath === path;
  const prefixActive = active || currentPath.startsWith(path + "/");

  return (
    <a
      onClick={onAnchorClick}
      href={basePath + href}
      data-active={active}
      data-prefix-active={prefixActive}
      {...rest}
    >
      {children}
    </a>
  );
}

function shouldNavigate(
  href: string,
  target: string | undefined,
  e: MouseEvent,
): boolean {
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
