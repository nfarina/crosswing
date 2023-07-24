import { Link } from "@cyber/router/link";
import { colors, shadows } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { ReactNode } from "react";
import { styled } from "styled-components";

/**
 * Just a useful component to use during development, to put something on the
 * screen quickly that isn't distractingly-ugly.
 */
export function Placeholder({
  children,
}: Record<string, any> & { children?: ReactNode }) {
  return <StyledPlaceholder children={children} />;
}

export const StyledPlaceholder = styled(Link)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 10px;
  color: ${colors.darkGray()};
  font: ${fonts.display({ size: 14 })};
  box-shadow: ${shadows.cardSmall()}, ${shadows.cardBorder()};
  border-radius: 6px;
  text-decoration: none;
`;
