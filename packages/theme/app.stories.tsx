import { Meta } from "@storybook/react";
import { CrosswingApp } from "./app";
import { ColorView } from "./colors/ColorView";
import { colors } from "./colors/colors";
import { CrosswingAppDecorator } from "./storybook";

export default {
  component: CrosswingApp,
  parameters: { layout: "centered" },
  decorators: [CrosswingAppDecorator({ layout: "centered" })],
} satisfies Meta<typeof CrosswingApp>;

export const DefaultTheme = () => (
  <ColorView name="primary" color={colors.primaryGradient} />
);

export const CustomTheme = () => (
  <CrosswingApp
    colors={{
      primaryGradient: colors.primaryGradient.override({
        light: colors.orangeGradient(),
      }),
    }}
  >
    <ColorView name="primary" color={colors.primaryGradient} />
  </CrosswingApp>
);

export const NestedThemes = () => (
  <CrosswingApp
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
      <CrosswingApp
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
      </CrosswingApp>
    </ColorView>
  </CrosswingApp>
);
