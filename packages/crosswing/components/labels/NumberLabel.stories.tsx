import { Meta } from "@storybook/react";
import { CrosswingAppDecorator } from "../../storybook";
import { NumberLabel } from "./NumberLabel";

export default {
  component: NumberLabel,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NumberLabel>;

export const Default = () => <NumberLabel amount={42} />;

export const InheritFont = () => <NumberLabel font="none" amount={42} />;

export const FormattingOptions = () => (
  <NumberLabel precision={2} amount={2500_00} dropZeros />
);
