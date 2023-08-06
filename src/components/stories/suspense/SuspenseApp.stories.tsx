import { Meta } from "@storybook/react";
import React from "react";
import { MockHostProvider } from "../../../host/mocks/MockHostProvider.js";
import { ModalRootProvider } from "../../../modals/context/ModalRootProvider.js";
import { BrowserSimulator } from "../../../router/storybook/BrowserSimulator.js";
import { CyberAppDecorator } from "../../../theme/storybook.js";
import { SuspenseApp, SuspenseNavs, SuspenseSwitch } from "./SuspenseApp.js";

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
