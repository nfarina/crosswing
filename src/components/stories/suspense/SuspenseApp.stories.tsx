import { Meta } from "@storybook/react";
import React from "react";
import { MockHostProvider } from "../../../host/mocks/MockHostProvider";
import { ModalRootProvider } from "../../../modals/context/ModalRootProvider";
import { BrowserSimulator } from "../../../router/storybook/BrowserSimulator";
import { CyberAppDecorator } from "../../../theme/storybook";
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
            <Story />
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
