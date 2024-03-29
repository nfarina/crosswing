import { keyframes, styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { easing } from "../../shared/easing.js";

/**
 * We want to fade in on a delay when visible, for two reasons. First,
 * the fade is a nice effect. But second, if you're viewing the content that
 * would otherwise clear the badge, there might be a flicker as the badge
 * pops in (due to unread state from Firestore) then disappears (due to actions
 * of ClearUnreadView). The delay fixes that.
 */
const fadeIn = keyframes`
  from, 60% {
    opacity: 0;
  }
`;

export const UnreadBadge = styled.div`
  box-sizing: border-box;
  min-width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font: ${fonts.displayBold({ size: 10, line: "10px" })};
  color: ${colors.white()};
  background: ${colors.red()};
  border: 1px solid ${colors.white()};
  padding: 0 2px 1px 2px;
  border-radius: 9999px;
  animation: ${fadeIn} 1s ${easing.outQuint};
`;
