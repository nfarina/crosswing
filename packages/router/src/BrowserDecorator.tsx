import React from "react";
import { BrowserSimulator } from "./BrowserSimulator.js";

// Useful for hosting Storybook components designed to be presented
// in a mobile-app setting, with a working AppRouter parent and address bar.
export const BrowserDecorator = (Story: () => any) => (
  <BrowserSimulator children={<Story />} />
);
