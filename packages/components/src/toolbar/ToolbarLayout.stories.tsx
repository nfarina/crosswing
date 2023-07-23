import { useAsyncTask } from "@cyber/hooks/useAsyncTask";
import { RouterDecorator } from "@cyber/router/storybook";
import { wait } from "@cyber/shared/wait";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { NoContent } from "../NoContent.js";
import { SelectOption } from "../forms/Select.js";
import {
  Toolbar,
  ToolbarButton,
  ToolbarInsertionPoint,
  ToolbarMoreButton,
  ToolbarSelect,
  ToolbarSidebarButton,
  ToolbarSpace,
} from "../toolbar/Toolbar.js";
import { useToolbar } from "./ToolbarContext.js";
import { ToolbarLayout } from "./ToolbarLayout.js";
import { ToolbarTab } from "./ToolbarTab.js";

export default {
  component: ToolbarLayout,
  decorators: [CyberAppDecorator({ width: 500, height: 400 }), RouterDecorator],
  parameters: { layout: "centered" },
};

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
    <ToolbarLayout>
      <Toolbar>
        <ToolbarTab children="Tab Button" onClick={action("tabButtonClick")} />
        <ToolbarTab children="Tab Link" to="somewhere" />
      </Toolbar>
      <NoContent title="Content" />
    </ToolbarLayout>
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
