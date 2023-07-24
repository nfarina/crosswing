import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";

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
