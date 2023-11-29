import { Meta } from "@storybook/react";
import { MockHostProvider } from "../../../host/mocks/MockHostProvider";
import { ModalRootProvider } from "../../../modals/context/ModalRootProvider";
import { BrowserSimulator } from "../../../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../../../storybook";
import { PageTitleProvider } from "../../sites/SitePageTitle";
import { SuspenseApp, SuspenseNavs, SuspenseSwitch } from "./SuspenseApp.js";

export default {
  component: SuspenseApp,
  decorators: [
    CrosswingAppDecorator({ layout: "mobile" }),
    (Story: () => any) => (
      // Simulate an ios container for nice transitions that help visualize the
      // UX with suspense.
      <MockHostProvider container="ios">
        <BrowserSimulator>
          <ModalRootProvider>
            <PageTitleProvider>
              <Story />
            </PageTitleProvider>
          </ModalRootProvider>
        </BrowserSimulator>
      </MockHostProvider>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SuspenseApp>;

export const App = () => <SuspenseApp />;

export const Navs = () => <SuspenseNavs />;

export const Switch = () => <SuspenseSwitch />;
