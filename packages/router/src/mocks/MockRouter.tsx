import React, { ReactNode } from "react";
import { RouterContext } from "../context/RouterContext.js";
import { RouterLocation } from "../history/RouterLocation.js";

// Useful for hosting components that expect a Router parent, but without
// needing to actually provide routing. Also silences warnings about this
// using the isMock flag on the context.
export function MockRouter({ children }: { children?: ReactNode }) {
  const history = {
    navigate(...params: any[]) {
      console.log("navigate", ...params);
    },
    top: () => new RouterLocation(),
  } as any;

  const location = new RouterLocation();

  return (
    <RouterContext.Provider
      value={{ location, history, flags: { isMock: true } }}
    >
      {children}
    </RouterContext.Provider>
  );
}
