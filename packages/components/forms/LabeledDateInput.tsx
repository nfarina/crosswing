import { useSheet } from "@crosswing/modals/sheet";
import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { Timestamp } from "../labels/Timestamp";
import { DatePicker } from "./DatePicker";
import { TextCell } from "./TextCell";

/**
 * Renders a date that the user can change, with a label.
 */
export function LabeledDateInput({
  label,
  value,
  onValueChange,
  placeholder = "Not Set",
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  label?: ReactNode;
  value?: number | null;
  onValueChange?: (value: number | null) => void;
  hideDisclosure?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const datePicker = useSheet(() => (
    <DatePicker
      defaultDate={value}
      onDateSelected={onValueChange}
      onClose={datePicker.hide}
    />
  ));

  return (
    <StyledLabeledDateInput
      label={label}
      title={
        value ? <Timestamp date={value} format="MMM D, YYYY" /> : placeholder
      }
      data-no-date={!value}
      onClick={datePicker.show}
      {...rest}
    />
  );
}

export const StyledLabeledDateInput = styled(TextCell)`
  &[data-no-date="true"] {
    > .content {
      > .title {
        opacity: 0.5;
      }
    }
  }
`;
