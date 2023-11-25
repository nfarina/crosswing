import { Meta } from "@storybook/react";
import { MockHostProvider } from "../../../host/mocks/MockHostProvider";
import { ModalRootProvider } from "../../../modals/context/ModalRootProvider";
import { BrowserSimulator } from "../../../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../../../storybook";
import { SuspenseSite } from "./SuspenseSite";

export default {
  component: SuspenseSite,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    (Story: () => any) => (
      // Simulate an ios container for nice transitions that help visualize the
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
