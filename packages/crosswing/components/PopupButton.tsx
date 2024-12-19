import { RefObject, useImperativeHandle, useRef } from "react";
import { styled } from "styled-components";
import { DownArrowIcon } from "../icons/DownArrow";
import { Popup } from "../modals/popup/usePopup";
import { Button } from "./Button";

export type PopupButtonRef = {
  /** Shows the associated popup with the button as the target. */
  show(): void;
  /** Hides the associated popup. */
  hide(): void;
};

/**
 * A button that renders a down arrow icon to indicate that it opens a popup
 * menu.
 */
export function PopupButton({
  ref,
  popupRef,
  children,
  popup,
  hideDisclosure = false,
  ...rest
}: Parameters<typeof Button>[0] & {
  popupRef?: RefObject<PopupButtonRef | null>;
  popup: Popup<[]> | null;
  hideDisclosure?: boolean;
}) {
  const backupRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(popupRef, () => ({
    show() {
      popup?.show(ref ?? backupRef);
    },
    hide() {
      popup?.hide();
    },
  }));

  const resolvedChildren = (() => {
    if (children) {
      return (
        <>
          {children}
          {!hideDisclosure && <DownArrowIcon className="down-arrow" />}
        </>
      );
    } else if (!hideDisclosure) {
      return <DownArrowIcon className="down-arrow" />;
    }
    return null;
  })();

  return (
    <StyledPopupButton
      {...rest}
      ref={ref ?? backupRef}
      onClick={popup?.onClick ?? rest.onClick}
      data-is-open={popup?.visible}
      children={resolvedChildren}
    />
  );
}

export const StyledPopupButton = styled(Button)`
  > .down-arrow {
    width: 20px;
    height: 20px;
    margin-left: 4px;
    margin-right: -5px;
  }

  &[data-is-open="true"] > .down-arrow {
    transform: rotate(180deg);
  }
`;
