import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { StyledButton } from "./Button";
import { StyledLinkButton } from "./LinkButton";
import { StyledSpinner } from "./Spinner";

// Designed to hold a group of other form components like <Button>.
// Restyles them appropriately.

export function ButtonGroup({
  ...rest
}: {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return <StyledButtonGroup {...rest} />;
}

export const StyledButtonGroup = styled.div`
  background: ${colors.extraExtraLightGray()};
  box-shadow: inset 0 0 0 1px ${colors.controlBorder()};
  border-radius: 6px;
  display: flex;
  flex-flow: row;
  height: 30px;

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraExtraDarkGray()};
    color: ${colors.lightGray()};
  }

  > * {
    flex-shrink: 0;
  }

  > * {
    border-radius: 0;
  }

  > *:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  > *:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  > * + * {
    border-left: 1px solid ${colors.controlBorder()};
  }

  > ${StyledButton} {
    background: transparent;
    padding: 4px 9px;
    min-height: 30px;
    color: ${colors.text()};
    font: ${fonts.display({ size: 15, line: "1.5" })};
    box-shadow: none;

    > ${StyledSpinner} {
      margin-left: 6px;
    }
  }

  > ${StyledLinkButton} {
    background: transparent;
    padding: 4px 9px;
    min-height: 30px;
    color: ${colors.text()};
    font: ${fonts.display({ size: 15, line: "1.5" })};
    box-shadow: none;
  }
`;
