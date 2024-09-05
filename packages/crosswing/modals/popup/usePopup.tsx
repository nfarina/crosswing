import {
  MouseEvent,
  MutableRefObject,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { keyframes, styled } from "styled-components";
import { useHotKey } from "../../hooks/useHotKey.js";
import { useHost } from "../../host/context/HostContext.js";
import { easing } from "../../shared/easing.js";
import { useModal } from "../context/useModal.js";
import { useClickOutsideToClose } from "./useClickOutsideToClose.js";

export interface Popup<T extends any[] = []> {
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
 * Desired placement of the Popup. Defaults to "platform" which places the popup
 * below the target on the web, and above the target on mobile. Auto mode
 * can be convenient but unexpected for users so we don't use it by default.
 */
export type PopupPlacement = "platform" | "auto" | "above" | "below";

export interface PopupOptions {
  placement?: PopupPlacement;
  /**
   * Default true, listens for clicks on the nearest Modal root and validates
   * them against the PopupTarget to auto-close the popup when clicking outside
   * it.
   */
  clickOutsideToClose?: boolean;
  /**
   * Default false, will automatically reposition the popup every 100ms. This is
   * useful if the target's size or position frequently changes after the popup
   * is shown.
   */
  autoReposition?: boolean;
  /**
   * By default, a subtle backdrop is rendered to visually highlight the popup.
   * You can turn it off if desired.
   */
  hideBackdrop?: boolean;
}

/** Props given to the element returned from usePopup(). */
export type PopupChildProps = {
  placement: Omit<PopupPlacement, "auto" | "platform">;
  onClose: () => void;
};

export function usePopup<T extends any[]>(
  popup: (...args: T) => ReactNode,
  {
    placement = "platform",
    clickOutsideToClose = true,
    autoReposition = false,
    hideBackdrop = false,
  }: PopupOptions = {},
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
      clickOutsideToClose={clickOutsideToClose}
      autoReposition={autoReposition}
      hideBackdrop={hideBackdrop}
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
  clickOutsideToClose = true,
  autoReposition = false,
  hideBackdrop = false,
}: {
  placement: PopupPlacement;
  target: PopupTarget;
  children: ReactNode;
  onClose: () => void;
  in?: boolean;
  onExited?: () => void;
  /**
   * Default true, listens for clicks on the nearest Modal root and validates
   * them against the PopupTarget to auto-close the popup when clicking outside
   * it.
   */
  clickOutsideToClose?: boolean;
  /**
   * Default false, will automatically reposition the popup every 100ms. This is
   * useful if the target's size or position frequently changes after the popup
   * is shown.
   */
  autoReposition?: boolean;
  /**
   * By default, a subtle backdrop is rendered to visually highlight the popup.
   * You can turn it off if desired.
   */
  hideBackdrop?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolvedPlacement, setResolvedPlacement] =
    useState<Omit<PopupPlacement, "platform" | "auto">>("below");
  const { container: hostContainer } = useHost();

  useClickOutsideToClose(
    () => clickOutsideToClose && onClose(),
    containerRef,
    target,
  );

  // Listen for the escape key and call onClose if pressed.
  useHotKey("Escape", { target: containerRef, onPress: onClose });

  // We need to keep the callback "fresh" because it's a closure that likely
  // encapsulates the state of the component it was defined in.
  const positionPopupRef = useRef(positionPopup);

  useLayoutEffect(() => {
    // Update the callback pointer.
    positionPopupRef.current = positionPopup;

    if (autoReposition) {
      // Start a timer to position the popup every 100ms.
      const intervalId = setInterval(() => positionPopupRef.current(), 100);
      return () => clearInterval(intervalId);
    }
  }, [positionPopup]);

  const onAnimationEnd = useCallback(() => {
    if (animatingIn === false) {
      onExited?.();
    }
  }, [animatingIn, onExited]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const popup = container?.children[1]?.children[0];

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
    JSON.stringify(target.current?.getBoundingClientRect() ?? {}),
    containerRef.current,
    containerRef.current?.children[1]?.children[0],
  ]);

  function positionPopup() {
    const container = containerRef.current;
    const doc = container?.ownerDocument;
    const popupArea = container?.children[1];
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
    let offset = Math.round(
      targetRect.x - containerRect.x + targetRect.width / 2 - 10,
    );

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
    const arrowLeft = offset + "px";
    const popupLeft = popupOffset + "px";

    // Only apply the styles if they've changed, since this function is called
    // every 100ms.

    if (
      style.getPropertyValue("--arrow-left") !== arrowLeft ||
      style.getPropertyValue("--popup-left") !== popupLeft
    ) {
      style.setProperty("--arrow-left", offset + "px");
      style.setProperty("--popup-left", popupOffset + "px");
    }

    const computedPlacement = (() => {
      if (placement === "platform") {
        // Default is to pop up above your finger on mobile.
        return hostContainer === "web" ||
          hostContainer === "webapp" ||
          hostContainer === "electron"
          ? "below"
          : "above";
      } else if (placement === "auto") {
        // Where do we have the most vertical space?
        const upperSpace = targetRect.top - containerRect.y;
        const lowerSpace = containerRect.height - targetRect.bottom;
        return upperSpace > lowerSpace ? "above" : "below";
      } else {
        return placement;
      }
    })();

    // If the placement has changed, update the state.
    if (resolvedPlacement !== computedPlacement) {
      setResolvedPlacement(computedPlacement);
    }

    if (computedPlacement === "below") {
      if (style.getPropertyValue("--popup-placement") !== "below") {
        style.setProperty("--popup-placement", "below");
        style.bottom = "0";
        style.paddingTop = "0";
        style.paddingBottom = "10px";
      }

      const top = targetRect.bottom - containerRect.y + "px";

      if (style.top !== top) {
        style.top = targetRect.bottom - containerRect.y + "px";
      }
    } else {
      if (style.getPropertyValue("--popup-placement") !== "above") {
        style.setProperty("--popup-placement", "above");
        style.top = "0";
        style.paddingTop = "10px";
        style.paddingBottom = "0";
      }

      const bottom =
        containerRect.height - targetRect.top + containerRect.y + "px";

      if (style.bottom !== bottom) {
        style.bottom = bottom;
      }
    }
  }

  const childProps: PopupChildProps = {
    placement: resolvedPlacement,
    onClose,
  };

  return (
    <StyledPopupContainer
      data-hide-backdrop={hideBackdrop}
      data-animating-in={animatingIn}
      onAnimationEnd={onAnimationEnd}
      ref={containerRef}
    >
      <div
        className="backdrop"
        data-animating-in={animatingIn}
        onClick={onClose}
      />
      <div className="popup-area">
        {isValidElement(children)
          ? cloneElement(children, childProps)
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

  > .backdrop {
    z-index: 0;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

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

  &[data-hide-backdrop="true"] > .backdrop {
    display: none;
  }

  &[data-animating-in="true"] {
    > .backdrop {
      animation: ${fadeIn} 0.2s ${easing.outQuart} backwards;
    }

    > .popup-area {
      animation: ${fadeIn} 0.2s ${easing.outQuart};
    }
  }

  &[data-animating-in="false"] {
    > .backdrop {
      animation: ${fadeOut} 0.2s ${easing.outCubic} forwards;
    }

    > .popup-area {
      animation: ${fadeOut} 0.2s ${easing.outCubic} forwards;
    }
  }
`;
