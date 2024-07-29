import { HTMLAttributes, ReactNode, useCallback } from "react";
import { keyframes, styled } from "styled-components";
import { colors, shadows } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { useGesture } from "../../hooks/useGesture.js";
import { useInterval } from "../../hooks/useInterval.js";
import { CloseIcon } from "../../icons/Close.js";
import { Link } from "../../router/Link.js";
import { easing } from "../../shared/easing.js";
import { Seconds } from "../../shared/timespan.js";

const AUTO_DISMISS_TIME = Seconds(4);

export function ToastView({
  title,
  message,
  truncate,
  to,
  sticky,
  onClick,
  onClose,
  // Provided by <TransitionGroup>.
  in: animatingIn,
  onExited,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  message?: ReactNode;
  truncate?: boolean;
  to?: string;
  sticky?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  in?: boolean;
  onExited?: () => void;
}) {
  // Allow swiping right on the toast to dismiss it.
  const onTouchStart = useGesture({
    direction: "right",
    onGestureComplete: onClose,
  });

  // For automatically closing the toast.
  useInterval(
    () => {
      if (!sticky) onClose?.();
    },
    AUTO_DISMISS_TIME,
    [sticky],
  );

  const onAnimationEnd = useCallback(() => {
    if (animatingIn === false) {
      onExited?.();
    }
  }, [animatingIn, onExited]);

  const onToastClick = useCallback(() => {
    onClick?.();
    onClose?.();
  }, [onClick]);

  return (
    <StyledToastView
      {...rest}
      onTouchStart={onTouchStart}
      data-truncate-text={!!truncate}
      data-animating-in={animatingIn}
      onAnimationEnd={onAnimationEnd}
    >
      {to ? (
        <Link className="content" to={to} onClick={onToastClick}>
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </Link>
      ) : (
        <div className="content" onClick={onToastClick}>
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </div>
      )}
      <div className="close" onClick={onClose}>
        <CloseIcon />
      </div>
    </StyledToastView>
  );
}

const slideLeft = keyframes`
  from {
    transform: translateX(calc(100% + 40px));
  }
  /* For some reason we have to explicitly define the "to" state to make
     it work in Safari. Otherwise it just "appears" at the end of the
     animation. */
  to {
    transform: none;
  }
`;

const slideRight = keyframes`
  to {
    transform: translateX(calc(100% + 40px));
  }
`;

const StyledToastView = styled.div`
  min-height: 60px;
  background: ${colors.textBackground()};
  color: ${colors.text()};
  border-radius: 6px;
  box-shadow:
    ${shadows.cardBorder()},
    0 4px 20px 0 ${colors.darkGreen({ alpha: 0.3 })};

  @media (prefers-color-scheme: dark) {
    box-shadow:
      ${shadows.cardBorder()},
      0 4px 20px 0 ${colors.black({ alpha: 0.65 })},
      inset 0 0 0 1px ${colors.white({ alpha: 0.07 })};
  }

  &[data-animating-in="true"] {
    animation: ${slideLeft} 0.3s ${easing.outQuint};
  }

  &[data-animating-in="false"] {
    animation: ${slideRight} 0.3s ${easing.inOutCirc} forwards;
  }

  display: flex;
  flex-flow: row;
  align-items: center;

  > .content {
    flex-grow: 1;
    padding: 10px;
    display: flex;
    flex-flow: column;
    cursor: pointer;
    color: ${colors.text()};
    text-decoration: none;

    > .title {
      font: ${fonts.displayBold({ size: 15, line: "22px" })};
    }

    > .message {
      font: ${fonts.display({ size: 15, line: "22px" })};
    }
  }

  &[data-truncate-text="true"] {
    > .content {
      > .title,
      > .message {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 0;
        min-width: 100%;
      }
    }
  }

  > .close {
    width: 44px;
    flex-shrink: 0;
    align-self: stretch;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${colors.text()};
  }
`;
