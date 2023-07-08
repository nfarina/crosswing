import React, { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { CyberColorStyle, colors } from "./colors/index.js";
import { CyberWebStyle } from "./containers.js";
import { CyberFontStyle, fonts } from "./fonts.js";

export function CyberApp({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledCyberApp {...rest}>
      <CyberColorStyle />
      <CyberFontStyle />
      <CyberWebStyle />
      {children}
    </StyledCyberApp>
  );
}

export const StyledCyberApp = styled.div`
  background: ${colors.textBackground()};
  color: ${colors.text()};
  font: ${fonts.display({ size: 14 })};
  display: flex;
  flex-flow: column;

  > * {
    flex-grow: 1;
  }
`;
