import React from "react";
import { RouterDecorator } from "../router/storybook/RouterDecorator.js";
import { CyberAppDecorator } from "../theme/storybook.js";
import { Notice } from "./Notice.js";
import { SeparatorLayout } from "./SeparatorLayout.js";

export default {
  component: Notice,
  decorators: [CyberAppDecorator({ layout: "mobile" }), RouterDecorator],
  parameters: { layout: "centered" },
};

export const Normal = () => (
  <SeparatorLayout edges="bottom" inset={["0", "0"]}>
    <Notice>
      Here's some information, typically presented at the top of a form, with
      instructions to the user.
    </Notice>
  </SeparatorLayout>
);

export const Smaller = () => (
  <SeparatorLayout edges="bottom" inset={["0", "0"]}>
    <Notice size="smaller">
      Here's some information, typically presented at the top of a form, with
      instructions to the user.
    </Notice>
  </SeparatorLayout>
);
