import dayjs from "dayjs";
import { useRef } from "react";
import { styled } from "styled-components";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts/fonts";
import { Button, StyledButton } from "../Button";
import { CalendarView, StyledCalendarInput } from "./CalendarView";
import {
    AllDateRangePresets,
    DateRange,
    areDateRangesEqual,
    dateRange,
    isSameDay,
} from "./DateRange";

export default function DateRangeControl({
  value,
  onValueChange,
  hidePresets,
}: {
  value: DateRange | null;
  onValueChange: (newValue: DateRange | null, isPreset?: boolean) => void;
  hidePresets?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onCalendarDateClick(date: number) {
    const clickedRange = dateRange(date);

    // If you clicked the a single date that is already selected,
    // deselect the range.
    if (areDateRangesEqual(clickedRange, value)) {
      onValueChange(null);
    }
    // If you clicked a date after the one that's selected, and the existing
    // range is just one day, then extend the range.
    else if (value && isSameDay(value) && clickedRange.start > value.end) {
      const start = dayjs(value.start).startOf("day").valueOf(); // Important to also extend the start date, because it could be in the middle of the day, but visually we're telling you that whole days are selected.
      const end = dayjs(clickedRange.start).endOf("day").valueOf();
      onValueChange(dateRange(start, end));
    }
    // Just select the exact range you selected.
    else {
      onValueChange(clickedRange);
    }
  }

  function onCalendarMonthClick(date: number) {
    const start = dayjs(date).startOf("month").valueOf();
    const end = dayjs(date).endOf("month").valueOf();
    onValueChange(dateRange(start, end));
  }

  const layout = useResponsiveLayout(ref, {
    mobile: {},
    desktop: { minWidth: 500 },
  });

  return (
    <StyledDateRangeControl
      ref={ref}
      data-layout={layout}
      data-hide-presets={!!hidePresets}
    >
      <CalendarView
        selectedRange={value}
        onDateClick={onCalendarDateClick}
        onMonthClick={onCalendarMonthClick}
      />
      <div className="separator" />
      <div className="presets">
        <Button children="Clear" onClick={() => onValueChange(null, true)} />
        {!hidePresets &&
          AllDateRangePresets.map((preset) => (
            <Button
              key={preset.title}
              children={preset.title}
              onClick={() => onValueChange(preset.range(), true)}
            />
          ))}
      </div>
    </StyledDateRangeControl>
  );
}

export const StyledDateRangeControl = styled.div`
  display: flex;
  flex-flow: row;

  > ${StyledCalendarInput} {
    padding: 0 10px;
  }

  > .separator {
    width: 1px;
    margin: 10px 0;
    background: ${colors.separator()};
  }

  > .presets {
    padding: 10px;
    display: flex;
    flex-flow: column;
    overflow-y: auto;

    > * {
      flex-shrink: 0;
      flex-grow: 1;
      max-height: 40px;
    }

    > * + * {
      margin-top: 10px;
    }

    > ${StyledButton} {
      font: ${fonts.displayMedium({ size: 14 })};
    }
  }

  /* Mobile layout. */
  &[data-layout="mobile"] {
    flex-direction: column-reverse;

    > .presets {
      overflow: unset;
      padding-bottom: 0;
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 1fr 1fr 1fr;

      > * {
        min-height: 40px;
      }

      > * + * {
        margin-top: unset;
      }
    }

    > .separator {
      display: none;
    }
  }

  &[data-layout="mobile"][data-hide-presets="true"] {
    > .presets {
      grid-template-columns: 1fr;
    }
  }
`;
