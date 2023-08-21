import React from "react";
import { styled } from "styled-components";
import { formatPercentage } from "../../shared/numeric";
import { NumberLabel } from "./NumberLabel";

export function PercentageLabel({
  ...rest
}: Parameters<typeof NumberLabel>[0]) {
  return <StyledPercentageLabel formatter={formatPercentage} {...rest} />;
}

export const StyledPercentageLabel = styled(NumberLabel)``;
