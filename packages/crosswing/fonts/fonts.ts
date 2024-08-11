import { useEffect } from "react";
import FiraMonoMedium from "./fira-mono/FiraMono-Medium.ttf";
import FiraMonoRegular from "./fira-mono/FiraMono-Regular.ttf";
import FiraSansBlack from "./fira-sans/FiraSans-Black.ttf";
import FiraSansBold from "./fira-sans/FiraSans-Bold.ttf";
import FiraSansMedium from "./fira-sans/FiraSans-Medium.ttf";
import FiraSansRegular from "./fira-sans/FiraSans-Regular.ttf";
import LatoBlack from "./lato/Lato-Black.ttf";
import LatoBold from "./lato/Lato-Bold.ttf";
import LatoRegular from "./lato/Lato-Regular.ttf";

// TODO: make this overridable and defined at the CrosswingApp element level; not
// the document level.

export type FontBuilders = Record<string, FontBuilder>;

export const fonts = {
  display: font({
    url: FiraSansRegular,
    family: "Fira Sans",
    weight: "400",
  }),
  displayMedium: font({
    url: FiraSansMedium,
    family: "Fira Sans",
    weight: "500",
  }),
  displayBold: font({
    url: FiraSansBold,
    family: "Fira Sans",
    weight: "600",
  }),
  displayBlack: font({
    url: FiraSansBlack,
    family: "Fira Sans",
    weight: "800",
  }),
  numeric: font({
    url: LatoRegular,
    family: "Lato",
    weight: "400",
  }),
  numericBold: font({
    url: LatoBold,
    family: "Lato",
    weight: "600",
  }),
  numericBlack: font({
    url: LatoBlack,
    family: "Lato",
    weight: "800",
  }),
  displayMono: font({
    url: FiraMonoRegular,
    family: "Fira Mono",
    weight: "400",
    monospace: true,
  }),
  displayMonoMedium: font({
    url: FiraMonoMedium,
    family: "Fira Mono",
    weight: "500",
    monospace: true,
  }),
} satisfies FontBuilders;

const installedFonts: Set<FontBuilders> = new Set();

export function useFonts(fonts: FontBuilders) {
  useEffect(() => {
    // Did some other component calling this same hook already install these
    // fonts? If so, we don't need to do it again.
    if (installedFonts.has(fonts)) return;

    // Render our fonts statically only once, to work around flickering during
    // development: https://github.com/styled-components/styled-components/issues/1593#issuecomment-409011695
    const style = document.createElement("style");
    style.innerHTML = getFontVarCSS(Object.values(fonts));
    document.head.appendChild(style);

    installedFonts.add(fonts);
  }, []);
}

/** A React component that installs Crosswing fonts automatically. */
export function CrosswingFontStyle() {
  useFonts(fonts);
  return null;
}

export interface FontOptions {
  size: number;
  line?: string;
  /** Prevents automatic font scaling. */
  fixed?: boolean;
}

export type FontBuilder = {
  (options: FontOptions): string;
  family: string;
  weight: string;
  style: string;
  monospace: boolean;
  url: string;
};

export function font({
  url,
  family,
  weight,
  style = "normal",
  monospace = false,
}: {
  url: string;
  family: string;
  weight: string;
  style?: string;
  monospace?: boolean;
}): FontBuilder {
  const builder = ({ size, line, fixed }: FontOptions) => {
    // You can define the CSS var "--font-scale" to globally scale up or
    // down fonts created with FontBuilder. This is how we handle adjusting the
    // entire UI for accessibility.
    const scaledSize = fixed
      ? `${size}px`
      : `calc(${size}px * var(--font-scale, 1))`;

    // Scale the line size if you defined it in points.
    const scaledLine =
      !fixed && (line ?? "").endsWith("px")
        ? `calc(${line} * var(--font-scale, 1))`
        : (line ?? "normal");

    return `${style} ${weight} ${scaledSize} / ${scaledLine} "${family}", sans-serif${
      monospace ? ", monospace" : ""
    }`;
  };

  builder.url = url;
  builder.family = family;
  builder.weight = weight;
  builder.style = style;
  builder.monospace = monospace;

  return builder;
}

export function getFontVarCSS(builders: FontBuilder[]) {
  let css = "";

  for (const { url, family, weight } of builders) {
    css += `
      @font-face {
        font-family: '${family}';
        src: url('${url}') format('truetype');
        font-weight: ${weight};
      }
    `;
  }

  return css;
}
