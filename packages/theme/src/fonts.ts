import { useEffect } from "react";
import FiraSansBlackURL from "../fonts/fira-sans/FiraSans-Black.ttf";
import FiraSansBoldURL from "../fonts/fira-sans/FiraSans-Bold.ttf";
import FiraSansMediumURL from "../fonts/fira-sans/FiraSans-Medium.ttf";
import FiraSansRegularURL from "../fonts/fira-sans/FiraSans-Regular.ttf";
import LatoBlackURL from "../fonts/lato/Lato-Black.ttf";
import LatoBoldURL from "../fonts/lato/Lato-Bold.ttf";
import LatoRegularURL from "../fonts/lato/Lato-Regular.ttf";

export const fonts = {
  display: fontBuilder({ family: "Fira Sans", weight: "400" }),
  displayMedium: fontBuilder({ family: "Fira Sans", weight: "500" }),
  displayBold: fontBuilder({ family: "Fira Sans", weight: "600" }),
  displayBlack: fontBuilder({ family: "Fira Sans", weight: "800" }),
  numeric: fontBuilder({ family: "Lato", weight: "400" }),
  numericBold: fontBuilder({ family: "Lato", weight: "600" }),
  numericBlack: fontBuilder({ family: "Lato", weight: "800" }),
};

export const CyberFontCSS = `

  /* Fira Sans */

  @font-face {
    font-family: 'Fira Sans';
    src: url('${FiraSansRegularURL}') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'Fira Sans';
    src: url('${FiraSansMediumURL}') format('truetype');
    font-weight: 500;
  }

  @font-face {
    font-family: 'Fira Sans';
    src: url('${FiraSansBoldURL}') format('truetype');
    font-weight: 600;
  }

  @font-face {
    font-family: 'Fira Sans';
    src: url('${FiraSansBlackURL}') format('truetype');
    font-weight: 800;
  }

  /* Lato */

  @font-face {
    font-family: 'Lato';
    src: url('${LatoRegularURL}') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'Lato';
    src: url('${LatoBoldURL}') format('truetype');
    font-weight: 600;
  }

  @font-face {
    font-family: 'Lato';
    src: url('${LatoBlackURL}') format('truetype');
    font-weight: 800;
  }
`;

let fontsInstalled = false;
function installFonts() {
  if (fontsInstalled) return;

  // Render our fonts statically only once, to work around flickering during
  // development: https://github.com/styled-components/styled-components/issues/1593#issuecomment-409011695
  const style = document.createElement("style");
  style.innerHTML = CyberFontCSS;
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
};

function fontBuilder({
  family,
  weight,
  style = "normal",
  monospace = false,
}: {
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

  builder.family = family;
  builder.weight = weight;
  builder.style = style;
  builder.monospace = monospace;

  return builder;
}
