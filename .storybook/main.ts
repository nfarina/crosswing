import { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default {
  stories: ["../packages/*/src/**/__stories__/**/*.stories.@(js|jsx|ts|tsx)"],
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
  async viteFinal(config, options) {
    return mergeConfig(config, {
      // Add the svgr plugin since our code expects svg to be loaded as React
      // components.
      plugins: [svgr({ exportAsDefault: true })],
    });
  },
} satisfies StorybookConfig;
