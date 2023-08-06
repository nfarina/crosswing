import { Meta } from "@storybook/react";
import React from "react";
import { CyberApp } from "./app.js";
import { ColorView } from "./colors/ColorView.js";
import { colors } from "./colors/colors.js";
import { CyberAppDecorator } from "./storybook.js";

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
