import { MutableRefObject, ReactNode, createContext } from "react";

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
  modalRoot: MutableRefObject<HTMLDivElement | null>;
  allowDesktopPresentation?: boolean;
};

/**
 * Modal Context Object
 */
export const ModalContext = createContext<ModalContextValue>({
  showModal: invariantViolation,
  hideModal: invariantViolation,
  modalRoot: { current: null },
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
