import { createGlobalStyle } from "styled-components";
import { gradientColor, hexColor, varColor } from "./builders.js";

export {
  gradientColor,
  hexColor,
  varColor as varColor,
  type ColorBuilder,
} from "./builders.js";

// Default Cyber colors.
// Isomorphic.

/** A set of neutral-toned colors used by shared components. */
const neutrals = {
  black: hexColor("#000000"),
  extraExtraExtraDarkGray: hexColor("#0A100F"),
  extraExtraDarkGray: hexColor("#161D1C"),
  extraDarkGray: hexColor("#020403"),
  darkGray: hexColor("#919998"),
  mediumGray: hexColor("#B5BFBE"),
  lightGray: hexColor("#E1E5E5"),
  extraLightGray: hexColor("#F7FAFA"),
  extraExtraLightGray: hexColor("#FEFEFE"),
  white: hexColor("#FFFFFF"),
};

/** A set of opinionated colors that work well with the neutrals above. */
const other = {
  darkGreen: hexColor("#1A4A44"),
  turquoise: hexColor("#32BBAB"),
  turquoiseGradient: gradientColor("to right", "#32BB94", "#16B4BD"),
  extraLightTurquoise: hexColor("#F5FAF9"),
  lime: hexColor("#90D98B"),
  gold: hexColor("#E0B475"),
  orange: hexColor("#FB5525"),
  orangeGradient: gradientColor("to right", "#FB6225", "#FB3025"),
  cream: hexColor("#FCF8EE"),
  pink: hexColor("#F09CAB"),
  red: hexColor("#F2584D"),
  darkBlue: hexColor("#2B7DA5"),
  mediumBlue: hexColor("#7CB8D6"),
  lightBlue: hexColor("#8ED2F4"),
  babyBlue: hexColor("#D0E9F5"),
  purple: hexColor("#5765A1"),
  extraDarkBlue: hexColor("#0c2c3c"),
  extraDarkTurquoise: hexColor("#194e48"),
};

/**
 * A set of responsive colors that auto-adjust for light/dark modes. These
 * cannot be adjusted like hexColor() can, because they are "pre-baked" into
 * the CSS for light/dark mode, but you can adjust their alpha when using them.
 */
const responsive = {
  primary: varColor("--primary-color"),
  text: varColor("--text-color"),
  textSecondary: varColor("--text-secondary-color"),
  textBackground: varColor("--text-background-color"),
  /** Suitable for panels that appear further from the viewer than the page background. */
  textBackgroundPanel: varColor("--text-background-panel-color"),
  /** Different flavor of textBackground, suitable for alternating table rows. */
  textBackgroundAlt: varColor("--text-background-alt-color"),
  controlBorder: varColor("--control-border-color"),
  /** Not a varColor because the alpha is baked in. */
  separator: varColor("--separator-color", { static: true }),
};

/** Gradients that go well with the default colors. */
const gradients = {
  primaryGradient: varColor("--primary-gradient", { static: true }),
};

export const colors = {
  ...neutrals,
  ...other,
  ...responsive,
  ...gradients,
};

export const shadows = {
  card: varColor("--card-shadow", { static: true }),
  cardSmall: varColor("--card-small-shadow", { static: true }),
  cardBorder: varColor("--card-border-shadow", { static: true }),
  /* Good for layering on top of images to give them a subtle border when they are otherwise "floating" on a page. */
  imageBorder: varColor("--image-border-shadow", { static: true }),
};

/**
 * Defines all the colors that could change depending on light or dark mode.
 * Most Cyber components try to use these so that they can automatically
 * adjust for light/dark mode, and so that you can define your own CSS color
 * style (use this as a guide) to override things like the accent color.
 */
export const CyberColorStyle = createGlobalStyle`
  html {
    --primary-color: ${other.turquoise.rgb};
    --primary-gradient: ${other.turquoiseGradient()};
    --text-color: ${other.darkGreen.rgb};
    --text-secondary-color: ${neutrals.darkGray.rgb};
    --text-background-color: ${neutrals.white.rgb};
    --text-background-panel-color: ${neutrals.extraLightGray.rgb};
    --text-background-alt-color: ${neutrals.extraLightGray.rgb};
    --control-border-color: ${neutrals.mediumGray.rgb};
    --separator-color: ${neutrals.black({ alpha: 0.1 })};
    --card-shadow: 0px 4px 12px ${other.darkGreen({ alpha: 0.2 })};
    --card-small-shadow: 0px 1px 4px ${other.darkGreen({ alpha: 0.2 })};
    --card-border-shadow: 0px 0px 0px 1px ${other.darkGreen({
      alpha: 0.07,
    })};
    --image-border-shadow: inset 0 0 0 1px ${neutrals.black({ alpha: 0.1 })};
  
    @media (prefers-color-scheme: dark) {
      --text-color: ${neutrals.extraLightGray.rgb};
      --text-secondary-color: ${neutrals.darkGray.rgb};
      --text-background-color: ${neutrals.extraExtraDarkGray.rgb};
      --text-background-panel-color: ${neutrals.extraExtraExtraDarkGray.rgb};
      --text-background-alt-color: ${neutrals.extraExtraExtraDarkGray.rgb};
      --control-border-color: ${hexColor("#828C8B").rgb};
      --separator-color: ${neutrals.white({ alpha: 0.15 })};
      --card-shadow: 0px 4px 12px ${neutrals.black()};
      --card-small-shadow: 0px 1px 4px ${neutrals.black()};
      --card-border-shadow: 0px 0px 0px 1px ${neutrals.black({ alpha: 0.2 })};
      --image-border-shadow: inset 0 0 0 1px ${neutrals.white({ alpha: 0.05 })};
    }
  }
`;
