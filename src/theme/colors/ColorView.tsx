import React, { CSSProperties, HTMLAttributes } from "react";
import { styled } from "styled-components";
import { fonts } from "../fonts.js";
import { ColorBuilder, colors } from "./colors.js";

export function ColorView({
  name,
  color,
  children,
  style,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  name: string;
  color: ColorBuilder;
}) {
  const cssProps = {
    ...style,
    "--color": color(),
  } as CSSProperties;

  return (
    <StyledColorView style={cssProps} {...rest}>
      {children}
      <div className="name">{name}</div>
    </StyledColorView>
  );
}

const StyledColorView = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color);

  > .name {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%, 100%);
    padding: 3px 10px;
    border-radius: 3px;
    background: ${colors.textBackgroundPanel()};
    color: ${colors.text()};
    font: ${fonts.displayMedium({ size: 12 })};
    z-index: 1;
    display: none;
  }

  &:hover > .name {
    display: block;
  }
`;
