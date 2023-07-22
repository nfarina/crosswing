import { CyberAppDecorator } from "@cyber/theme/storybook";
import React from "react";
import { NumberLabel } from "./NumberLabel.js";

export default {
  title: "components/labels/NumberLabel",
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
};

export const Default = () => <NumberLabel amount={42} />;

export const InheritFont = () => <NumberLabel font="none" amount={42} />;

export const FormattingOptions = () => (
  <NumberLabel precision={2} amount={2500_00} dropZeros />
);
