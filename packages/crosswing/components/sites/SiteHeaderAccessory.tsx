import { HTMLAttributes, MouseEvent, ReactNode, RefObject } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { UnreadBadge } from "../../router/tabs/UnreadBadge.js";
import { Clickable } from "../Clickable.js";

export type SiteHeaderAccessory = {
  icon: ReactNode;
  iconSize?: [string, string];
  /** Set a number to render an "unread items" badge. */
  unread?: number | null;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * On larger screens, accessories will always be in the top nav. On smaller
   * screens, you can elect to relocate the accessory to the sidebar. This is
   * appropriate for things like the "account button" which is rarely used.
   * Default is "nav".
   */
  mobilePlacement?: "nav" | "sidebar";
  /** True if you want to (temporarily?) hide this accessory. */
  hidden?: boolean;
  /**
   * An optional ref you can pass if you need access to the rendered element
   * that serves as the popup target (if you need to programatically open a
   * popup, for example).
   */
  popupTargetRef?: RefObject<HTMLDivElement>;
};

export function SiteHeaderAccessoryView({
  accessory,
  ...rest
}: HTMLAttributes<HTMLButtonElement> & {
  accessory: SiteHeaderAccessory;
}) {
  const {
    icon,
    iconSize = ["24px", "24px"],
    unread,
    onClick,
    popupTargetRef,
  } = accessory;

  const [width, height] = iconSize;

  return (
    <StyledSiteHeaderAccessoryView onClick={onClick} {...rest}>
      <div
        style={{ width, height }}
        ref={popupTargetRef}
        className="popup-target"
      >
        {icon}
      </div>
      {!!unread && <UnreadBadge>{unread}</UnreadBadge>}
    </StyledSiteHeaderAccessoryView>
  );
}

export const StyledSiteHeaderAccessoryView = styled(Clickable)`
  display: flex;
  flex-flow: row;
  position: relative;
  align-items: center;
  justify-content: center;

  > .popup-target {
    > svg {
      width: 100%;
      height: 100%;
      color: ${colors.text()};
    }
  }

  > ${UnreadBadge} {
    position: absolute;
    top: calc(50% - 16px);
    right: 0px;
    transform: scale(0.85);
    box-shadow: 0 0 0 3px ${colors.textBackground()};
  }
`;
