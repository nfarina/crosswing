import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// This file is here for Storybook to pick up on.

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-styled-components", { fileName: false }]],
      },
    }),
  ],
  // Don't clear the screen when logging certain things; it makes the
  // manager server harder to read (since multiple Vite servers can be running).
  clearScreen: false,
});
