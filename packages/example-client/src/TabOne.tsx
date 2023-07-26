import { NoContent } from "@cyber/components/NoContent";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React from "react";
import { styled } from "styled-components";

export default function TabOne() {
  return <NoContent title="Page One" />;
}

export const StyledPageTwo = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: ${colors.mediumGray()};
  font: ${fonts.display({ size: 14 })};
`;
