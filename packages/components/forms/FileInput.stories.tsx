import { colors } from "@crosswing/theme/colors";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import { styled } from "styled-components";
import { SeparatorDecorator } from "../SeparatorLayout";
import { FileInput } from "./FileInput";
import { TextCell } from "./TextCell";

export default {
  component: FileInput,
  decorators: [SeparatorDecorator, CrosswingAppDecorator({ width: "wide" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof FileInput>;

type Story = StoryFn<typeof FileInput>;

export const Default: Story = () => (
  <StyledFileInput onFileSelect={(file) => action("onFileSelect")(file.name)}>
    <TextCell title="Click to Upload" subtitle="Drag & Drop Supported" />
  </StyledFileInput>
);

// Customize FileInput to change background color on hover.
const StyledFileInput = styled(FileInput)`
  &[data-dragging-over="true"] {
    background: ${colors.textBackgroundAlt()};
  }
`;
