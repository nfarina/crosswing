import { safeArea } from "@cyber/host/plugins/SafeArea";
import { NavLayout } from "@cyber/router/navs";
import React from "react";
import { styled } from "styled-components";
import { Button, StyledButton } from "../Button.js";
import { CalendarView, StyledCalendarInput } from "./CalendarView.js";
import { dateRange } from "./DateRange.js";

export function DatePicker({
  defaultDate,
  onClose,
  onDateSelected,
}: {
  defaultDate?: number | null;
  onClose: () => void;
  onDateSelected?: (date: number | null) => void;
}) {
  function onDateClick(date: number | null) {
    const range = date ? dateRange(date)?.start : null;
    onDateSelected?.(range);
    onClose();
  }

  function onClearClick() {
    onDateSelected?.(null);
    onClose();
  }

  return (
    <NavLayout
      title="Select Date"
      left={{ title: "Cancel", back: true, onClick: onClose }}
    >
      <PageLayout>
        <Button children="Clear" onClick={onClearClick} />
        <CalendarView
          selectedRange={defaultDate ? dateRange(defaultDate) : null}
          onDateClick={onDateClick}
        />
      </PageLayout>
    </NavLayout>
  );
}

const PageLayout = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledButton} {
    margin: 10px 10px 0;
  }

  > ${StyledCalendarInput} {
    flex-grow: 1;
    padding: 0 10px;
    padding-bottom: calc(20px + ${safeArea.bottom()});
  }
`;
