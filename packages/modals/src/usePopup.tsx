import { useHotkey } from "@cyber/hooks";
import { useHost } from "@cyber/host";
import { easing } from "@cyber/theme";
import React, {
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { keyframes, styled } from "styled-components";
import { useClickOutsideToClose } from "./useClickOutsideToClose.js";
import { useModal } from "./useModal.js";

export interface Popup<T extends any[]> {
  /** Shows the popup around the given target. */
  show: (target: PopupTarget, ...args: T) => void;
  /** Hides the popup. */
  hide: () => void;
  /** Whether the popup is currently shown. */
  visible: boolean;
  /** Shows the popup if not shown, otherwise hides. */
  toggle: (target: PopupTarget, ...args: T) => void;
  /**
   * Convenience method that will automatically show or hide the popup. The
   * target will be the event's target, so you can easily bind this to the
   * onClick event of a button for instance.
   */
  onClick: (e: MouseEvent) => void;
}

// Use a ref for our target because it could start out null then become
// non-null after mounting.
export type PopupTarget = MutableRefObject<HTMLElement | null>;

/**
 * Desired placement of the Popup. Defaults to "auto" which places the popup
 * below the target on the web, and above the target on mobile.
 */
export type PopupPlacement = "auto" | "above" | "below";

export interface PopupOptions {
  placement?: PopupPlacement;
}

/** Props given to the element returned from usePopup(). */
export type PopupChildProps = {
  placement: Omit<PopupPlacement, "auto">;
  onClose: () => void;
};

export function usePopup<T extends any[]>(
  popup: (...args: T) => ReactNode,
  { placement = "auto" }: PopupOptions = {},
): Popup<T> {
  // Ugly wrapping of a ref in a ref. But we don't need to use state because
  // changing this doesn't require a re-render.
  const activeTarget = useRef<PopupTarget>({ current: null });

  const container = useModal((...args: T) => (
    <PopupContainer
      placement={placement}
      target={activeTarget.current}
      onClose={hide}
      children={popup(...args)}
    />
  ));

  function onClick(e: MouseEvent) {
    const element = e.currentTarget as HTMLElement;
    const target = { current: element };
    (toggle as any)(target);
  }

  function toggle(target: PopupTarget, ...args: T) {
    const element = target.current;
    if (activeTarget.current.current || !element) {
      hide();
    } else {
      show(target, ...args);
    }
  }

  function show(target: PopupTarget, ...args: T) {
    activeTarget.current = target;
    container.show(...args);
    if (target.current) target.current.blur();
  }

  function hide() {
    activeTarget.current = { current: null };
    container.hide();
  }

  const { isVisible: visible } = container;

  return { show, hide, visible, toggle, onClick };
}

export const PopupContainer = ({
  placement,
  target,
  children,
  onClose,
  // Provided by <TransitionGroup>.
  in: animatingIn,
  onExited,
}: {
  placement: PopupPlacement;
  target: PopupTarget;
  children: ReactNode;
  onClose: () => void;
  in?: boolean;
  onExited?: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { container } = useHost();
  useClickOutsideToClose(onClose, containerRef, target);

  // Listen for the escape key and call onClose if pressed.
  useHotkey("Escape", { target: containerRef, onPress: onClose });

  // We need to keep the callback "fresh" because it's a closure that likely
  // encapsulates the state of the component it was defined in.
  const positionPopupRef = useRef(positionPopup);

  useLayoutEffect(() => {
    // Update the callback pointer.
    positionPopupRef.current = positionPopup;
  }, [positionPopup]);

  const onAnimationEnd = useCallback(() => {
    if (animatingIn === false) {
      onExited?.();
    }
  }, [animatingIn, onExited]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const popup = container?.children[0]?.children[0];

    // Position the popup right on mount and before it's shown to the user.
    if (target.current && container) {
      positionPopupRef.current();

      // Watch for changes in size (if supported).
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
          positionPopupRef.current();
        });

        resizeObserver.observe(container);
        if (popup) resizeObserver.observe(popup);

        return () => {
          resizeObserver.unobserve(container);
          if (popup) resizeObserver.unobserve(popup);
        };
      }
    }
  }, [
    target.current,
    containerRef.current,
    containerRef.current?.children[0]?.children[0],
  ]);

  const isWeb = container === "web";

  // Default is to pop up above your finger on mobile.
  const autoPlacement: PopupPlacement = isWeb ? "below" : "above";

  // Go with auto unless you told us otherwise.
  const resolvedPlacement: Omit<PopupPlacement, "auto"> =
    placement === "auto" ? autoPlacement : placement;

  function positionPopup() {
    const container = containerRef.current;
    const doc = container?.ownerDocument;
    const popupArea = container?.children[0];
    const popup = popupArea?.children[0];

    // If we don't have a target (or some other condition fails) then
    // we won't touch anything, in case we are animating out.
    if (!container || !target.current || !doc || !popup) return;

    // Allow you to place a "popup-target" CSS class on some descendent of
    // your target element (the thing the user clicked) so you can control the
    // arrow location. This is super useful if your button that the user
    // can click has an enlarged hit area for mobile.
    const targetElement =
      target.current.querySelector(".popup-target") || target.current;

    // Get all the bounding boxes of our elements.
    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    // Here's where we *want* to point, right in the middle of the target.
    let offset =
      targetRect.x - containerRect.x + Math.round(targetRect.width / 2) - 10;

    let popupOffset = offset;

    if (offset <= containerRect.width / 2) {
      // Bias toward the left side of the container.
      const leftEdge = offset - Math.round(popupRect.width / 2);
      const minLeft = 0;
      if (leftEdge < minLeft) popupOffset += minLeft - leftEdge;
    } else {
      const rightEdge = offset + Math.round(popupRect.width / 2);
      const maxRight = containerRect.width - 20;
      if (rightEdge > maxRight) popupOffset -= rightEdge - maxRight;
    }

    // Inform the popup element about the desired place to point.
    const style = (popupArea as HTMLElement).style;
    style.setProperty("--arrow-left", offset + "px");
    style.setProperty("--popup-left", popupOffset + "px");

    if (resolvedPlacement === "below") {
      style.top = targetRect.bottom - containerRect.y + "px";
      style.bottom = "0";
      style.paddingTop = "0";
      style.paddingBottom = "10px";
    } else {
      style.top = "0";
      style.paddingTop = "10px";
      style.paddingBottom = "0";
      style.bottom =
        containerRect.height - targetRect.top + containerRect.y + "px";
    }
  }

  const childProps: PopupChildProps = {
    placement: resolvedPlacement,
    onClose,
  };

  return (
    <StyledPopupContainer
      data-animating-in={animatingIn}
      onAnimationEnd={onAnimationEnd}
      ref={containerRef}
    >
      <div className="popup-area">
        {React.isValidElement(children)
          ? React.cloneElement(children, childProps)
          : children}
      </div>
    </StyledPopupContainer>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
`;

const fadeOut = keyframes`
  from {
    /* Prevent user interaction (like double-clicking buttons) while disappearing. */
    pointer-events: none;
  }
  to {
    opacity: 0;
  }
`;

const StyledPopupContainer = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  pointer-events: none;

  > .popup-area {
    position: absolute;
    right: 0px;
    left: 0px;
    padding: 10px;
    /* top and bottom are set via JS. */
    display: flex;
    flex-flow: column;

    > * {
      align-self: flex-start;
      height: 0;
      flex-grow: 1;
    }
  }

  &[data-animating-in="true"] {
    > .popup-area {
      animation: ${fadeIn} 0.2s ${easing.outQuart};
    }
  }

  &[data-animating-in="false"] {
    > .popup-area {
      animation: ${fadeOut} 0.2s ${easing.outCubic} forwards;
    }
  }
`;
