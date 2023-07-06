import { createGlobalStyle } from "styled-components";

// Default Cyber colors.
// Isomorphic.

// TODO: convert to oklch() with polyfills.
// https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl

// https://webkit.org/blog/6682/improving-color-on-the-web/
const SUPPORTS_P3_COLOR =
  typeof CSS !== "undefined" && CSS.supports("color: color(display-p3 1 1 1)");

/** A set of neutral-toned colors used by shared components. */
const neutrals = {
  black: hexColor("#000000"),
  white: hexColor("#FFFFFF"),
  darkGray: hexColor("#919998"),
  mediumGray: hexColor("#B5BFBE"),
  lightGray: hexColor("#E1E5E5"),
  extraLightGray: hexColor("#F7FAFA"),
  extraDarkGray: hexColor("#020403"),
  extraExtraLightGray: hexColor("#FEFEFE"),
  extraExtraDarkGray: hexColor("#161D1C"),
  extraExtraExtraDarkGray: hexColor("#0A100F"),
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

/** A set of dynamic colors that auto-adjust for light/dark modes. */
const dynamic = {
  primary: varColor("--primary-color"),
  text: varColor("--text-color"),
  textSecondary: varColor("--text-secondary-color"),
  textBackground: varColor("--text-background-color"),
  /** Suitable for panels that appear further from the viewer than the page background. */
  textBackgroundPanel: varColor("--text-background-panel-color"),
  /** Different flavor of textBackground, suitable for alternating table rows. */
  textBackgroundAlt: varColor("--text-background-alt-color"),
  controlBorder: varColor("--control-border-color"),
  separator: () => `var(--separator-color)`,
};

/** Gradients that go well with the default colors. */
const gradients = {
  primaryGradient: () => `var(--primary-gradient)`,
};

export const colors = {
  ...neutrals,
  ...other,
  ...dynamic,
  ...gradients,
};

export const shadows = {
  card: () => `var(--card-shadow)`,
  cardSmall: () => `var(--card-small-shadow)`,
  cardBorder: () => `var(--card-border-shadow)`,
  /* Good for layering on top of images to give them a subtle border when they are otherwise "floating" on a page. */
  imageBorder: () => `var(--image-border-shadow)`,
};

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

export type ColorBuilder = HexColorBuilder | VarColorBuilder;

//
// Tools for working with colors based on a hex code.
//

export type HexColorBuilder = {
  (options?: HexColorOptions): string;
  /** The original hex string that the builder is based on. */
  hex: string;
  /** The RGB components - suitable for rgba() or color() depending on SUPPORTS_P3_COLOR. */
  rgb: string;
};

export interface HexColorOptions {
  alpha?: number;
  lighten?: number;
  darken?: number;
}

export function hexColor(hex: string): HexColorBuilder {
  const builder = (options: HexColorOptions = {}) =>
    buildHexColor(hex, options);
  builder.hex = hex; // Store the original hex color string passed in for reuse.
  builder.rgb = SUPPORTS_P3_COLOR ? hexToColor(hex) : hexToRgba(hex);
  return builder;
}

// Temporary hack until we convert to OKLCH.
export function lightenHexColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;

  const lightened =
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255);

  return "#" + lightened.toString(16).toUpperCase().slice(1);
}

/**
 * Utility function that builds a CSS color() or rgba() string based on a hex
 * code, with optional transformations.
 */
export function buildHexColor(
  hex: string,
  { alpha, lighten, darken }: HexColorOptions = {},
): string {
  // Transform it if you so wish.
  if (lighten != null || darken != null) {
    if (lighten != null) hex = lightenHexColor(hex, lighten);
    if (darken != null) hex = lightenHexColor(hex, -darken);
  }

  if (SUPPORTS_P3_COLOR) {
    const rgb = hexToColor(hex);
    return `color(display-p3 ${rgb} / ${alpha ?? 1})`;
  } else {
    const rgb = hexToRgba(hex);
    return `rgba(${rgb}, ${alpha ?? 1})`;
  }
}

function hexToRgb(hex: string): [red: number, green: number, blue: number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid color ${hex}`);
  const [_, ...components] = result;
  const [r, g, b] = components.map((c) => parseInt(c, 16));
  return [r, g, b];
}

/** Returns a string suitable for embedding in the color() function. */
function hexToColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `calc(${r} / 255) calc(${g} / 255) calc(${b} / 255)`;
}

/** Returns a string suitable for emebdding in the rgba() function. */
function hexToRgba(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

//
// Tools for working with colors based on a CSS variable. Var colors are mostly
// "baked" but can be transformed with alpha.
//

export interface VarColorOptions {
  alpha?: number;
}

export type VarColorBuilder = (options?: VarColorOptions) => string;

export function varColor(cssVar: string): VarColorBuilder {
  return (options: VarColorOptions = {}) => buildVarColor(cssVar, options);
}

export function buildVarColor(
  cssVar: string,
  { alpha }: VarColorOptions = {},
): string {
  if (SUPPORTS_P3_COLOR) {
    return `color(display-p3 var(${cssVar}) / ${alpha ?? 1})`;
  } else {
    return `rgba(var(${cssVar}), ${alpha ?? 1})`;
  }
}

//
// Tools for working with CSS linear gradients.
//

export interface GradientOptions {}

export type GradientBuilder = (options?: GradientOptions) => string;

export function gradientColor(
  direction: string,
  ...hexStops: string[]
): GradientBuilder {
  return (options: GradientOptions = {}) => {
    const stops = hexStops.map((stop) => buildHexColor(stop, options));
    return `linear-gradient(${direction}, ${stops.join(", ")})`;
  };
}
