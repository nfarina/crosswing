import { action } from "@storybook/addon-actions";
import Browser from "../icons/Browser.svg?react";
import Trash from "../icons/Trash.svg?react";
import { CrosswingAppDecorator } from "../storybook.js";
import {
  MobileToolbar,
  MobileToolbarButton,
  MobileToolbarLayout,
  MobileToolbarSpace,
} from "./MobileToolbar.js";
import { NoContent } from "./NoContent.js";

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
