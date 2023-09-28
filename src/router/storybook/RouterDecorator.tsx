import { action } from "@storybook/addon-actions";
import { RouterLocation } from "../RouterLocation";
import { RouterContext } from "../context/RouterContext";
import { TabBarContext } from "../tabs/TabBar";

export * from "./BrowserDecorator";
export * from "./BrowserSimulator";

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
    <RouterContext.Provider
      value={{ location, nextLocation, history, flags: { isMock: true } }}
    >
      <TabBarContext.Provider
        value={{ isTabBarHidden: false, setTabBarHidden: () => {} }}
      >
        <Story />
      </TabBarContext.Provider>
    </RouterContext.Provider>
  );
}
