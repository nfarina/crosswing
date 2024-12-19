import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Actually import this becasue babel-plugin-styled-components wants it as a
// peer dep but `check-imports` complains if it's not actually imported.
import "styled-components";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"],
          ["babel-plugin-styled-components", { fileName: false }],
        ],
      },
    }),
  ],
  build: {
    // Don't minify the output; it doesn't increase performance, make debugging
    // harder, and breaks image-blob-reduce in particular.
    minify: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: "transform",
    },
  },
  // Don't clear the screen when logging certain things; it makes the
  // manager server harder to read (since multiple Vite servers can be running).
  clearScreen: false,
  // Vitest configuration.
  test: {
    coverage: {
      reporter: ["html"],
      reportsDirectory: "./.coverage",
    },
    // Place snapshots right next to the test files (since VSCode Explorer
    // will group them together).
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
    // Don't run tests in `submodules`, since they are linked into `packages`.
    exclude: ["node_modules/**", "submodules/**"],
  },
});
