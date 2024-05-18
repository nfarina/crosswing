import { Meta } from "@storybook/react";
import { BrowserDecorator } from "../../router/storybook/RouterDecorator.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { NoContent } from "../NoContent.js";
import { SiteArea, SiteLayout } from "./SiteLayout.js";

export default {
  component: SiteLayout,
  decorators: [
    BrowserDecorator,
    CrosswingAppDecorator({ layout: "fullscreen" }),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteLayout>;

export const Default = () => (
  <SiteLayout title="Demo App" sidebarWidth={100}>
    <SiteArea
      path="users"
      title="Users"
      render={() => <NoContent title="Users Area" />}
    />
    <SiteArea
      path="teams"
      title="Teams"
      render={() => <NoContent title="Teams Area" />}
    />
  </SiteLayout>
);
