import { useSheet } from "@cyber/modals/sheet";
import React, { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { DateRangeLabel } from "../labels/DateRangeLabel.js";
import { DateRange } from "./DateRange.js";
import { DateRangePicker } from "./DateRangePicker.js";
import { TextCell } from "./TextCell.js";

/**
 * Renders a date range that the user can change, with a label.
 */
export function LabeledDateRangeInput({
  label,
  value,
  onValueChange,
  hideDisclosure,
  disabled,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  label?: ReactNode;
  value?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  hideDisclosure?: boolean;
  disabled?: boolean;
}) {
  const datePicker = useSheet(() => (
    <DateRangePicker
      defaultRange={value ?? null}
      onDateSelected={onValueChange}
      onClose={datePicker.hide}
    />
  ));

  return (
    <StyledLabeledDateRangeInput
      label={label}
      title={<DateRangeLabel range={value} emptyText="Not Set" />}
      data-no-date={!value}
      onClick={datePicker.show}
      {...rest}
    />
  );
}

export const StyledLabeledDateRangeInput = styled(TextCell)`
  &[data-no-date="true"] {
    > .content {
      > .title {
        opacity: 0.5;
      }
    }
  }
`;
