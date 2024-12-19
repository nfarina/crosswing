import { useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import {
  Toolbar,
  ToolbarInsertionPoint,
  ToolbarSpace,
} from "../toolbar/Toolbar.js";
import { ToolbarLayout } from "../toolbar/ToolbarLayout.js";
import { SidebarLayout, SidebarToggleInsertionPoint } from "./SidebarLayout.js";

export default {
  component: SidebarLayout,
  decorators: [
    ToolbarContainer,
    CrosswingAppDecorator({ layout: "fullscreen" }),
  ],
  parameters: { layout: "fullscreen" },
};

export const Default = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <SidebarLayout
      sidebarDefaultWidth={300}
      sidebarMinWidth={200}
      contentMinWidth={400}
      sidebarVisible={sidebarVisible}
      onSidebarVisibleChange={setSidebarVisible}
      restorationKey={Default}
    >
      <Content>Contents of the main area</Content>
      <Sidebar>Sidebar content here</Sidebar>
    </SidebarLayout>
  );
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.textBackgroundPanel()};
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};
`;

const Sidebar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};
  border-left: 1px solid ${colors.separator()};
`;

function ToolbarContainer(Story: () => any) {
  return (
    <ToolbarLayout>
      <Toolbar>
        <ToolbarSpace />
        <ToolbarInsertionPoint name={SidebarToggleInsertionPoint} />
      </Toolbar>
      <Story />
    </ToolbarLayout>
  );
}
