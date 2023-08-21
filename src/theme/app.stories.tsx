import { Meta } from "@storybook/react";
import React from "react";
import { CyberApp } from "./app";
import { ColorView } from "./colors/ColorView";
import { colors } from "./colors/colors";
import { CyberAppDecorator } from "./storybook";

export default {
  component: CyberApp,
  parameters: { layout: "centered" },
  decorators: [CyberAppDecorator({ layout: "centered" })],
} satisfies Meta<typeof CyberApp>;

export const DefaultTheme = () => (
  <ColorView name="primary" color={colors.primaryGradient} />
);

export const CustomTheme = () => (
  <CyberApp
    colors={{
      primaryGradient: colors.primaryGradient.override({
        light: colors.orangeGradient(),
      }),
    }}
  >
    <ColorView name="primary" color={colors.primaryGradient} />
  </CyberApp>
);

export const NestedThemes = () => (
  <CyberApp
    colors={{
      primaryGradient: colors.primaryGradient.override({
        light: colors.purple(),
      }),
    }}
  >
    <ColorView
      name="primary"
      style={{ width: "80px", height: "80px" }}
      color={colors.primaryGradient}
    >
      <CyberApp
        transparent
        colors={{
          primaryGradient: colors.primaryGradient.override({
            light: colors.gold(),
          }),
        }}
      >
        <ColorView
          name="primary"
          style={{ width: "30px", height: "30px" }}
          color={colors.primaryGradient}
        />
      </CyberApp>
    </ColorView>
  </CyberApp>
);
