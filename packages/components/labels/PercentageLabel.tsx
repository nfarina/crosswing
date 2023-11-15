import { formatPercentage } from "@crosswing/shared/numeric";
import { styled } from "styled-components";
import { NumberLabel } from "./NumberLabel";

export function PercentageLabel({
  ...rest
}: Parameters<typeof NumberLabel>[0]) {
  return <StyledPercentageLabel formatter={formatPercentage} {...rest} />;
}

export const StyledPercentageLabel = styled(NumberLabel)``;
