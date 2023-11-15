import { colors } from "@crosswing/theme/colors";
import { fonts } from "@crosswing/theme/fonts";
import { styled } from "styled-components";
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
