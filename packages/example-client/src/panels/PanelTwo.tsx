import { Placeholder } from "@cyber/components/Placeholder";
import { colors } from "@cyber/theme/colors";
import React from "react";

export default function PanelTwo({}: any) {
  return (
    <Placeholder
      style={{ background: colors.darkBlue(), color: colors.white() }}
    >
      Panel Two
    </Placeholder>
  );
}
