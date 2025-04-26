import { HTMLAttributes, MouseEvent, useState } from "react";
import { keyframes, styled } from "styled-components";
import { colors, shadows } from "../../colors/colors.js";
import { Button } from "../../components/Button.js";
import { fonts } from "../../fonts/fonts.js";
import { useGesture } from "../../hooks/useGesture.js";
import { useInterval } from "../../hooks/useInterval.js";
import { CloseIcon } from "../../icons/Close.js";
import { Link } from "../../router/Link.js";
import { easing } from "../../shared/easing.js";
import { Seconds } from "../../shared/timespan.js";
import { Toast } from "../context/ModalContext.js";

const AUTO_DISMISS_TIME = Seconds(4);

export function ToastView({
  title,
  message,
  icon,
  action,
  truncate,
  to,
  sticky,
  onClick,
  onClose,
  onActionClick,
  // Provided by <TransitionGroup>.
  in: animatingIn,
  onExited,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  Omit<Toast, "key"> & {
    truncate?: boolean;
    in?: boolean;
    onExited?: () => void;
  }) {
  // Allow swiping right on the toast to dismiss it.
  const onTouchStart = useGesture({
    direction: "right",
    onGestureComplete: onClose,
  });

  // If the toast isn't sticky, we'll close it when the timer fires, UNLESS
  // your mouse is hovering over the toast.
  const [hovering, setHovering] = useState(false);
  const [closeOnLeave, setCloseOnLeave] = useState(false);

  function onMouseEnter(e: MouseEvent<HTMLDivElement>) {
    setHovering(true);
  }

  function onMouseLeave(e: MouseEvent<HTMLDivElement>) {
    setHovering(false);
    if (closeOnLeave) {
      onClose?.();
    }
  }

  const requestClose = () => {
    if (sticky) return;
    if (hovering) {
      setCloseOnLeave(true);
    } else {
      onClose?.();
    }
  };

  // For automatically closing the toast.
  useInterval(requestClose, AUTO_DISMISS_TIME, [sticky]);

  function onAnimationEnd() {
    if (animatingIn === false) {
      onExited?.();
    }
  }

  function handleActionClick() {
    onActionClick?.();
    onClose?.();
  }

  function handleToastClick() {
    if (onClick) {
      onClick();
      onClose?.();
    }
  }

  return (
    <StyledToastView
      {...rest}
      onTouchStart={onTouchStart}
      data-truncate-text={!!truncate}
      data-animating-in={animatingIn}
      data-clickable={!!onClick}
      onAnimationEnd={onAnimationEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon && (
        <div className="icon" onClick={handleToastClick}>
          {icon}
        </div>
      )}
      {to ? (
        <Link className="content" to={to} onClick={handleToastClick}>
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </Link>
      ) : (
        <div className="content" onClick={handleToastClick}>
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </div>
      )}
      {!!action && (
        <Button
          className="action"
          size="smaller"
          title={action}
          onClick={handleActionClick}
        />
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

  > * {
    flex-shrink: 0;
  }

  &[data-clickable="true"] {
    cursor: pointer;
  }

  > .icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-left: 13px;
    margin-right: -3px;
  }

  > .content {
    flex-shrink: 1;
    flex-grow: 1;
    padding: 10px;
    padding-left: 13px;
    display: flex;
    flex-flow: column;
    color: ${colors.text()};
    text-decoration: none;

    > .title {
      font: ${fonts.displayBold({ size: 15, line: "22px" })};
      word-break: break-word;
    }

    > .message {
      font: ${fonts.display({ size: 15, line: "22px" })};
      word-break: break-word;
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

  > .action {
    padding-left: 10px;
    padding-right: 10px;
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
