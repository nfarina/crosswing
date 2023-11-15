import { MockHostProvider } from "@crosswing/host/mocks";
import { ModalRootProvider } from "@crosswing/modals/context";
import { BrowserSimulator } from "@crosswing/router/storybook";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { Meta } from "@storybook/react";
import { SuspenseSite } from "./SuspenseSite";

export default {
  component: SuspenseSite,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
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
