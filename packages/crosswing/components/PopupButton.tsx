import { styled } from "styled-components";
import { DownArrowIcon } from "../icons/DownArrow";
import { Popup } from "../modals/popup/usePopup";
import { Button } from "./Button";

/**
 * A button that renders a down arrow icon to indicate that it opens a popup
 * menu.
 */
export function PopupButton({
  children,
  popup,
  ...rest
}: Parameters<typeof Button>[0] & {
  popup: Popup<[]>;
}) {
  return (
    <StyledPopupButton
      {...rest}
      onClick={popup.onClick}
      data-is-open={popup.visible}
    >
      <div className="text">{children}</div>
      <DownArrowIcon className="down-arrow" />
    </StyledPopupButton>
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
