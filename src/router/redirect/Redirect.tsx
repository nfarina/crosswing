import React, { useLayoutEffect } from "react";
import { looksLikeHref } from "../Link.js";
import { useRouter } from "../context/RouterContext.js";

export function Redirect({ to }: { to: string }) {
  const { location, history } = useRouter();

  // Use layout effect so we can re-render before any DOM gets on screen.
  useLayoutEffect(() => {
    if (looksLikeHref(to)) {
      // You can redirect to anywhere on the web, too.
      window.location.href = to;
    } else {
      // We support relative paths by combining them with our current location.
      history.navigate(location.linkTo(to), { replace: true });
    }
  }, [to]);

  return <noscript />;
}
