import { KeyboardEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors";
import { fonts } from "../fonts/fonts";
import DisclosureIcon from "../icons/DisclosureArrow.svg?react";
import { Link } from "../router/Link";
import { ButtonSize } from "./Button.js";

export function LinkButton({
  primary,
  size = "normal",
  icon,
  title,
  subtitle,
  children,
  showDisclosure,
  disabled,
  onKeyDown,
  ...rest
}: Omit<Parameters<typeof Link>[0], "title"> & {
  primary?: boolean;
  size?: ButtonSize;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  showDisclosure?: boolean;
  disabled?: boolean;
}) {
  // Allow activating LinkButtons with "space" since it behaves like a button.
  function onLinkKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") {
      event.preventDefault();
      console.log(event.target);
      if (event.target instanceof HTMLAnchorElement) {
        event.target.click();
      }
      onKeyDown?.(event);
    }
  }

  return (
    <StyledLinkButton
      data-primary={primary}
      data-size={size}
      data-disabled={disabled}
      data-icon-only={!children}
      data-icon-and-children={!!children && !!icon}
      data-disclosure={!!showDisclosure}
      role="button"
      onKeyDown={onLinkKeyDown}
      {...rest}
    >
      {icon}
      {(!!title || !!subtitle) && (
        <div className="content">
          {!!title && <div className="title">{title}</div>}
          {!!subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
      )}
      {children}
      {!!showDisclosure && <DisclosureIcon className="disclosure" />}
    </StyledLinkButton>
  );
}

export const StyledLinkButton = styled(Link)`
  /* Restyle <Link> to look like a button */
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.lightGray()};
  box-sizing: border-box;
  min-height: 30px;
  border: none;
  border-radius: 6px;
  padding: 8px 17px;
  color: ${colors.text()};
  font: ${fonts.displayBold({ size: 15, line: "1" })};
  text-decoration: none;
  transition: opacity 0.2s ease-in-out;

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraExtraDarkGray()};
  }

  > * {
    flex-shrink: 0;
  }

  > svg {
    path {
      fill: currentColor;
    }
  }

  > .content {
    display: flex;
    flex-flow: column;

    > .title {
      font: ${fonts.displayBold({ size: 15, line: "1" })};
      color: ${colors.text()};
    }

    > .subtitle {
      margin-top: 1px;
      font: ${fonts.displayMedium({ size: 12 })};
    }
  }

  > .disclosure {
    margin: -5px -7px -5px 0;
  }

  &[data-icon-only="true"] {
    padding: 0;
  }

  &[data-icon-and-children="true"] {
    padding-left: 10px;
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

    @media (prefers-color-scheme: dark) {
      background: ${colors.primaryGradient()};
    }
  }

  &[data-disabled="true"] {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
  }

  &[data-size="smaller"] {
    font: ${fonts.displayBold({ size: 14, line: "1" })};
    padding: 8px 20px;
    min-height: 30px;

    > .content {
      > .title {
        font: ${fonts.displayBold({ size: 14, line: "1" })};
      }

      > .subtitle {
        font: ${fonts.displayMedium({ size: 11 })};
      }
    }
  }

  &[data-size="larger"] {
    font: ${fonts.displayBold({ size: 16, line: "1" })};
    padding: 10px 20px;
    min-height: 40px;

    > .content {
      > .title {
        font: ${fonts.displayBold({ size: 16, line: "1" })};
      }

      > .subtitle {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }

  &[data-size="largest"] {
    font: ${fonts.displayBold({ size: 16, line: "1" })};
    min-height: 50px;

    > .content {
      > .title {
        font: ${fonts.displayBold({ size: 16, line: "1" })};
      }

      > .subtitle {
        margin-top: 3px;
        font: ${fonts.displayMedium({ size: 13 })};
      }
    }
  }
`;
