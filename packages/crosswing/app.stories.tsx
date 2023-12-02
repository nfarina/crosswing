import { Meta } from "@storybook/react";
import { CrosswingApp } from "./app.js";
import { ColorView } from "./colors/ColorView.js";
import { colors, hexColor } from "./colors/colors.js";
import { CrosswingAppDecorator } from "./storybook.js";

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
    colors={[colors.primaryGradient.override(colors.orangeGradient)]}
  >
    <ColorView name="primary" color={colors.primaryGradient} />
  </CrosswingApp>
);

export const NestedThemes = () => (
  <CrosswingApp colors={[colors.primary.override(colors.darkGreen)]}>
    <ColorView
      name="primary"
      style={{ width: "80px", height: "80px" }}
      color={colors.primary}
    >
      <CrosswingApp
        transparent
        colors={[colors.primary.override(hexColor("#ff0000"))]}
      >
        <ColorView
          name="primary"
          style={{ width: "30px", height: "30px" }}
          color={colors.primary}
        />
      </CrosswingApp>
    </ColorView>
  </CrosswingApp>
);

export const DecoratorTheme = () => (
  <ColorView name="primary" color={colors.primaryGradient} />
);

DecoratorTheme.decorators = [
  CrosswingAppDecorator({
    colors: [colors.primaryGradient.override(colors.blueGradient)],
  }),
];
