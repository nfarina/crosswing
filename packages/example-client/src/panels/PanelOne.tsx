import { Placeholder } from "@cyber/components/Placeholder";
import { colors } from "@cyber/theme/colors";
import React from "react";

export default function PanelOne({}: any) {
  return (
    <Placeholder style={{ background: colors.purple(), color: colors.white() }}>
      Panel One
    </Placeholder>
  );
}
