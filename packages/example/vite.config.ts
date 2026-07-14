import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  oxc: {
    plugins: {
      styledComponents: { fileName: false },
    },
  },
  // Don't clear the screen when logging certain things; it makes the
  // manager server harder to read (since multiple Vite servers can be running).
  clearScreen: false,
});
