import { StorybookConfig } from "@storybook/react-vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get all directory names in ../packages.
const filename = fileURLToPath(import.meta.url);
const packagesDir = path.join(filename, "..", "..", "packages");
const packageNames = fs
  .readdirSync(packagesDir)
  .filter((name) => !name.startsWith("."))
  // We need to filter these out or else Storybook will print a bunch of
  // warnings on startup.
  .filter((name) => directoryHasStories(path.join(packagesDir, name, "src")));

export default {
  // We'd prefer to just say:
  //
  //   stories: ["../packages/*/src/**/*.stories.@(ts|tsx)"],
  //
  // But then, Storybook's auto-titles would put "src/" in the title, which
  // we don't want. So we have to do this instead:
  stories: packageNames.map((name) => ({
    directory: `../packages/${name}/src`,
    files: "**/*.stories.tsx",
    titlePrefix: `${name}/`,
  })),
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

// Do a recursive search through the given directory for any files with
// ".stories" in their name.
function directoryHasStories(directory: string): boolean {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (file.endsWith(".stories.tsx")) {
      return true;
    } else if (fs.statSync(filePath).isDirectory()) {
      if (directoryHasStories(filePath)) {
        return true;
      }
    }
  }

  return false;
}
