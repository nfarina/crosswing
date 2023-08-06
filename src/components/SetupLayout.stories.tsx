import React from "react";
import { CyberAppDecorator } from "../theme/storybook.js";
import { Button } from "./Button.js";
import { SetupLayout } from "./SetupLayout.js";

export default {
  component: SetupLayout,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Default = () => (
  <SetupLayout
    title="Bank Setup"
    message="You'll be connecting your bank to the app. This should only take a minute."
    actions={[
      <Button key="continue" primary size="largest" title="Continue" />,
    ]}
    legal="By continuing, you agree to our Terms of Service."
  />
);
