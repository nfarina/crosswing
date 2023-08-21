import React, { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors, shadows } from "../../theme/colors/colors";
import { PopupChildProps } from "./usePopup";

export * from "./usePopup";

export function PopupView({
  placement = "below",
  background,
  arrowBackground,
  arrowBackgroundDark,
  style,
  className,
  ...rest
}: {
  background?: string;
  arrowBackground?: string;
  arrowBackgroundDark?: string;
  children?: ReactNode;
} & Partial<PopupChildProps> &
  HTMLAttributes<HTMLDivElement>) {
  const cssProps = {
    ...style,
    "--background": background ?? colors.textBackground(),
    "--arrow-background": arrowBackground ?? colors.textBackground(),
    "--arrow-background-dark": arrowBackgroundDark ?? colors.textBackground(),
  } as CSSProperties;

  return (
    <StyledPopupView
      className={className}
      style={cssProps}
      data-placement={placement}
    >
      {PopupUpArrow}
      <div className="container" {...rest} />
    </StyledPopupView>
  );
}

export const StyledPopupView = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;
  pointer-events: none;

  > svg {
    pointer-events: auto;
    height: 9px;
    flex-shrink: 0;
    z-index: 1;
    position: relative;
    left: var(--arrow-left, 50%);
    transform: translateX(-50%);

    path#Fill {
      fill: var(--arrow-background);

      @media (prefers-color-scheme: dark) {
        fill: var(--arrow-background-dark);
      }
    }

    path#Shadow {
      /* Copied from cardBorderShadow */
      fill: ${colors.darkGreen({ alpha: 0.07 })};
      fill-opacity: 1;

      @media (prefers-color-scheme: dark) {
        fill: ${colors.black({ alpha: 0.2 })};
      }
    }
  }

  > .container {
    pointer-events: auto;
    position: relative;
    left: var(--popup-left, 50%);
    transform: translateX(-50%);

    box-sizing: border-box;
    max-height: calc(100% - 9px);
    flex-shrink: 0;
    z-index: 0;
    border-radius: 6px;
    overflow: hidden;
    background: var(--background);
    box-shadow:
      ${shadows.cardSmall()},
      ${shadows.cardBorder()},
      0 0 100px ${colors.black({ alpha: 0.2 })};
    display: flex;
    flex-flow: column;

    > * {
      box-sizing: border-box;
      max-height: 100%;
    }
  }

  &[data-placement="above"] {
    flex-flow: column-reverse;

    > svg {
      transform: translateX(-50%) scaleY(-1);
    }
  }
`;

// Pasted from PopupUpArrow.svg so we can apply CSS styles.
const PopupUpArrow = (
  <svg
    className="popup-arrow"
    width="21"
    height="9"
    viewBox="0 0 21 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="PopupUpArrow">
      <path
        id="Shadow"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.999959 8.99877H20L13.598 2.32788C11.881 0.540404 9.11296 0.546343 7.40196 2.32788L0.999959 8.99976V8.99877ZM20.342 7.91796L14.322 1.64694C12.214 -0.550295 8.78396 -0.548315 6.67696 1.64694L0.657959 7.91796H20.342V7.91796Z"
        fill="#8898AA"
        fillOpacity="0.1"
      />
      <path
        id="Fill"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.40195 2.32887C9.11295 0.546341 11.882 0.540403 13.598 2.32887L20 8.99975H0.999954L7.40195 2.32887V2.32887Z"
        fill="white"
      />
    </g>
  </svg>
);
