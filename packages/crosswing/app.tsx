import { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { getBuilderVarCss } from "./colors/builders.js";
import { ColorBuilder, colors, shadows } from "./colors/colors.js";
import {
  CrosswingFontFaceStyle,
  faces,
  FontBuilder,
  fonts,
  getFontVarCSS,
  GlobalFontFace,
} from "./fonts/fonts.js";

export function CrosswingApp({
  colors: overriddenColors = [],
  faces: overriddenFaces = [],
  fonts: overriddenFonts = [],
  children,
  transparent,
  ...rest
}: {
  colors?: ColorBuilder[];
  faces?: GlobalFontFace[];
  fonts?: FontBuilder[];
  transparent?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const resolvedColors = [
    ...Object.values(colors),
    ...Object.values(shadows),
    ...overriddenColors,
  ];

  const resolvedFaces = [...Object.values(faces), ...overriddenFaces];
  const resolvedFonts = [...Object.values(fonts), ...overriddenFonts];

  return (
    <StyledCrosswingApp
      $colors={resolvedColors}
      $fonts={resolvedFonts}
      data-transparent={!!transparent}
      {...rest}
    >
      <CrosswingFontFaceStyle faces={resolvedFaces} />
      {children}
    </StyledCrosswingApp>
  );
}

export const StyledCrosswingApp = styled.div<{
  $colors: ColorBuilder[];
  $fonts: FontBuilder[];
}>`
  /* I try hard to avoid props in styled-components but this is the only
     practical way to embed CSS at the element level. */
  ${(p) => getBuilderVarCss(p.$colors)}
  ${(p) => getFontVarCSS(p.$fonts)}

  &[data-transparent="false"] {
    background: ${colors.textBackground()};
  }

  color: ${colors.text()};
  font: ${fonts.display({ size: 14 })};
  display: flex;
  flex-flow: column;

  > * {
    flex-grow: 1;
  }
`;
