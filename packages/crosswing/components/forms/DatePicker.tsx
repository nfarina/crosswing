import { ReactNode } from "react";
import { styled } from "styled-components";
import { safeArea } from "../../host/features/safeArea";
import { NavLayout } from "../../router/navs/NavLayout";
import { Button, StyledButton } from "../Button";
import { Notice } from "../Notice";
import { dateTransformer } from "../transformers/dateTransformer";
import { CalendarView, StyledCalendarView } from "./CalendarView.js";
import { dateRange } from "./DateRange.js";
import { usePrompt } from "./usePrompt";

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
  const customPrompt = usePrompt(() => ({
    title: "Enter Date",
    placeholder: "Ex: 1/1/2020",
    transformer: dateTransformer(),
    initialValue: defaultDate ?? undefined,
    onSubmit: (date: number) => {
      onDateSelected?.(date);
      onClose();
    },
  }));

  function onDateClick(date: number | null) {
    // Use dateRange() helper to get a full 24-hour day.
    const day = date ? dateRange(date)?.start : null;
    onDateSelected?.(day);
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
        <div className="buttons">
          {!requireSelection && <Button title="Clear" onClick={onClearClick} />}
          <Button title="Custom" onClick={customPrompt.show} />
        </div>
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

  > .buttons {
    margin: 10px 10px 0;
    display: flex;
    flex-flow: row;

    > ${StyledButton} {
      width: 0;
      flex-grow: 1;
    }

    > * + * {
      margin-left: 10px;
    }
  }

  > ${StyledCalendarView} {
    flex-grow: 1;
    padding: 0 10px;
    padding-bottom: calc(20px + ${safeArea.bottom()});
  }
`;
