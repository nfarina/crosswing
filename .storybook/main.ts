import { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: ["../packages/*/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: { strictMode: true },
  },
  docs: {
    autodocs: "tag",
  },
} satisfies StorybookConfig;
