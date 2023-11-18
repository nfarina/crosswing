import { RouterDecorator } from "../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../theme/storybook";
import { Notice } from "./Notice";
import { SeparatorLayout } from "./SeparatorLayout";

export default {
  component: Notice,
  decorators: [CrosswingAppDecorator({ layout: "mobile" }), RouterDecorator],
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
