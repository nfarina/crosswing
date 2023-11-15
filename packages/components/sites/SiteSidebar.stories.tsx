import Globe from "@crosswing/icons/Globe.svg?react";
import { Router } from "@crosswing/router";
import { MemoryHistory } from "@crosswing/router/history/memory";
import { colors } from "@crosswing/theme/colors";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { Meta } from "@storybook/react";
import { useState } from "react";
import { styled } from "styled-components";
import { SiteSidebar, SiteSidebarArea, SiteSidebarLink } from "./SiteSidebar";

export default {
  component: SiteSidebar,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SiteSidebar>;

export const Default = () => (
  <Router
    render={() => (
      <SiteSidebar logo={<Logo />}>
        <SiteSidebarArea path="users" title="Users" />
        <SiteSidebarArea path="activity" title="Activity" />
      </SiteSidebar>
    )}
  />
);

export const Expandable = () => {
  // Default to /users/active so it's selected.
  const [history] = useState(() => new MemoryHistory("/users/active"));

  return (
    <Router
      history={history}
      render={() => (
        <SiteSidebar logo={<Logo />}>
          <SiteSidebarArea path="users" title="Users">
            <SiteSidebarLink path="active" title="Active" />
            <SiteSidebarLink path="deleted" title="Deleted" />
          </SiteSidebarArea>
          <SiteSidebarArea path="activity" title="Activity">
            <SiteSidebarLink path="payments" title="Payments" />
          </SiteSidebarArea>
        </SiteSidebar>
      )}
    />
  );
};

const Logo = styled(Globe)`
  width: 50px;
  height: 50px;

  path {
    fill: ${colors.turquoise()};
  }
`;
