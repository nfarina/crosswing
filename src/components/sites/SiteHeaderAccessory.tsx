import React, { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { UnreadBadge } from "../../router/tabs/UnreadBadge";
import { colors } from "../../theme/colors/colors";
import { Clickable } from "../Clickable";

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
};

export function SiteHeaderAccessoryView({
  accessory,
  ...rest
}: HTMLAttributes<HTMLButtonElement> & {
  accessory: SiteHeaderAccessory;
}) {
  const { icon, iconSize = ["24px", "24px"], unread, onClick } = accessory;

  const [width, height] = iconSize;

  return (
    <StyledSiteHeaderAccessoryView onClick={onClick} {...rest}>
      <div style={{ width, height }} className="popup-target">
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

      * {
        fill: ${colors.text()};
      }
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
