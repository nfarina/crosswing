import React from "react";
import { createGlobalStyle, styled } from "styled-components";
import { CyberColorStyle, colors } from "./colors.js";
import { CyberFontStyle } from "./fonts.js";

/**
 * Decorator that injects Cyber global styles into the storybook environment.
 * Accepts optional parameters controlling the rendering behavior.
 */
export function CyberAppDecorator({
  layout = "centered",
}: {
  layout?: "fullscreen" | "centered" | "mobile";
} = {}) {
  // Actual decorator function.
  function CyberAppInnerDecorator(Story: () => any) {
    return (
      <>
        <CyberColorStyle />
        <CyberFontStyle />
        <CyberStorybookStyle />
        {layout === "centered" && <CenteredLayoutGlobalStyle />}
        {layout === "mobile" && <MobileLayoutGlobalStyle />}
        {layout === "fullscreen" && <FullScreenLayoutGlobalStyle />}
        <Story />
      </>
    );
  }

  return CyberAppInnerDecorator;
}

const CyberStorybookStyle = createGlobalStyle`
  html {
    > body {
      /* A white background is typical for our stories, so we'll set the canvas background to a darker color. */
      background: #E5E5E5;

      /* Pick a nice default background for dark mode as well. */
      @media (prefers-color-scheme: dark) {
        background: #333;
      }
    }
  }
`;

const CenteredLayoutGlobalStyle = createGlobalStyle``;

const MobileLayoutGlobalStyle = createGlobalStyle`
  html {
    height: 100%;

    > body {
      height: 100%;

      > #storybook-root {
        /* Approximate the visible content area of an iPhone 12 Pro. */
        width: 390px;
        height: 715px;
        overflow: auto;

        /* Make the height shrink down to the viewport. Typically I'm developing with Chrome DevTools open and don't have a lot of height to work with. */
        max-height: 100%;
        display: flex;
        flex-flow: column;

        /* Override Storybook's "centered" layout padding to get more space on my small MacBook Air screen. */
        padding: 0 !important;

        /* Make the mobile frame stand out from the default Storybook background. */
        background: ${colors.textBackground()};

        /* Rendered story itself. */
        > * {
          flex-grow: 1;
        }
      }
    }
  }
`;

const FullScreenLayoutGlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100%;

    > #storybook-root {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;

      /* Rendered story itself. */
      > * {
        flex-grow: 1;
      }
    }
  }
`;

/**
 * A convenience decorator that centers your story inside a container with
 * some optional padding. Designed to be used with
 * CyberAppDecorator({layout: "mobile"}).
 */
export function MobileComponentDecorator({
  padding = 0,
}: { padding?: string | number } = {}) {
  return (Story: () => any) => (
    <MobileComponentContainer style={{ padding }} children={<Story />} />
  );
}

const MobileComponentContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  box-sizing: border-box;
`;
