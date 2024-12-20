import { HTMLAttributes, useRef, useState } from "react";
import { styled } from "styled-components";
import {
  StyledToastContainer,
  ToastContainer,
} from "../toasts/ToastContainer.js";
import { ModalContext, Toast, throwsNoProvider } from "./ModalContext.js";
import { ModalContextProvider } from "./ModalContextProvider.js";

export * from "./ModalContext.js";
export * from "./ModalContextProvider.js";
export * from "./useModal.js";

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

  const contextValue = {
    showModal: throwsNoProvider,
    hideModal: throwsNoProvider,
    showToast,
    hideToast,
    modalRoot,
    modalContextRoot,
    allowDesktopPresentation,
  };

  return (
    <ModalContext value={contextValue}>
      <StyledModalOverlay ref={modalContextRoot} {...rest}>
        <ModalContextProvider children={children} />
        <div className="modals" ref={modalRoot} />
        <ToastContainer
          toasts={toasts}
          onToastClose={(toast) => hideToast(toast.key)}
        />
      </StyledModalOverlay>
    </ModalContext>
  );
}

export const StyledModalOverlay = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;

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
`;
