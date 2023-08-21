import React from "react";
import { styled } from "styled-components";
import { colors } from "../../../../theme/colors/colors";
import { fonts } from "../../../../theme/fonts";
import { Placeholder } from "../../../Placeholder";

export default function PanelOne({}: any) {
  return (
    <StyledPanel style={{ background: colors.purple(), color: colors.white() }}>
      One
    </StyledPanel>
  );
}

export const StyledPanel = styled(Placeholder)`
  font: ${fonts.numericBlack({ size: 54 })};
`;
