import { ReactNode } from "react";
import { styled } from "styled-components";
import { safeArea } from "../../host/features/safeArea";
import { NavLayout } from "../../router/navs/NavLayout";
import { Button, StyledButton } from "../Button";
import { Notice } from "../Notice";
import { CalendarView, StyledCalendarView } from "./CalendarView.js";
import { dateRange } from "./DateRange.js";

export function DatePicker({
  defaultDate,
  onClose,
  onDateSelected,
  requireSelection = false,
  title = "Select Date",
  subtitle,
  notice,
}: {
  defaultDate?: number | null;
  onClose: () => void;
  onDateSelected?: (date: number | null) => void;
  requireSelection?: boolean;
  title?: string;
  subtitle?: string;
  notice?: ReactNode;
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
      title={title}
      subtitle={subtitle}
      left={{ title: "Cancel", back: true, onClick: onClose }}
    >
      <PageLayout>
        {notice && <Notice children={notice} size="smaller" />}
        {!requireSelection && (
          <Button children="Clear" onClick={onClearClick} />
        )}
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

  > ${StyledCalendarView} {
    flex-grow: 1;
    padding: 0 10px;
    padding-bottom: calc(20px + ${safeArea.bottom()});
  }
`;
