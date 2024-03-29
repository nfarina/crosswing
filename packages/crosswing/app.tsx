import { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { getBuilderVarCss } from "./colors/builders.js";
import { ColorBuilder, colors, shadows } from "./colors/colors.js";
import { CrosswingFontStyle, fonts } from "./fonts/fonts.js";

export function CrosswingApp({
  colors: overriddenColors = [],
  children,
  transparent,
  ...rest
}: {
  colors?: ColorBuilder[];
  transparent?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const resolvedColors = [
    ...Object.values(colors),
    ...Object.values(shadows),
    ...overriddenColors,
  ];

  return (
    <StyledCrosswingApp
      $colors={resolvedColors}
      data-transparent={!!transparent}
      {...rest}
    >
      <CrosswingFontStyle />
      {children}
    </StyledCrosswingApp>
  );
}

export const StyledCrosswingApp = styled.div<{
  $colors: ColorBuilder[];
}>`
  /* I try hard to avoid props in styled-components but this is the only
     practical way to embed CSS at the element level. */
  ${(p) => getBuilderVarCss(p.$colors)}

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
