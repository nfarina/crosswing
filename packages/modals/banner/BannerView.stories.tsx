import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { BannerView } from "../banner/BannerView";

export default {
  component: BannerView,
  decorators: [CrosswingAppDecorator({ layout: "centered" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BannerView>;

export const TitleAndText = () => (
  <BannerView
    style={{ width: "400px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty."
    onClick={action("click")}
    onClose={action("close")}
  />
);

export const TitleAndLongText = () => (
  <BannerView
    style={{ width: "400px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty. Also I heard that it's healthy."
    onClick={action("click")}
    onClose={action("close")}
  />
);

export const TitleAndWrappedText = () => (
  <BannerView
    wrap
    style={{ width: "400px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty. Also I heard that it's healthy."
    onClick={action("click")}
    onClose={action("close")}
  />
);
