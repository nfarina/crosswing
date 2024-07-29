import { MutableRefObject, ReactNode, createContext, useContext } from "react";

/**
 * The shape of the modal context.
 */
export type ModalContextValue = {
  showModal(
    key: string,
    modal: (...args: any) => ReactNode,
    ...args: any
  ): void;
  hideModal(key: string): void;
  /** Show a temporary message in the frame of the modalRoot. */
  showToast(toast: string | Omit<Toast, "key">): void;
  /** Hide a Toast. */
  hideToast(key: string): void;
  /**
   * The root of the element that holds the rendered modals themselves
   * (adjacent to the normal render tree).
   */
  modalRoot: MutableRefObject<HTMLDivElement | null>;
  /**
   * The root of the element that holds the normal render tree which is adjacent
   * to the modalRoot render tree.
   */
  modalContextRoot: MutableRefObject<HTMLDivElement | null>;
  allowDesktopPresentation?: boolean;
};

/**
 * Modal Context Object
 */
export const ModalContext = createContext<ModalContextValue>({
  showModal: invariantViolation,
  hideModal: invariantViolation,
  showToast: invariantViolation,
  hideToast: invariantViolation,
  modalRoot: { current: null },
  modalContextRoot: { current: null },
});
ModalContext.displayName = "ModalContext";

/**
 * Throw error when ModalContext is used outside of context provider.
 */
export function invariantViolation() {
  throw new Error(
    "Attempted to call useModal() outside of modal context. Make sure your app is rendered inside <ModalProvider>.",
  );
}

/**
 * Convenience hook for using the modal context.
 */
export function useModalContext() {
  return useContext(ModalContext);
}

/**
 * Toast interface.
 */
export interface Toast {
  key: string;
  title?: ReactNode;
  message?: ReactNode;
  wrap?: boolean;
  sticky?: boolean;
  to?: string;
  onClick?: () => void;
}
