import { formatOklch, parseHex, parseOklch } from "./oklch.js";

// Check if this browser supports the `color()` function, specifically with
// the `display-p3` color space.
export const SUPPORTS_P3_COLOR =
  typeof CSS !== "undefined" &&
  CSS.supports("color: color(display-p3 1 1 1)") &&
  browserHasKnownP3Support();

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
   * Adjusts the lightness of the color by the given multiplier. So 0.1 will
   * lighten by 10%, and -0.1 will darken by 10%. The lightness component of a
   * color is in the range of [0...1].
   */
  lighten?: number;
  /** For better semantics, same as lighten() with a flipped sign. */
  darken?: number;
  /**
   * Adjusts the hue of the color by adding the given amount. The hue component
   * of a color is in the range of [0...360]. Values outside of that range will
   * be wrapped around.
   */
  hue?: number | HexColorBuilder;
  /** Adjusts the saturation of the color by the given multiplier, so 0.2 means "20% more saturated." */
  saturate?: number;
  /** For better semantics, same as saturate() with a flipped sign. */
  desaturate?: number;
  /** Output format, either CSS to be used as a CSS color value, or raw HEX. */
  format?: "css" | "hex";
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
  {
    alpha,
    lighten,
    darken,
    hue,
    saturate,
    desaturate,
    format,
  }: HexColorOptions = {},
): string {
  // Transform it if you so wish.
  if (
    lighten != null ||
    darken != null ||
    hue != null ||
    saturate != null ||
    desaturate != null
  ) {
    // Convert to Hsl for easier manipulation.
    const lch = parseOklch(hex);

    if (lighten != null) lch.l *= 1 + lighten;
    if (darken != null) lch.l *= 1 - darken;
    if (hue != null) {
      if (typeof hue === "number") {
        lch.h = (lch.h + hue) % 360;
      } else {
        const otherLch = parseOklch(hue.hex);
        lch.h = otherLch.h;
      }
    }
    if (saturate != null) lch.c *= 1 + saturate;
    if (desaturate != null) lch.c *= 1 - desaturate;

    hex = formatOklch(lch);
  }

  if (format === "hex") {
    return hex;
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
  var: string;
  light: string | ColorBuilder;
  dark: string | ColorBuilder | null;
  override({
    light,
    dark,
  }: {
    light: ColorBuilder;
    dark?: ColorBuilder | null;
  }): VarColorBuilder;
};

export function varColor({
  var: cssVar,
  light,
  dark,
  static: staticOnly,
}: {
  var: string;
  light: string | ColorBuilder;
  dark?: string | ColorBuilder | null;
  static?: boolean;
}): VarColorBuilder {
  const builder: VarColorBuilder = (options: VarColorOptions = {}) =>
    staticOnly ? `var(${cssVar})` : buildVarColor(cssVar, options);
  builder.type = "var";
  builder.var = cssVar;
  builder.light = light;
  builder.dark = dark ?? null;
  builder.override = ({ light, dark }) => {
    return varColor({ var: cssVar, light, dark, static: staticOnly });
  };
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

//
// Tools for outputting CSS based on "var" colors.
//

export function getBuilderVarCss(builders: ColorBuilder[]): string {
  let css = "";
  let darkCss = "";

  function renderBuilder(builder: ColorBuilder | string): string {
    if (typeof builder === "string") {
      return builder;
    } else if (builder.type === "hex") {
      return SUPPORTS_P3_COLOR ? builder.rgb : builder.hex;
    } else {
      return builder();
    }
  }

  for (const builder of builders) {
    if (builder.type === "var") {
      const rendered = renderBuilder(builder.light);
      css += `${builder.var}: ${rendered};\n`;

      if (builder.dark) {
        const rendered = renderBuilder(builder.dark);
        darkCss += `${builder.var}: ${rendered};\n`;
      }
    }
  }

  return `
    ${css}

    @media (prefers-color-scheme: dark) {
      ${darkCss}
    }
  `.trim();
}

/**
 * Returns true if we know for sure this browser supports P3 colors in all
 * places.
 *
 * For instance, if are running on an iOS version less than v16 (we haven't
 * tested versions between 13–16) we can't use P3 colors because of a
 * bug in <input type="text">.
 */
function browserHasKnownP3Support(): boolean {
  if (typeof navigator === "undefined") return false;

  // Test strings for Android/Chrome like:
  //   Navigator: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36
  // Look for the Chrome/x.x.x.x part.
  const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
  if (chromeMatch) {
    // We've validated it works on Chrome 114.x.
    const version = parseInt(chromeMatch[1], 10);
    return version >= 114;
  }

  // Test strings for Apple webkit (iPhone, iPad, macOS) like:
  //   5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1
  // Look for the Safari/x.x.x.x part.
  const safariMatch = navigator.userAgent.match(/Safari\/(\d+)/);
  if (safariMatch) {
    // We've validated it works on Safari 604.x.
    const version = parseInt(safariMatch[1], 10);
    return version >= 604;
  }

  return false;
}
