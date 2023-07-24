import { formatPercentage } from "@cyber/shared/numeric";
import React from "react";
import { styled } from "styled-components";
import { NumberLabel } from "./NumberLabel.js";

export function PercentageLabel({
  ...rest
}: Parameters<typeof NumberLabel>[0]) {
  return <StyledPercentageLabel formatter={formatPercentage} {...rest} />;
}

export const StyledPercentageLabel = styled(NumberLabel)``;