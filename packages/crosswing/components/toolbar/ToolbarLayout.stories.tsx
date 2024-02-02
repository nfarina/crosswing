import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { useAsyncTask } from "../../hooks/useAsyncTask";
import { ModalContextProvider } from "../../modals/context/ModalContextProvider";
import { ModalDecorator } from "../../modals/storybook/ModalDecorator";
import {
  BrowserSimulator,
  RouterDecorator,
} from "../../router/storybook/RouterDecorator";
import { wait } from "../../shared/wait";
import { CrosswingAppDecorator } from "../../storybook";
import { NoContent } from "../NoContent";
import { SelectOption } from "../forms/Select";
import {
  Toolbar,
  ToolbarButton,
  ToolbarInsertionPoint,
  ToolbarMoreButton,
  ToolbarSelect,
  ToolbarSidebarButton,
  ToolbarSpace,
} from "../toolbar/Toolbar";
import { useToolbar } from "./ToolbarContext.js";
import { ToolbarIDView } from "./ToolbarIDView";
import { ToolbarLayout } from "./ToolbarLayout.js";
import { ToolbarOverflowTab } from "./ToolbarOverflowTab";
import { ToolbarTab } from "./ToolbarTab.js";

export default {
  component: ToolbarLayout,
  decorators: [
    (Story: () => any) => <Container children={<Story />} />,
    CrosswingAppDecorator({ width: 500, height: 400 }),
    ModalDecorator,
    RouterDecorator,
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToolbarLayout>;

export const InsertionPoints = () => (
  <ToolbarLayout>
    <Toolbar>
      <ToolbarInsertionPoint name="beforeRefresh" />
      <ToolbarButton children="Refresh" />
      <ToolbarSpace />
      <ToolbarInsertionPoint name="beforeMore" />
      {/* Test that unused insertion points don't take up visual space. */}
      <ToolbarInsertionPoint name="unused" />
      <ToolbarMoreButton />
      <ToolbarInsertionPoint name="afterMore" />
    </Toolbar>
    <InsertionPointsContent />
  </ToolbarLayout>
);

function InsertionPointsContent() {
  const { getInsertionRef } = useToolbar();

  const [showBack, setShowBack] = useState(true);

  const backButton = (
    <ToolbarButton children="Back" onClick={action("backClick")} />
  );

  const runButton = (
    <ToolbarButton children="Run" onClick={action("runClick")} />
  );
  const sidebarButton = (
    <ToolbarSidebarButton active onClick={action("sidebarClick")} />
  );

  const backInsertionEl = getInsertionRef("beforeRefresh").current;
  const beforeMoreInsertionEl = getInsertionRef("beforeMore").current;
  const afterMoreInsertionEl = getInsertionRef("afterMore").current;

  return (
    <>
      {showBack && backInsertionEl && createPortal(backButton, backInsertionEl)}
      {beforeMoreInsertionEl && createPortal(runButton, beforeMoreInsertionEl)}
      {afterMoreInsertionEl &&
        createPortal(sidebarButton, afterMoreInsertionEl)}
      <NoContent
        title="Content"
        action={showBack ? "Hide Back Button" : "Show Back Button"}
        onActionClick={() => setShowBack((value) => !value)}
      />
    </>
  );
}

export const Buttons = () => {
  const task = useAsyncTask({ func: () => wait(2000), onError: null });

  return (
    <ToolbarLayout>
      <Toolbar>
        <ToolbarButton
          children="Enabled"
          onClick={task.run}
          working={task.isRunning}
        />
        <ToolbarButton children="Disabled" disabled />
        <ToolbarButton children="Working" working />
        <ToolbarSpace />
        <ToolbarButton children="New…" primary />
        <ToolbarMoreButton />
      </Toolbar>
      <NoContent title="Content" />
    </ToolbarLayout>
  );
};

export const Select = () => {
  return (
    <ToolbarLayout>
      <Toolbar>
        <ToolbarButton children="Button" />
        <ToolbarSelect defaultValue="green">
          <SelectOption title="Red" value="red" />
          <SelectOption title="Green" value="green" />
          <SelectOption title="Blue" value="blue" />
        </ToolbarSelect>
      </Toolbar>
      <NoContent title="Content" />
    </ToolbarLayout>
  );
};

export const Tabs = () => {
  return (
    <BrowserSimulator initialPath="one">
      <ModalContextProvider>
        <ToolbarLayout>
          <Toolbar>
            <ToolbarOverflowTab>
              <ToolbarTab children="Sub Item One" to="one" />
              <ToolbarTab children="Sub Item Two" to="two" />
            </ToolbarOverflowTab>
            <ToolbarTab
              children="Tab Button"
              onClick={action("tabButtonClick")}
            />
            <ToolbarTab children="Tab Link" to="somewhere" />
          </Toolbar>
          <NoContent title="Content" />
        </ToolbarLayout>
      </ModalContextProvider>
    </BrowserSimulator>
  );
};

export const ExpandedTabs = () => {
  return (
    <ToolbarLayout>
      <Toolbar expandTabs>
        <ToolbarTab children="Tab Button" onClick={action("tabButtonClick")} />
        <ToolbarTab children="Tab Link" to="somewhere" />
      </Toolbar>
      <NoContent title="Content" />
    </ToolbarLayout>
  );
};

export const IDView = () => {
  return (
    <ToolbarLayout>
      <Toolbar>
        <ToolbarSpace />
        <ToolbarIDView name="Some Object" id="abc123" />
      </Toolbar>
      <NoContent title="Content" />
    </ToolbarLayout>
  );
};

const Container = styled.div`
  border: 1px solid ${colors.separator()};

  > * {
    height: 100%;
  }
`;
