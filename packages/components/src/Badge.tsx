import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { styled } from "styled-components";

/**
 * A basic sort of badge that looks nice on <TextCell> and friends.
 */
export const Badge = styled.div`
  font: ${fonts.displayBold({ size: 14, line: "22px" })};
  border-radius: 6px;
  padding: 1px 10px;
  background: ${colors.lightGray()};
  color: ${colors.text()};
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraDarkGray()};
    color: ${colors.extraLightGray()};
  }
`;