import { colors } from "@cyber/theme/colors";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { styled } from "styled-components";
import { SeparatorDecorator } from "../SeparatorLayout.js";
import { FileInput } from "./FileInput.js";
import { TextCell } from "./TextCell.js";

export default {
  component: FileInput,
  decorators: [SeparatorDecorator, CyberAppDecorator({ width: "wide" })],
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
