import React from "react";
import { createGlobalStyle, styled } from "styled-components";
import { CyberColorStyle, colors } from "./colors/index.js";
import { CyberFontStyle, fonts } from "./fonts.js";

/**
 * Decorator that injects Cyber global styles into the storybook environment.
 * Accepts optional parameters controlling the rendering behavior.
 */
export function CyberAppDecorator({
  layout = "centered",
  width = undefined,
  height = undefined,
}: {
  layout?: "fullscreen" | "centered" | "mobile";
  width?: number | "wide";
  height?: number;
} = {}) {
  // "Wide" is just a convenient way to get a phone-sized width for a component.
  const resolvedWidth = width === "wide" ? 380 : width;

  // Actual decorator function.
  function CyberAppInnerDecorator(Story: () => any) {
    return (
      <>
        <CyberColorStyle />
        <CyberFontStyle />
        {layout === "centered" && <CenteredLayoutGlobalStyle />}
        {layout === "mobile" && <MobileLayoutGlobalStyle />}
        {layout === "fullscreen" && <FullScreenLayoutGlobalStyle />}
        {resolvedWidth != null && (
          <DefinedWidthGlobalStyle width={resolvedWidth} />
        )}
        {height != null && <DefinedHeightGlobalStyle height={height} />}
        <Story />
      </>
    );
  }

  return CyberAppInnerDecorator;
}

const CenteredLayoutGlobalStyle = createGlobalStyle`
  html {
    > body {
      /* We should always set a default background color; Storybook doesn't do it automatically for dark mode. */
      background: ${colors.textBackground()};

      /* Make raw text readable. */
      color: ${colors.text()};
      font: ${fonts.display({ size: 14 })};
    }
  }
`;

const MobileLayoutGlobalStyle = createGlobalStyle`
  html {
    height: 100%;

    > body {
      height: 100%;

      /* Darken the canvas a bit so the default white background contrasts. */
      background: #E5E5E5;

      @media (prefers-color-scheme: dark) {
        background: #404040;
      }

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

    /* We should always set a default background color; Storybook doesn't do it automatically for dark mode. */
    background: ${colors.textBackground()};

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
 * Renders a story within a root container that is sized with a fixed width, so
 * that children that typically expand to fill their container can be rendered
 * in a non-squished way.
 */
const DefinedWidthGlobalStyle = createGlobalStyle<{ width: number }>`
  #storybook-root {
    width: ${(p) => p.width}px;
  }
`;

const DefinedHeightGlobalStyle = createGlobalStyle<{ height: number }>`
  #storybook-root {
    height: ${(p) => p.height}px;

    /* Make the main component grow to fit our defined height. */
    display: flex;
    flex-flow: column;

    /* Rendered story itself. */
    > * {
      flex-grow: 1;
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
