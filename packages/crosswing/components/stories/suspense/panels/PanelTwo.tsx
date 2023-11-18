import { colors } from "../../../../theme/colors/colors";
import { StyledPanel } from "./PanelOne";

export default function PanelTwo({}: any) {
  return (
    <StyledPanel
      style={{ background: colors.darkBlue(), color: colors.white() }}
    >
      Two
    </StyledPanel>
  );
}
