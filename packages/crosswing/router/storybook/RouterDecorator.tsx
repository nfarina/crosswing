import { action } from "@storybook/addon-actions";
import { Suspense } from "react";
import { RouterLocation } from "../RouterLocation.js";
import { RouterContext } from "../context/RouterContext.js";

export * from "./BrowserDecorator.js";
export * from "./BrowserSimulator.js";

// Useful for hosting Storybook components designed to be presented
// in a mobile-app setting.
export function RouterDecorator(Story: () => any) {
  const history = {
    navigate(...params: any[]) {
      // We have to do this on a timeout to handle <Redirect> which uses
      // useLayoutEffect, meaning it may call action() before Storybook is
      // finished setting up the story (and listening to action() events).
      setTimeout(() => action("navigate")(...params), 0);
    },
    top: () => new RouterLocation(),
  } as any;

  const location = new RouterLocation();
  const nextLocation = new RouterLocation();

  return (
    <RouterContext
      value={{ location, nextLocation, history, flags: { isMock: true } }}
    >
      <Suspense fallback={<div>Loading</div>}>
        <Story />
      </Suspense>
    </RouterContext>
  );
}
