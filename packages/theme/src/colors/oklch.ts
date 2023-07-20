import {
  convertLabToLch,
  convertLchToLab,
  convertOklabToRgb,
  convertP3ToXyz65,
  convertRgbToOklab,
  convertRgbToXyz65,
  convertXyz65ToP3,
  convertXyz65ToRgb,
  modeOklch,
  modeP3,
  toGamut,
  useMode,
} from "./culori.js";

// OKLCH Color adjustments.
//
// RGB, that is, the idea of defining a color by its red, green, and blue
// components, really only makes sense for displays. In the old days, you would
// simply write the RGB values directly to the screen, and the screen would
// set the red, green, and blue pixels directly to produce the color you wanted.
//
// While RGB is great for displays, it's terrible for humans. We don't think
// of color in terms of how much red, green, and blue it has. It's much easier
// to think of a color in terms of its hue (is it red? purple?), its
// lightness, and how saturated it is compared to gray.
//
// Historically, you might have reached for HSL (hue, saturation, lightness) to
// describe a color. But HSL has its own problems. For example, it's not
// perceptually uniform, which means that if you increase the saturation of a
// color, it might look like it's changing hue. Or if you increase the
// lightness, it can get less saturated. This doesn't match our intuition about
// how color "works".
//
// For this reason, new color spaces like CIELAB and CIELCH were developed.
// Then, someone further improved them to be perceptually uniform, and called
// them OKLAB and OKLCH. Explained here:
// https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
//
// So we use OKLCH for all our color conversions. Our goal is to let designers
// (and developers!) modify colors intuitively, like "darker version of this
// reference color for a border", or "lighter version of this color for a
// background".

export type P3 = { mode: "p3"; r: number; g: number; b: number };
export type Oklch = { mode: "oklch"; l: number; c: number; h: number };

/**
 * Parses a hex string like "#abcdef" only, not like "#aaa", into its raw
 * component values (0-255).
 */
export function parseHex(
  hex: string,
): [red: number, green: number, blue: number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid color ${hex}`);
  const [_, ...components] = result;
  const [r, g, b] = components.map((c) => parseInt(c, 16));
  return [r, g, b];
}

/** Parses a hex string like "#abcdef" into an Oklch object. */
export function parseOklch(hex: string): Oklch {
  const p3 = hexToP3(hex);
  return p3ToOklch(p3);
}

// Prepare culori's converter to go from Oklch to P3 while adjusting to fit
// within the P3 gamut.
useMode(modeOklch);
useMode(modeP3);
const p3Converter = toGamut("p3", "oklch");

/** Format an Oklch object into a P3-colorspace HEX string. */
export function formatOklch(oklch: Oklch): string {
  // You may have manipulated your Oklch object in ways that are outside the
  // P3 gamut. So we adjust the chroma until it's within the P3 gamut.

  // The converter seems to return {} if the lightness is out of range, so
  // we'll do that manually.
  if (oklch.l <= 0) return "#000000";
  if (oklch.l >= 1) return "#ffffff";

  const p3 = p3Converter(oklch);
  const hex = p3ToHex(p3);

  // Also do a blind conversion to see if we ended up being out of range.
  // Disabled because it doesn't really help the developer fix the problem.
  // const p3Blind = oklchToP3(oklch);
  // const hexBlind = p3ToHex(p3Blind);
  // if (hex !== hexBlind) {
  //   console.warn(
  //     `Color conversion resulted in an out of range value. Clipped value ${hex} was returned.`,
  //   );
  // }

  return hex;
}

//
// Low level utilities.
//

/** Assumes the hex code is valid. */
function hexToP3(hex: string): P3 {
  const [r, g, b] = parseHex(hex);
  return { mode: "p3", r: r / 255, g: g / 255, b: b / 255 };
}

/** Blind conversion; can return values outside the OKLCH range. */
function p3ToOklch(p3: P3): Oklch {
  // sRGB (with possibly out-of-range values).
  const rgb = convertXyz65ToRgb(convertP3ToXyz65(p3));
  const oklab = convertRgbToOklab(rgb);
  const lch = convertLabToLch(oklab);
  return { mode: "oklch", l: lch.l, c: lch.c, h: lch.h };
}

/** Blind conversion; can return values outside the P3 range, like "red=1.2". */
function oklchToP3(oklch: Oklch): P3 {
  const oklab = convertLchToLab(oklch);
  // sRGB (with possibly out-of-range values).
  const rgb = convertOklabToRgb(oklab);
  return convertXyz65ToP3(convertRgbToXyz65(rgb));
}

/** Always results in a 7-character string like #abcdef, assuming the p3 components are in range. */
function p3ToHex(p3: P3): string {
  const { r, g, b } = p3;
  const [red, green, blue] = [r, g, b].map((c) =>
    Math.max(0, Math.min(255, Math.round(c * 255)))
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${red}${green}${blue}`;
}
