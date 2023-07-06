import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { BannerView } from "../BannerView.js";

export default {
  title: "modals/BannerView",
  decorators: [CyberAppDecorator({ layout: "centered" })],
  parameters: { layout: "centered" },
};

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
