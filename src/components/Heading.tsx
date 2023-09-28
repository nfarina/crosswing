import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../theme/colors/colors";
import { fonts } from "../theme/fonts";
import { Button } from "./Button";

export function Heading({
  children,
  right,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <StyledHeading {...rest}>
      {children && <div className="title">{children}</div>}
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
    font: ${fonts.displayBold({ size: 18, line: "1" })};
    color: ${colors.text()};
  }

  > .right {
    flex-shrink: 0;
  }
`;
