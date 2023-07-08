import { formatOklch, parseHex, parseOklch } from "./util.js";

// Check if this browser supports the `color()` function, specifically with
// the `display-p3` color space.
const SUPPORTS_P3_COLOR =
  typeof CSS !== "undefined" && CSS.supports("color: color(display-p3 1 1 1)");

export type ColorBuilder = HexColorBuilder | VarColorBuilder | GradientBuilder;

//
// Tools for working with colors based on a hex code.
//

export type HexColorBuilder = {
  (options?: HexColorOptions): string;
  type: "hex";
  /** The original hex string that the builder is based on. */
  hex: string;
  /** The raw RGB components, for reusing a defined color in a CSS var. Suitable for rgba() or color() depending on SUPPORTS_P3_COLOR. */
  rgb: string;
};

export interface HexColorOptions {
  /**
   * Apply the given alpha component to the rendered color.
   * Values are absolute from [0...1].
   */
  alpha?: number;
  /**
   * If a number is given, it will adjust the lightness of the color by that
   * percentage. So 0.1 will lighten by 10%, and -0.1 will darken by 10%. The
   * lightness component of a color is in the range of [0...1].
   *
   * If a HexColorBuilder is given, the lightness component of the rendered
   * color will be replaced with the lightness of the given color.
   */
  lighten?: number | HexColorBuilder;
  /** For better semantics, same as lighten() with a flipped sign. */
  darken?: number | HexColorBuilder;
  /**
   * If a number is given, it will adjust the hue of the color by that
   * amount. The hue component of a color is in the range of [0...360].
   * Values outside of that range will be wrapped around.
   *
   * If a HexColorBuilder is given, the hue component of the rendered
   * color will be replaced with the hue of the given color.
   */
  hue?: number | HexColorBuilder;
  /**
   * If a number is given, it will adjust the saturation of the color by that
   * amount. The saturation component of a color is, in theory, in the range
   * of [0...∞], but in our system (OKLCH) the maximum value depends on the
   * hue component! This is the essential nature of a limited color space.
   * For both P3, the value will be always below 0.37.
   *
   * If a HexColorBuilder is given, the saturation component of the rendered
   * color will be replaced with the saturation of the given color.
   *
   * The final rendered maximum value will be clamped to the maximum amount
   * possible for the given hue.
   */
  saturation?: number; // | HexColorBuilder;
}

/**
 * Creates a new HexColorBuilder around the given hex code, assumed to be in
 * P3 color space.
 */
export function hexColor(hex: string): HexColorBuilder {
  const builder: HexColorBuilder = (options: HexColorOptions = {}) =>
    buildHexColor(hex, options);

  builder.type = "hex";

  // Store the original hex color string passed in for reuse.
  builder.hex = hex;

  // Store the rendered CSS var for easier reuse in other colors.
  builder.rgb = SUPPORTS_P3_COLOR ? hexToColor(hex) : hexToRgba(hex);

  return builder;
}

/**
 * Utility function that builds a CSS color() or rgba() string based on a hex
 * code, with optional transformations.
 */
export function buildHexColor(
  hex: string,
  { alpha, lighten, darken, hue, saturation }: HexColorOptions = {},
): string {
  // Transform it if you so wish.
  if (lighten != null || darken != null || hue != null || saturation != null) {
    // Convert to Oklch for easier manipulation.
    const oklch = parseOklch(hex);

    if (lighten != null) {
      if (typeof lighten === "number") {
        oklch.l *= 1 + lighten;
      } else {
        oklch.l = parseOklch(lighten.hex).l;
      }
    }

    if (darken != null) {
      if (typeof darken === "number") {
        oklch.l *= 1 - darken;
      } else {
        oklch.l = parseOklch(darken.hex).l;
      }
    }

    if (hue != null) {
      if (typeof hue === "number") {
        oklch.h = (oklch.h + hue) % 360;
      } else {
        oklch.h = parseOklch(hue.hex).h;
      }
    }

    if (saturation != null) {
      if (typeof saturation === "number") {
        oklch.c *= 1 + saturation;
      } else {
        // oklch.c = parseOklch(saturation.hex).c;
      }
    }

    hex = formatOklch(oklch);
  }

  if (SUPPORTS_P3_COLOR) {
    const rgb = hexToColor(hex);
    return `color(display-p3 ${rgb} / ${alpha ?? 1})`;
  } else {
    const rgb = hexToRgba(hex);
    return `rgba(${rgb}, ${alpha ?? 1})`;
  }
}

/** Returns a string suitable for embedding in the color() function. */
function hexToColor(hex: string): string {
  const [r, g, b] = parseHex(hex);
  // Convert each component to [0...1] range with max 4 decimal places.
  const r1 = (r / 255).toFixed(4);
  const g1 = (g / 255).toFixed(4);
  const b1 = (b / 255).toFixed(4);
  return `${r1} ${g1} ${b1}`;
}

/** Returns a string suitable for emebdding in the rgba() function. */
function hexToRgba(hex: string): string {
  const [r, g, b] = parseHex(hex);
  return `${r}, ${g}, ${b}`;
}

//
// Tools for working with colors based CSS variables.
// These colors are mostly "baked" but can be transformed with alpha.
//

export interface VarColorOptions {
  alpha?: number;
}

export type VarColorBuilder = {
  (options?: VarColorOptions): string;
  type: "var";
};

export function varColor(
  cssVar: string,
  { static: staticOnly }: { static?: boolean } = {},
): VarColorBuilder {
  const builder: VarColorBuilder = (options: VarColorOptions = {}) =>
    staticOnly ? `var(${cssVar})` : buildVarColor(cssVar, options);
  builder.type = "var";
  return builder;
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

// You can apply the same HexColorOptions to all stops of a gradient.
export type GradientOptions = HexColorOptions;

export type GradientBuilder = {
  (options?: GradientOptions): string;
  type: "gradient";
};

export function gradientColor(
  direction: string,
  ...hexStops: string[]
): GradientBuilder {
  const builder: GradientBuilder = (options: GradientOptions = {}) => {
    const stops = hexStops.map((stop) => buildHexColor(stop, options));
    return `linear-gradient(${direction}, ${stops.join(", ")})`;
  };
  builder.type = "gradient";
  return builder;
}
