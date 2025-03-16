import {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";
import { HostContext } from "../../host/context/HostContext.js";
import { Minutes } from "../../shared/timespan.js";
import { PopupPlacement } from "../popup/getPopupPlacement.js";
import { TooltipView } from "../popup/PopupView.js";
import { PopupContainer, PopupTarget } from "../popup/usePopup.js";
import { ToastContainer } from "../toasts/ToastContainer.js";
import { ModalContext, Toast } from "./ModalContext.js";

// When any modal is being displayed, we ask our native host (if present) to
// delay updates for 30 minutes.
const UPDATE_DELAY_FOR_MODALS = Minutes(30);

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
 * Rendered automatically by <ModalRootProvider>, but you can place it yourself
 * deeper in your component tree to "capture" the current React Context and
 * make it available to any modals presented at that point in the tree.
 */
export function ModalContextProvider({
  allowDesktopPresentation: allowDesktopPresentationOverride,
  children,
}: {
  allowDesktopPresentation?: boolean;
  children: ReactNode;
}) {
  const { delayUpdates } = use(HostContext);
  const modalContext = use(ModalContext);
  const { modalRoot } = modalContext;
  const modalContextRoot = useRef<HTMLDivElement | null>(null);

  // All the modals currently being displayed with the current context.
  // Note that the order of items in this map is not necessarily the same
  // as the order of the resulting HTML elements! That is determined by
  // createPortal() which adds elements as they are first rendered.
  const [modals, setModals] = useState(new Map<string, ReactNode>());

  const showModal = (
    key: string,
    modal: (...args: any) => ReactNode,
    ...args: any
  ) => {
    setModals((current) => {
      const next = new Map(current);
      next.set(key, modal(...(args ?? [])));
      return next;
    });
  };

  const hideModal = (key: string) =>
    setModals((current) => {
      const next = new Map(current);
      next.delete(key);
      return next;
    });

  useEffect(() => {
    delayUpdates(modals.size > 0 ? UPDATE_DELAY_FOR_MODALS : 0);
  }, [modals.size]);

  // Resolve this value.
  const allowDesktopPresentation =
    allowDesktopPresentationOverride ?? modalContext.allowDesktopPresentation;

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
      const [nearestRoot] = findAncestor(target, "data-is-modal-context-root");
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
    showModal,
    hideModal,
    showToast,
    hideToast,
    setTooltip,
    modalRoot,
    modalContextRoot,
    allowDesktopPresentation,
  };

  return (
    <ModalContext value={contextValue}>
      <StyledModalContextProvider
        data-is-modal-context-root
        ref={modalContextRoot}
      >
        {children}
      </StyledModalContextProvider>
      {modalRoot.current && (
        <TransitionGroup component={null}>
          {Array.from(modals.entries()).map(([key, component]) => (
            <TransitionComponent
              key={key}
              component={component}
              element={modalRoot.current}
            />
          ))}
          <TransitionComponent
            element={modalRoot.current}
            component={
              <ToastContainer
                toasts={toasts}
                onToastClose={(toast) => hideToast(toast.key)}
              />
            }
          />
          {tooltipPopup && (
            <TransitionComponent
              element={modalRoot.current}
              component={
                <PopupContainer
                  placement={tooltipPopup.placement}
                  target={tooltipPopup.target}
                  children={tooltipPopup.children}
                  delay={tooltipPopup.delay}
                  onClose={() => setTooltipPopup(null)}
                />
              }
            />
          )}
        </TransitionGroup>
      )}
    </ModalContext>
  );
}

export const StyledModalContextProvider = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;

  /* The only child is the content, i.e. everything not in a modal. */
  > * {
    flex-grow: 1;
    box-sizing: border-box;
    z-index: 0;
  }
`;

/**
 * TransitionGroup expects to have direct children that it can call
 * cloneElement() on, adding its animation-related props like "isExited".
 * This doesn't work on the result of createPortal(), so we need to render
 * this intermediate component to receive those props and pass them on to the
 * component that's being placed inside the portal.
 */
function TransitionComponent({
  component,
  element,
  ...rest
}: {
  component: ReactElement;
  element: HTMLElement;
} & any) {
  const child = isValidElement(component) ? (
    cloneElement(component, rest)
  ) : (
    <div children={component} />
  );

  return createPortal(child, element);
}

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
