import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { Button } from "./Button.js";

export function Heading({
  children,
  right,
  onClick,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <StyledHeading data-clickable={!!onClick} {...rest}>
      {children && (
        <div className="title" onClick={onClick}>
          {children}
        </div>
      )}
      {right && <div className="right">{right}</div>}
    </StyledHeading>
  );
}

export const HeadingButton = styled(Button)`
  /* Make it a "pill" shape. */
  border-radius: 9999px;
  padding: 6px 15px;
  min-height: 24px;
  font: ${fonts.displayBold({ size: 14, line: "1" })};
`;

export const StyledHeading = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;

  > .title,
  > .children {
    flex-grow: 1;
    font: ${fonts.displayBold({ size: 18, line: "24px" })};
    color: ${colors.text()};
  }

  &[data-clickable="true"] {
    > .title,
    > .children {
      cursor: pointer;
    }
  }

  > .right {
    flex-shrink: 0;
  }
`;
