import Browser from "@crosswing/icons/Browser.svg?react";
import Trash from "@crosswing/icons/Trash.svg?react";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import {
  MobileToolbar,
  MobileToolbarButton,
  MobileToolbarLayout,
  MobileToolbarSpace,
} from "./MobileToolbar";
import { NoContent } from "./NoContent";

export default {
  component: MobileToolbar,
  decorators: [CrosswingAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Default = () => (
  <MobileToolbarLayout>
    <NoContent title="Content Area" />
    <MobileToolbar>
      <MobileToolbarButton
        children={<Browser />}
        onClick={action("onBrowserClick")}
      />
      <MobileToolbarSpace />
      <MobileToolbarButton
        children={<Trash />}
        onClick={action("onTrashClick")}
      />
    </MobileToolbar>
  </MobileToolbarLayout>
);
