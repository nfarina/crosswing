import { gradientColor, hexColor, varColor } from "./builders";

export * from "./builders";

export {
  gradientColor,
  hexColor,
  varColor,
  type ColorBuilder,
} from "./builders";

// Default Cyber colors.
// Isomorphic.

/** A set of neutral-toned colors used by shared components. */
const neutrals = {
  black: hexColor("#000000"),
  extraExtraExtraDarkGray: hexColor("#020403"),
  extraExtraDarkGray: hexColor("#0A100F"),
  extraDarkGray: hexColor("#161D1C"),
  darkerGray: hexColor("#828C8B"),
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
  blueGradient: gradientColor("to right", "#2B86A5", "#2671A7"),
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
  primary: varColor({ light: other.orange.rgb, var: "--primary-color" }),
  text: varColor({
    light: other.darkGreen.rgb,
    dark: neutrals.extraLightGray.rgb,
    var: "--text-color",
  }),
  textSecondary: varColor({
    light: neutrals.darkGray.rgb,
    dark: neutrals.darkGray.rgb,
    var: "--text-secondary-color",
  }),
  textBackground: varColor({
    light: neutrals.white.rgb,
    dark: neutrals.extraDarkGray.rgb,
    var: "--text-background-color",
  }),
  /** Suitable for panels that appear further from the viewer than the page background. */
  textBackgroundPanel: varColor({
    light: neutrals.extraLightGray.rgb,
    dark: neutrals.extraExtraDarkGray.rgb,
    var: "--text-background-panel-color",
  }),
  /** Different flavor of textBackground, suitable for alternating table rows. */
  textBackgroundAlt: varColor({
    light: neutrals.extraLightGray.rgb,
    dark: neutrals.extraExtraDarkGray.rgb,
    var: "--text-background-alt-color",
  }),
  /** Suitable for borders around controls, like <ButtonGroup>. */
  controlBorder: varColor({
    light: neutrals.mediumGray.rgb,
    dark: neutrals.darkerGray.rgb,
    var: "--control-border-color",
  }),
  /** Static because the alpha is baked in. */
  separator: varColor({
    light: neutrals.black({ alpha: 0.1 }),
    dark: neutrals.white({ alpha: 0.15 }),
    var: "--separator-color",
    static: true,
  }),
};

/** Gradients that go well with the default colors. */
const gradients = {
  primaryGradient: varColor({
    light: other.orangeGradient(),
    var: "--primary-gradient",
    static: true,
  }),
};

export const colors = {
  ...neutrals,
  ...other,
  ...responsive,
  ...gradients,
};

export const shadows = {
  card: varColor({
    light: `0px 4px 12px ${other.darkGreen({ alpha: 0.2 })}`,
    dark: `0px 4px 12px ${neutrals.black()}`,
    var: "--card-shadow",
    static: true,
  }),
  cardSmall: varColor({
    light: `0px 1px 4px ${other.darkGreen({ alpha: 0.2 })}`,
    dark: `0px 1px 4px ${neutrals.black()}`,
    var: "--card-small-shadow",
    static: true,
  }),
  cardBorder: varColor({
    light: `0px 0px 0px 1px ${other.darkGreen({ alpha: 0.07 })}`,
    dark: `0px 0px 0px 1px ${neutrals.black({ alpha: 0.2 })}`,
    var: "--card-border-shadow",
    static: true,
  }),
  /* Good for layering on top of images to give them a subtle border when they are otherwise "floating" on a page. */
  imageBorder: varColor({
    light: `inset 0 0 0 1px ${neutrals.black({ alpha: 0.1 })}`,
    dark: `inset 0 0 0 1px ${neutrals.white({ alpha: 0.05 })}`,
    var: "--image-border-shadow",
    static: true,
  }),
};
