// @chatwing
import { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";

export default {
  stories: ["../packages/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: { strictMode: true },
  },
  // typescript: {
  //   // https://storybook.js.org/blog/optimize-storybook-7-6/ (not working for useInfiniteFirestoreQuery.stories.ts)
  //   reactDocgen: false, // "react-docgen", // or false if you don't need docgen at all
  // },
  // Apply some custom Vite configuration - notably, our codebase requires
  // react-compiler or else our modal system will go into infinite render loops.
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [reactClickToComponent()],
    });
  },
} satisfies StorybookConfig;
