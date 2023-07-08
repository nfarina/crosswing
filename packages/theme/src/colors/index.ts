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

// Color spaces can be brain-melting. We are making a few assumptions for Cyber
// that attempt to help designers and developers fall into the pit of success.
//
// Color spaces are all about defining what colors - perceptually, to your
// eye - are possible on a given display. It's always a subset of what your eyes
// can actually see.
//
// Different displays support different color spaces. For example, a newer
// display (like all Apple devices) supports the P3 color space. If you told
// that display, for instance using a native application, to render a "pure red"
// color, and put it next to an older CRT monitor from the 90s that you also
// told to render "pure red", the new display would look WAY MORE RED than the
// older display. This is because the newer display has better hardware, and
// P3 is a way of describing what newer hardware is capable of.
//
// So now there's a problem - if you are designing a website, and say your
// page background is #FF0000, exactly how red - to your eye - should that be?
// People fretted a lot about this in the early days of the web - they wanted
// to make sure that #FF0000 looked the same on both displays. So they created
// the sRGB color space, which is a way of limiting the possible colors you can
// get. It's like a "lowest common denominator" color space. So by default,
// if you write `background: #FF0000` in CSS, you will get a red that looks
// the same on both displays - that is, a duller red that the 90s CRT can
// reproduce.
//
// This bothered me for a very long time, because I always had a newer display.
// I'd pick a vibrant color in Photoshop, then get the HEX code and put it in
// my CSS, and it would look dull and lifeless. Why "protect" my users from
// beautiful color on monitors that supported it?
//
// It took me a long time to consider the other scenario - when a designer is
// using (or used long ago) an older monitor to pick colors. They might pick
// #FF0000 and use it as a page background, and it looks fine to them, but
// if I load that page on my newer monitor, without sRGB "protecting" me, it
// would be eye-bleeding, way too bright! Because my "maximum red" is much
// redder than the original designer's "maximum red".
//
// This doesn't happen in practice, because all browsers assume that #FF0000
// should be interpreted as an sRGB color. sRGB describes what #FF0000 should
// actually *look like*, and does NOT mean "All red pixels at 100% brightness".
//
// As a result, the web is full of dull, lifeless colors.
//
// Fast-forward like 20 years.
//
// When designing UI in Figma, the most popular design tool, you are typically
// picking from a set of all the colors your monitor can display. Just like
// Photoshop in the 90s! These days, we all have newer monitors, so we are
// picking from a set of colors that is much larger than sRGB, usually P3.
//
// And it's still like Groundhog Day - you pick a beautiful color in Figma,
// give the HEX code to a developer, and it looks dull and lifeless in the
// browser. Then you Google around and find huge walls of text about color
// theory and color spaces and give up.
//
// The core problem here is that HEX codes, to a browser, are *always* sRGB.
// Always always always. There is no way to use a HEX code in CSS without it
// being interpreted as sRGB. Same with the rgba() function, hsl(), etc.
//
// But Figma, and most design tools, are *not* respecting this. They default
// to an "unmanaged" color space, where #FF0000 really does mean "all the red
// your monitor can give".
//
// You could of course tell Figma (and most design tools) to render colors using
// the "sRGB" managed color space, such that #FF0000 renders that "safe", dull
// red just like the browser, but most people don't bother - or more likely,
// have no idea what it all means and just want all the colors they can get.
//
// In Cyber, we assume, unlike the browser, that hex codes are in the P3 color
// space. Our goal is to get your colors to show up in the browser the same way
// they do in Figma "unmanaged" mode.
//
// Fortunately, most recent browsers now support the `color()` function, which
// lets you specify a color in a different color space. So we can use that to
// get the browser to render the color the same way Figma does.
//
// Here's a great article (from 2016!) that goes into more detail about this:
// https://webkit.org/blog/6682/improving-color-on-the-web/
//
// Our goal with this library is to make it so when you give us "#FF0000" from
// Figma, we give you a CSS color like `color(display-p3 1 0 0)`. Specifically,
// the `hexColor()` builder assumes you mean P3 by default, and will render
// it that way if both your browser and monitor supports it. And if it doesn't?
// you'll see a not-so-bright red, and that's fine!

//
// Default Cyber Colors
//

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
