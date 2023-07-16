import { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: ["../packages/*/src/**/*.stories.@(js|jsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
} satisfies StorybookConfig;
