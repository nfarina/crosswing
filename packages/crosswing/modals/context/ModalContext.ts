import { ReactNode, RefObject, createContext } from "react";

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
  showToast(
    toast: string | Toast | Omit<Toast, "key">,
    options?: Omit<Toast, "message" | "key">,
  ): void;
  /** Hide a Toast. */
  hideToast(key: string): void;
  /**
   * The root of the element that holds the rendered modals themselves
   * (adjacent to the normal render tree).
   */
  modalRoot: RefObject<HTMLDivElement | null>;
  /**
   * The root of the element that holds the normal render tree which is adjacent
   * to the modalRoot render tree.
   */
  modalContextRoot: RefObject<HTMLDivElement | null>;
  allowDesktopPresentation?: boolean;
};

/**
 * Modal Context Object
 */
export const ModalContext = createContext<ModalContextValue>({
  showModal: throwsNoProvider,
  hideModal: throwsNoProvider,
  showToast: throwsNoProvider,
  hideToast: throwsNoProvider,
  modalRoot: { current: null },
  modalContextRoot: { current: null },
});
ModalContext.displayName = "ModalContext";

/**
 * Throw error when ModalContext is used outside of context provider.
 */
export function throwsNoProvider() {
  throw new Error(
    "Attempted to use ModalContext outside of a provider. Make sure your app is rendered inside <ModalProvider>.",
  );
}

/**
 * Toast interface.
 */
export interface Toast {
  key: string;
  title?: ReactNode;
  message?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onActionClick?: () => void;
  wrap?: boolean;
  sticky?: boolean;
  to?: string;
  onClick?: () => void;
  onClose?: () => void;
}
