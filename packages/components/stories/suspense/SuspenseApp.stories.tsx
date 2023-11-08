import { MockHostProvider } from "@cyber/host/mocks";
import { ModalRootProvider } from "@cyber/modals/context";
import { BrowserSimulator } from "@cyber/router/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import { PageTitleProvider } from "../../sites/SitePageTitle";
import { SuspenseApp, SuspenseNavs, SuspenseSwitch } from "./SuspenseApp";

export default {
  component: SuspenseApp,
  decorators: [
    CyberAppDecorator({ layout: "mobile" }),
    (
      Story, // Simulate an ios container for nice transitions that help visualize the
    ) => (
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
} satisfies Meta;

export const App = () => <SuspenseApp />;

export const Navs = () => <SuspenseNavs />;

export const Switch = () => <SuspenseSwitch />;
