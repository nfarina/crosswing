import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  oxc: {
    plugins: {
      styledComponents: { fileName: false },
    },
  },
  // Don't clear the screen when logging certain things; it makes the
  // manager server harder to read (since multiple Vite servers can be running).
  clearScreen: false,
});
