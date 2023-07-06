import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { Clickable } from "./Clickable.js";
import { Spinner, StyledSpinner } from "./Spinner.js";

export type ButtonSize = "smaller" | "normal" | "larger" | "largest";

export function Button({
  primary,
  size = "normal",
  icon,
  text,
  subtext,
  children,
  working,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  size?: ButtonSize;
  icon?: ReactNode;
  text?: ReactNode;
  subtext?: ReactNode;
  disabled?: boolean;
  working?: boolean;
}) {
  const hasText = !!children || !!text || !!subtext;
  const hasIcon = !!icon;

  const resolvedText = text ?? children;

  return (
    <StyledButton
      data-primary={!!primary}
      data-size={size}
      data-working={!!working}
      disabled={!!disabled || !!working}
      data-icon-only={!hasText && hasIcon}
      data-icon-and-children={hasText && hasIcon}
      {...rest}
    >
      {icon}
      {hasText && (
        <div className="content">
          {!!resolvedText && <div className="text">{resolvedText}</div>}
          {!!subtext && !working && <div className="subtext">{subtext}</div>}
        </div>
      )}
      {working && <Spinner smaller />}
    </StyledButton>
  );
}

export const StyledButton = styled(Clickable)`
  display: flex;
  flex-flow: row;
  background: ${colors.lightGray()};
  box-sizing: border-box;
  min-width: 32px;
  min-height: 32px;
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  color: ${colors.text()};
  font: ${fonts.displayBold({ size: 15 })};
  align-items: center;
  justify-content: center;

  > * {
    flex-shrink: 0;
  }

  > svg {
    path {
      fill: currentColor;
    }
  }

  > .content {
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;

    > .text {
      font: ${fonts.displayBold({ size: 15 })};
      color: ${colors.text()};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    > .subtext {
      font: ${fonts.displayMedium({ size: 12 })};
      color: ${colors.text()};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  > ${StyledSpinner} {
    margin-left: 10px;

    > div {
      background: currentcolor;
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraDarkGray()};
  }

  &[data-icon-only="true"] {
    padding: 0;
  }

  &[data-icon-and-children="true"] {
    padding-left: 10px;

    > .content {
      margin-left: 8px;
    }
  }

  &[data-primary="true"] {
    color: ${colors.white()};

    > .content {
      > .text {
        color: ${colors.white()};
      }
      > .subtext {
        color: ${colors.white()};
      }
    }

    background: ${colors.primaryGradient()};

    /* Override dark mode selector above. */
    @media (prefers-color-scheme: dark) {
      background: ${colors.primaryGradient()};
    }
  }

  &[data-size="smaller"] {
    font: ${fonts.displayBold({ size: 14 })};
    padding: 6px 18px;
    min-height: 30px;

    > .content {
      > .text {
        font: ${fonts.displayBold({ size: 14 })};
      }

      > .subtext {
        font: ${fonts.displayMedium({ size: 11 })};
      }
    }
  }

  &[data-size="larger"] {
    font: ${fonts.displayBold({ size: 16 })};
    padding: 10px 20px;
    min-height: 40px;

    > .content {
      > .text {
        font: ${fonts.displayBold({ size: 16 })};
      }

      > .subtext {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }

  &[data-size="largest"] {
    font: ${fonts.displayBold({ size: 16 })};
    min-height: 50px;

    > .content {
      > .text {
        font: ${fonts.displayBold({ size: 16 })};
      }

      > .subtext {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }
`;
