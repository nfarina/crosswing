import { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { getBuilderVarCss } from "./colors/builders";
import { ColorBuilder, colors, shadows } from "./colors/colors";
import { CyberFontStyle, fonts } from "./fonts/fonts";

export function CyberApp({
  colors: overriddenColors,
  children,
  transparent,
  ...rest
}: {
  colors?: Record<string, ColorBuilder>;
  transparent?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const resolvedColors = [
    ...Object.values(colors),
    ...Object.values(shadows),
    ...Object.values(overriddenColors ?? []),
  ];

  return (
    <StyledCyberApp
      $colors={resolvedColors}
      data-transparent={!!transparent}
      {...rest}
    >
      <CyberFontStyle />
      {children}
    </StyledCyberApp>
  );
}

export const StyledCyberApp = styled.div<{
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
