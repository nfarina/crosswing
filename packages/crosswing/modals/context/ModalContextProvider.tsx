import {
    ReactElement,
    ReactNode,
    cloneElement,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";
import { useHost } from "../../host/context/HostContext";
import { Minutes } from "../../shared/timespan";
import { ModalContext } from "./ModalContext";

// When any modal is being displayed, we ask our native host (if present) to
// delay updates for 30 minutes.
const UPDATE_DELAY_FOR_MODALS = Minutes(30);

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
  const { delayUpdates } = useHost();
  const modalContext = useContext(ModalContext);
  const { modalRoot } = modalContext;

  // All the modals currently being displayed with the current context.
  // Note that the order of items in this map is not necessarily the same
  // as the order of the resulting HTML elements! That is determined by
  // createPortal() which adds elements as they are first rendered.
  const [modals, setModals] = useState(new Map<string, ReactNode>());

  const showModal = useCallback(
    (key: string, modal: (...args: any) => ReactNode, ...args: any) =>
      setModals((current) => {
        const next = new Map(current);
        next.set(key, modal(...(args ?? [])));
        return next;
      }),
    [setModals],
  );

  const hideModal = useCallback(
    (key: string) =>
      setModals((current) => {
        const next = new Map(current);
        next.delete(key);
        return next;
      }),
    [setModals],
  );

  useEffect(() => {
    delayUpdates(modals.size > 0 ? UPDATE_DELAY_FOR_MODALS : 0);
  }, [modals.size]);

  // Resolve this value.
  const allowDesktopPresentation =
    allowDesktopPresentationOverride ?? modalContext.allowDesktopPresentation;

  // Make sure to keep this object reference stable across renders so we don't
  // cause any context children to re-render unnecessarily.
  const contextValue = useMemo(
    () => ({ showModal, hideModal, modalRoot, allowDesktopPresentation }),
    [showModal, hideModal, modalRoot, allowDesktopPresentation],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalRoot.current && (
        <TransitionGroup component={null}>
          {Array.from(modals.entries()).map(([key, component]) => (
            <TransitionComponent
              key={key}
              component={component}
              element={modalRoot.current}
            />
          ))}
        </TransitionGroup>
      )}
    </ModalContext.Provider>
  );
}

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
