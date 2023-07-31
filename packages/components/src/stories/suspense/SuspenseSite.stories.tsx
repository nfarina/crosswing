import { MockHostProvider } from "@cyber/host/mocks";
import { ModalRootProvider } from "@cyber/modals/context";
import { BrowserSimulator } from "@cyber/router/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import React from "react";
import { SuspenseSite } from "./SuspenseSite.js";

export default {
  component: SuspenseSite,
  decorators: [
    CyberAppDecorator({ layout: "fullscreen" }),
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
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export const App = () => <SuspenseSite />;
