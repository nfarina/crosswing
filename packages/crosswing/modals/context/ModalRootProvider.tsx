import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { styled } from "styled-components";
import { PopupPlacement } from "../popup/getPopupPlacement.js";
import { TooltipView } from "../popup/TooltipView.js";
import {
  PopupContainer,
  PopupTarget,
  StyledPopupContainer,
} from "../popup/usePopup.js";
import {
  StyledToastContainer,
  ToastContainer,
} from "../toasts/ToastContainer.js";
import { ModalContext, Toast, throwsNoProvider } from "./ModalContext.js";
import { ModalContextProvider } from "./ModalContextProvider.js";

export * from "./ModalContext.js";
export * from "./ModalContextProvider.js";
export * from "./useModal.js";

/**
 * When you want to delay a tooltip "for a moment", this is a good system
 * default delay time.
 */
const DEFAULT_POPUP_DELAY = 500;

let nextToastId = 1;
function nextToastKey() {
  return `toast-${nextToastId++}`;
}

/**
 * Provides a surface for modals to be rendered inside. The result is an element
 * that you can size and position like any other <div>, that will render any
 * children in its bounds, along with any modals on top of the children.
 */
export function ModalRootProvider({
  allowDesktopPresentation,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  allowDesktopPresentation?: boolean;
}) {
  const modalRoot = useRef<HTMLDivElement | null>(null);
  const modalContextRoot = useRef<HTMLDivElement | null>(null);

  //
  // Toasts
  //

  // Keep track of "toast" modals that are handled differently than other
  // modals. Typically you just want to call showToast() with a string and
  // forget about it - but the design of useModal() means that if your
  // component unmounts, the modal will disappear. This is not the desired
  // behavior for toasts.
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    toast: string | (Toast & { key?: string }),
    options?: Omit<Toast, "message" | "key">,
  ) =>
    setToasts((current) => {
      const key =
        typeof toast === "object" && toast.key ? toast.key : nextToastKey();

      const newToast: Toast =
        typeof toast === "string"
          ? { key, message: toast, ...options }
          : { ...toast, key, ...options };

      const next = Array.from(current);

      // If an existing Toast exists with the same key, update its contents.
      const index = next.findIndex((t) => t.key === key);

      if (index !== -1) {
        next[index] = newToast;
      } else {
        next.push(newToast);
      }

      return next;
    });

  const hideToast = (key: string) => {
    setToasts((current) => {
      const toast = current.find((t) => t.key === key);
      toast?.onClose?.(); // Notify the Toast that it was hidden.
      return current.filter((t) => t.key !== key);
    });
  };

  //
  // Tootips
  //

  // Keep a map of tooltip IDs to tooltip render functions, for "fancy" tooltips
  // that aren't just text embedded in an HTML attribute.
  const [tooltips, setTooltips] = useState(
    new Map<string, (target: Element) => ReactNode>(),
  );

  const setTooltip = (
    id: string,
    tooltip: ((target: Element) => ReactNode) | null,
  ) => {
    setTooltips((current) => {
      const newMap = new Map(current);
      if (tooltip === null) {
        newMap.delete(id);
      } else {
        newMap.set(id, tooltip);
      }
      return newMap;
    });
  };

  // Keep track of the current tooltip popup, if one is active.
  const [tooltipPopup, setTooltipPopup] = useState<{
    target: PopupTarget;
    placement: PopupPlacement;
    children: ReactNode;
    delay?: number;
  } | null>(null);

  // We need to keep the tooltips variable fresh due to the closure in useEffect
  // below, our mouse handler will otherwise see stale data.
  const tooltipsRef = useRef(tooltips);
  useEffect(() => {
    tooltipsRef.current = tooltips;
  }, [tooltips]);

  useEffect(() => {
    const root = modalContextRoot.current;
    const modals = modalRoot.current;
    if (!root || !modals) {
      return;
    }

    // Tooltips aren't practical on touch devices, but we'll receive mouseover
    // events anyway! Fortunately, touch events fire before mouse events, so we
    // can track the last touch event and use that to suppress mouseover events
    // that occur shortly after the touch event.
    const lastTouchTimestamp = { current: 0 };

    function handleMouseEnter(e: MouseEvent) {
      if (Date.now() - lastTouchTimestamp.current < 500) {
        return;
      }

      // This target could be anything in the DOM, so we want to exit quickly
      // if it's not a tooltip target.
      const target = e.target;

      if (!(target instanceof Element)) {
        return;
      }

      let children: ReactNode;

      // First check for a tooltip ID.
      const tooltipId = target.getAttribute("data-tooltip-id");

      if (tooltipId) {
        const tooltip = tooltipsRef.current.get(tooltipId);
        if (tooltip) {
          children = tooltip(target);
        }
      }

      if (!children) {
        // Next check for a tooltip string.
        const tooltipString = target.getAttribute("data-tooltip");
        if (tooltipString) {
          children = <TooltipView target={target} />;
        }
      }

      if (!children) {
        // Not a tooltip target.
        return;
      }

      // We can have nested modal roots! Check that this tooltip's first modal
      // root ancestor is THIS modal root.
      const [nearestRoot] = findAncestor(target, "data-is-modal-root");
      if (nearestRoot !== modalContextRoot.current) {
        return;
      }

      const placement = target.getAttribute("data-tooltip-placement");
      const delay = target.getAttribute("data-tooltip-delay");
      const hidden = target.getAttribute("data-tooltip-hidden") === "true";

      if (hidden) {
        return;
      }

      function getDelay() {
        if (delay === "true") {
          return DEFAULT_POPUP_DELAY;
        } else if (delay) {
          return parseInt(delay);
        }
        return 0;
      }

      setTooltipPopup({
        target: { current: target },
        placement: (placement as PopupPlacement) || "above",
        children,
        delay: getDelay(),
      });
    }

    function handleTouchStart(e: TouchEvent) {
      lastTouchTimestamp.current = Date.now();
    }

    // Listen for the "mouseenter" event on the modal context root.
    root.addEventListener("mouseenter", handleMouseEnter, { capture: true });
    root.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });

    // Also listen on the modals themselves.
    modals.addEventListener("mouseenter", handleMouseEnter, { capture: true });
    modals.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });

    return () => {
      root.removeEventListener("mouseenter", handleMouseEnter, {
        capture: true,
      });
      root.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      modals.removeEventListener("mouseenter", handleMouseEnter, {
        capture: true,
      });
      modals.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
    };
  }, []);

  const contextValue = {
    showModal: throwsNoProvider,
    hideModal: throwsNoProvider,
    showToast,
    hideToast,
    setTooltip,
    modalRoot,
    modalContextRoot,
    allowDesktopPresentation,
  };

  return (
    <ModalContext value={contextValue}>
      <StyledModalOverlay ref={modalContextRoot} data-is-modal-root {...rest}>
        <ModalContextProvider children={children} />
        <div className="modals" ref={modalRoot} />
        <ToastContainer
          toasts={toasts}
          onToastClose={(toast) => hideToast(toast.key)}
        />
        <TransitionGroup component={null}>
          {tooltipPopup && (
            <PopupContainer
              placement={tooltipPopup.placement}
              target={tooltipPopup.target}
              children={tooltipPopup.children}
              delay={tooltipPopup.delay}
              onClose={() => setTooltipPopup(null)}
            />
          )}
        </TransitionGroup>
      </StyledModalOverlay>
    </ModalContext>
  );
}

export const StyledModalOverlay = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;

  /* The first child is the main content of the page, i.e. everything not
   * in a modal. */
  > *:first-child {
    flex-grow: 1;
    box-sizing: border-box;
    z-index: 0;
  }

  > .modals {
    z-index: 1;

    > * {
      z-index: 2;
      position: absolute;
      /* For some reason "0" doesn't work in Safari where "0px" does. */
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      /* "Fix" for WebKit painting bug on iOS when keyboard disappears: https://files.slack.com/files-pri/T0KS0F280-F027N3S17K9/image_from_ios.png */
      /* https://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes */
      transform: translateZ(0);
    }
  }

  > ${StyledToastContainer} {
    z-index: 3;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    transform: translateZ(0);
  }

  > ${StyledPopupContainer} {
    z-index: 4;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    transform: translateZ(0);
  }
`;

export function findAncestor(
  element: Element | null,
  attribute: string,
): [HTMLElement | null, string] {
  while (element) {
    if (element instanceof HTMLElement) {
      const id = element.getAttribute(attribute);
      if (id) return [element, id];
    }
    element = element.parentElement;
  }
  return [null, ""];
}
