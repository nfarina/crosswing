import { action } from "storybook/actions";
import { BrowserIcon } from "../icons/Browser.js";
import { TrashIcon } from "../icons/Trash.js";
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
        children={<BrowserIcon />}
        onClick={action("onBrowserClick")}
      />
      <MobileToolbarSpace />
      <MobileToolbarButton
        children={<TrashIcon />}
        onClick={action("onTrashClick")}
      />
    </MobileToolbar>
  </MobileToolbarLayout>
);
