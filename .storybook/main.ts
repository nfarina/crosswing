import { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: { strictMode: true },
  },
  docs: {
    autodocs: "tag",
  },
} satisfies StorybookConfig;
