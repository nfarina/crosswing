import { createGlobalStyle } from "@cyber/css";
import React from "react";
import { CyberApp } from "./app.js";
import { colors } from "./colors.js";

/**
 * Decorator that injects Cyber global styles into the storybook environment.
 * Accepts optional parameters controlling the rendering behavior.
 */
export function CyberAppDecorator() {
  // Actual decorator function.
  function CyberAppInnerDecorator(Story: () => any) {
    return (
      <CyberApp>
        <CenteredLayoutGlobalStyle />
        <Story />
      </CyberApp>
    );
  }

  return CyberAppInnerDecorator;
}

const CenteredLayoutGlobalStyle = createGlobalStyle`
  html {
    background: ${colors.textBackground()};
  }
`;
