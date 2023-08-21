import React, { ButtonHTMLAttributes, CSSProperties } from "react";
import { styled } from "styled-components";
import DisclosureArrow from "../../icons/DisclosureArrow.svg";
import { colors } from "../theme/colors/colors";
import { Clickable } from "./Clickable";

export function ExpandButton({
  rotate = 0,
  style,
  transparent,
  as,
  ...rest
}: {
  rotate?: number;
  transparent?: boolean;
  as?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cssProps = {
    "--rotate": rotate + "deg",
    ...style,
  } as CSSProperties;

  return (
    <StyledExpandButton style={cssProps} {...rest} as={as}>
      <div className="circle" data-transparent={!!transparent}>
        <DisclosureArrow />
      </div>
    </StyledExpandButton>
  );
}

export const StyledExpandButton = styled(Clickable)`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  > .circle {
    width: 30px;
    height: 30px;
    background: ${colors.lightGray()};
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    transform: rotate(calc(-90deg + var(--rotate)));

    @media (prefers-color-scheme: dark) {
      background: ${colors.extraDarkGray()};
    }

    &[data-transparent="true"] {
      background: transparent;
    }

    > svg {
      path {
        fill: ${colors.text()};
      }
    }
  }
`;
