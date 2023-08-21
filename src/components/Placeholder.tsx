import React from "react";
import { styled } from "styled-components";
import { Link } from "../router/Link";
import { colors, shadows } from "../theme/colors/colors";
import { fonts } from "../theme/fonts";

/**
 * Just a useful component to use during development, to put something on the
 * screen quickly that isn't distractingly-ugly.
 */
export function Placeholder({
  ...rest
}: Record<string, any> & Parameters<typeof Link>[0]) {
  return <StyledPlaceholder {...rest} />;
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
