import { ColorBuilder, colors } from "@cyber/theme/colors";
import React, {
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  SyntheticEvent,
  TouchEvent,
  useRef,
} from "react";
import { styled } from "styled-components";

export function Toggle({
  on,
  smaller,
  onClick,
  disabled,
  as,
  style,
  trackBackground = colors.primaryGradient,
  ...rest
}: {
  on?: boolean;
  smaller?: boolean;
  onClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  as?: string | React.ComponentType<any>;
  trackBackground?: ColorBuilder;
} & HTMLAttributes<HTMLButtonElement>) {
  // Our visual appearance is of something draggable, but we don't implement
  // dragging the knob around. To mitigate this, we want to fire onClick
  // immediately after you begin interaction, so onMouseDown would be the
  // usual suspect, but on mobile, this event doesn't fire until after
  // onTouchStart AND onTouchEnd, so that defeats the whole purpose. This
  // variable will allow us to work around this behavior.
  const ignoreNextMouseDown = useRef(false);

  function onMouseDown(e: MouseEvent<HTMLButtonElement>) {
    if (!ignoreNextMouseDown.current) {
      if (onClick) onClick(e);
    }

    ignoreNextMouseDown.current = false;
  }

  function onTouchStart(e: TouchEvent<HTMLButtonElement>) {
    ignoreNextMouseDown.current = true;
    if (onClick) onClick(e);
  }

  const cssProperties = {
    ...style,
    "--track-background": trackBackground(),
  } as CSSProperties;

  return (
    <StyledToggle
      data-on={!!on}
      data-smaller={!!smaller}
      disabled={!!disabled}
      data-disabled={!!disabled}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="switch"
      aria-checked={!!on}
      as={as}
      style={cssProperties}
      {...rest}
    >
      <div className="container">
        <div className="track" />
        <div className="track-on" />
        <div className="handle" />
      </div>
    </StyledToggle>
  );
}

export const StyledToggle = styled.button`
  width: 50px;
  height: 30px;
  cursor: pointer;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;
  text-align: left;
  transition: opacity 0.25s ease;

  /**
   * Our design uses half pixels, which are supported well in iOS but
   * seemingly not in Chrome (they get rounded up and look terrible). As a
   * crazy workaround, we render the component at 2x using whole pixels, then
   * scale it back down by 50%.
   */
  > .container {
    width: 102px;
    height: 62px;
    transform: scale(0.5);
    transform-origin: left top;
    position: relative;

    > .track,
    > .track-on {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: ${colors.black({ alpha: 0.1 })};
      border-radius: 999px;
      box-sizing: border-box;
    }

    /* We need a separate element to fade in a linear gradient because we can't animate the CSS "background" property: https://stackoverflow.com/a/7364325/66673 */
    > .track-on {
      background: var(--track-background);
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    > .handle {
      position: absolute;
      top: 3px;
      left: 3px;
      box-sizing: border-box;
      background: ${colors.textBackground()};
      width: 56px;
      height: 56px;
      border-radius: 100%;
      box-shadow:
        0px 3px 1px rgba(0, 0, 0, 0.1),
        0px 1px 1px rgba(0, 0, 0, 0.16),
        0px 3px 8px rgba(0, 0, 0, 0.15);

      transition: left 0.25s ease;
    }
  }

  &[data-smaller="true"] {
    width: calc(50px * 0.75);
    height: calc(30px * 0.75);

    > .container {
      transform: scale(calc(0.5 * 0.75));
    }
  }

  &[data-disabled="true"] {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    > .container {
      > .track {
        background: ${colors.white({ alpha: 0.2 })};
      }
    }
  }

  &[data-on="true"] {
    > .container {
      > .track-on {
        opacity: 1;
      }

      > .handle {
        left: 43px;
      }
    }
  }
`;
