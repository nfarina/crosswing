import { ButtonHTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../theme/colors/colors";
import { fonts } from "../theme/fonts/fonts";
import { Clickable } from "./Clickable";
import { Spinner, StyledSpinner } from "./Spinner";

export type ButtonSize = "smaller" | "normal" | "larger" | "largest";

export function Button({
  primary,
  size = "normal",
  icon,
  title,
  subtitle,
  children,
  working,
  disabled,
  ...rest
}: {
  primary?: boolean;
  size?: ButtonSize;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  disabled?: boolean;
  working?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title">) {
  const hasText = !!children || !!title || !!subtitle;
  const hasIcon = !!icon;

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
          {!!title && <div className="title">{title}</div>}
          {!!subtitle && !working && <div className="subtitle">{subtitle}</div>}
        </div>
      )}
      {children}
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

    > .title {
      font: ${fonts.displayBold({ size: 15 })};
      color: ${colors.text()};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    > .subtitle {
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
    background: ${colors.extraExtraExtraDarkGray()};
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
      > .title {
        color: ${colors.white()};
      }
      > .subtitle {
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
      > .title {
        font: ${fonts.displayBold({ size: 14 })};
      }

      > .subtitle {
        font: ${fonts.displayMedium({ size: 11 })};
      }
    }
  }

  &[data-size="larger"] {
    font: ${fonts.displayBold({ size: 16 })};
    padding: 10px 20px;
    min-height: 40px;

    > .content {
      > .title {
        font: ${fonts.displayBold({ size: 16 })};
      }

      > .subtitle {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }

  &[data-size="largest"] {
    font: ${fonts.displayBold({ size: 16 })};
    min-height: 50px;

    > .content {
      > .title {
        font: ${fonts.displayBold({ size: 16 })};
      }

      > .subtitle {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }
`;
