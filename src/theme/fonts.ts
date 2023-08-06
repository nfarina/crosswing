import { useEffect } from "react";
import FiraMonoMedium from "../../fonts/fira-mono/FiraMono-Medium.ttf";
import FiraMonoRegular from "../../fonts/fira-mono/FiraMono-Regular.ttf";
import FiraSansBlack from "../../fonts/fira-sans/FiraSans-Black.ttf";
import FiraSansBold from "../../fonts/fira-sans/FiraSans-Bold.ttf";
import FiraSansMedium from "../../fonts/fira-sans/FiraSans-Medium.ttf";
import FiraSansRegular from "../../fonts/fira-sans/FiraSans-Regular.ttf";
import LatoBlack from "../../fonts/lato/Lato-Black.ttf";
import LatoBold from "../../fonts/lato/Lato-Bold.ttf";
import LatoRegular from "../../fonts/lato/Lato-Regular.ttf";

// TODO: make this overridable and defined at the CyberApp element level; not
// the document level.

export const fonts = {
  display: fontBuilder({
    url: FiraSansRegular,
    family: "Fira Sans",
    weight: "400",
  }),
  displayMedium: fontBuilder({
    url: FiraSansMedium,
    family: "Fira Sans",
    weight: "500",
  }),
  displayBold: fontBuilder({
    url: FiraSansBold,
    family: "Fira Sans",
    weight: "600",
  }),
  displayBlack: fontBuilder({
    url: FiraSansBlack,
    family: "Fira Sans",
    weight: "800",
  }),
  numeric: fontBuilder({
    url: LatoRegular,
    family: "Lato",
    weight: "400",
  }),
  numericBold: fontBuilder({
    url: LatoBold,
    family: "Lato",
    weight: "600",
  }),
  numericBlack: fontBuilder({
    url: LatoBlack,
    family: "Lato",
    weight: "800",
  }),
  displayMono: fontBuilder({
    url: FiraMonoRegular,
    family: "Fira Mono",
    weight: "400",
    monospace: true,
  }),
  displayMonoMedium: fontBuilder({
    url: FiraMonoMedium,
    family: "Fira Mono",
    weight: "500",
    monospace: true,
  }),
};

let fontsInstalled = false;
function installFonts() {
  if (fontsInstalled) return;

  // Render our fonts statically only once, to work around flickering during
  // development: https://github.com/styled-components/styled-components/issues/1593#issuecomment-409011695
  const style = document.createElement("style");
  style.innerHTML = getFontVarCSS(Object.values(fonts));
  document.head.appendChild(style);

  fontsInstalled = true;
}

/** A React component that installs Cyber fonts automatically. */
export function CyberFontStyle() {
  useEffect(installFonts, []);
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

function fontBuilder({
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
        : line ?? "normal";

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
