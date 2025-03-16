import { HTMLAttributes, useRef } from "react";
import { styled } from "styled-components";
import { StyledPopupContainer } from "../popup/usePopup.js";
import { StyledToastContainer } from "../toasts/ToastContainer.js";
import { ModalContext, throwsNoProvider } from "./ModalContext.js";
import { ModalContextProvider } from "./ModalContextProvider.js";

export * from "./ModalContext.js";
export * from "./ModalContextProvider.js";
export * from "./useModal.js";

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

  const contextValue = {
    showModal: throwsNoProvider,
    hideModal: throwsNoProvider,
    showToast: throwsNoProvider,
    hideToast: throwsNoProvider,
    setTooltip: throwsNoProvider,
    modalRoot,
    modalContextRoot,
    allowDesktopPresentation,
  };

  return (
    <ModalContext value={contextValue}>
      <StyledModalOverlay ref={modalContextRoot} {...rest}>
        <ModalContextProvider children={children} />
        <div className="modals" ref={modalRoot} />
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

    > ${StyledToastContainer} {
      z-index: 3;
    }

    > ${StyledPopupContainer} {
      z-index: 4;
    }
  }
`;
