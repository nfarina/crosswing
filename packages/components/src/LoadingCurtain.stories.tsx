import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import React from "react";
import { LoadingCurtain } from "./LoadingCurtain.js";

export default {
  component: LoadingCurtain,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LoadingCurtain>;

export const Hidden = () => <LoadingCurtain hidden />;

export const Visible = () => <LoadingCurtain />;

export const Message = () => <LoadingCurtain message="Reticulating splines…" />;

export const Progress = () => <LoadingCurtain type="progress" />;

export const ProgressValue = () => (
  <LoadingCurtain type="progress" progress={0.75} />
);

export const ProgressMessage = () => (
  <LoadingCurtain type="progress" message="Loading vertex mesh…" />
);
