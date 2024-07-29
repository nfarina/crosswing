import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { RouterDecorator } from "../../router/storybook/RouterDecorator.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { ToastView } from "./ToastView.js";

export default {
  component: ToastView,
  decorators: [CrosswingAppDecorator({ layout: "centered" }), RouterDecorator],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastView>;

export const TitleAndText = () => (
  <ToastView
    style={{ width: "350px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty."
    onClick={action("click")}
    onClose={action("close")}
  />
);

export const Link = () => (
  <ToastView
    style={{ width: "350px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty."
    to="/somewhere"
    onClick={action("click")}
    onClose={action("close")}
  />
);

export const TitleAndLongText = () => (
  <ToastView
    style={{ width: "350px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty. Also I heard that it's healthy."
    onClick={action("click")}
    onClose={action("close")}
  />
);

export const TitleAndTruncatedText = () => (
  <ToastView
    truncate
    style={{ width: "350px" }}
    title="New comment on Whole Foods"
    message="Bob: How's the Quinoa here? I heard it's tasty. Also I heard that it's healthy."
    onClick={action("click")}
    onClose={action("close")}
  />
);
