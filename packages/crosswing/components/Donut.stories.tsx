import { Meta } from "@storybook/react";
import { colors } from "../theme/colors/colors";
import { CrosswingAppDecorator } from "../theme/storybook";
import { Donut } from "./Donut";

export default {
  component: Donut,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Donut>;

export const OneSection = () => (
  <Donut size="50px" sections={[{ amount: 1, color: colors.purple }]} />
);

export const TwoSections = () => (
  <Donut
    size="50px"
    sections={[
      { amount: 0.35, color: colors.purple },
      { amount: 0.65, color: colors.mediumBlue },
    ]}
  />
);

export const ThreeSections = () => (
  <Donut
    size="50px"
    sections={[
      { amount: 0.35, color: colors.purple },
      { amount: 0.65, color: colors.mediumBlue },
      { amount: 0.65, color: colors.red },
    ]}
  />
);
