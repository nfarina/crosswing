import React from "react";
import { styled } from "styled-components";
import { formatCurrency } from "../../shared/numeric";
import { NumberLabel } from "./NumberLabel";

export function CurrencyLabel({ ...rest }: Parameters<typeof NumberLabel>[0]) {
  return <StyledCurrencyLabel formatter={formatCurrency} {...rest} />;
}

export const StyledCurrencyLabel = styled(NumberLabel)``;
