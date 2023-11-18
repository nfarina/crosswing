import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import { HTMLAttributes, ReactNode, useLayoutEffect, useRef } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { DateRange, isDateInRange, isSameDay } from "./DateRange";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function CalendarView({
  selectedRange,
  onDateClick,
  onMonthClick,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  selectedRange?: DateRange | null;
  onDateClick?: (date: number) => void;
  onMonthClick?: (date: number) => void;
}) {
  const calendarRef = useRef<HTMLTableElement | null>(null);

  // useElementSize(calendarRef, (size) => {
  //   const { current: calendar } = calendarRef;
  //   if (!calendar) return;

  //   // Get the size of a row of dates.
  //   const row = calendar.querySelector("tr.week");

  //   const rowHeight = row?.getBoundingClientRect().height;
  //   calendar.setAttribute("data-row-height", rowHeight?.toString() ?? "");
  // });

  useLayoutEffect(() => {
    // When mounted in Storybook, our rects will be 0,0,0,0, so we need to wait a tic.
    requestAnimationFrame(() => {
      // Scroll to the start date on initial load.
      const calendar = calendarRef.current;
      if (!calendar) return;

      // Scroll to now if startDate is empty.
      const monthName = dayjs(selectedRange?.start || undefined)
        .startOf("month")
        .toISOString();
      const month = calendar.querySelector(`[data-month="${monthName}"]`);
      month?.scrollIntoView();

      const thead = calendar.querySelector("thead");
      calendar.scrollTop -= thead!.offsetHeight - 10;
    });
  }, []);

  function renderMonths(): ReactNode[] {
    const fromDate = dayjs().subtract(2, "years").startOf("year");
    const toDate = dayjs().add(2, "years").endOf("year");

    const months: ReactNode[] = [];
    let currentDate = fromDate;
    while (currentDate.isSameOrBefore(toDate)) {
      months.push(renderMonth(currentDate));
      currentDate = currentDate.add(1, "month");
    }
    return months;
  }

  function renderMonth(date: dayjs.Dayjs): ReactNode[] {
    const rows: ReactNode[] = [];

    // Render the name of the month first.
    rows.push(
      <tr
        className="month-name"
        data-month={date.toISOString()}
        data-is-month-clickable={!!onMonthClick}
        key={date.format("YYYY-MM")}
        onClick={onMonthClick ? () => onMonthClick(date.valueOf()) : undefined}
      >
        <th colSpan={7}>{date.format("MMMM YYYY")}</th>
      </tr>,
    );

    // Get the first and last day of this month.
    const firstDay = date.startOf("month");
    const lastDay = date.endOf("month");

    let currentDay = firstDay;

    while (currentDay.startOf("week").isSameOrBefore(lastDay)) {
      rows.push(
        <tr className="week" key={currentDay.format("YYYY-MM-DD")}>
          {renderWeek(currentDay.startOf("week"), firstDay)}
        </tr>,
      );

      currentDay = currentDay.add(1, "week");
    }

    return rows;
  }

  function renderWeek(date: dayjs.Dayjs, month: dayjs.Dayjs): ReactNode[] {
    const week: ReactNode[] = [];

    const firstDay = month.startOf("month");
    const lastDay = month.endOf("month");

    // Render the days of the week.
    for (let i = 0; i < 7; i++) {
      const day = date.add(i, "day");
      // Render an invisible cell if the day is not in this month.
      if (day.isBefore(firstDay) || day.isAfter(lastDay)) {
        week.push(
          <td
            data-date={date.valueOf()}
            data-day={day.valueOf()}
            data-is-before={day.isBefore(firstDay) && firstDay.valueOf()}
            data-is-after={day.isAfter(lastDay) && lastDay.valueOf()}
            key={day.format("YYYY-MM-DD")}
          />,
        );
      } else {
        week.push(renderDay(day));
      }
    }

    return week;
  }

  function renderDay(date: dayjs.Dayjs): ReactNode {
    const isInsideRange =
      selectedRange &&
      !isSameDay(selectedRange) &&
      isDateInRange(date.valueOf(), selectedRange);

    const isRangeEndcap =
      selectedRange &&
      (date.isSame(selectedRange.start, "day") ||
        date.isSame(selectedRange.end, "day"));

    const isRangeStart =
      !!selectedRange && date.isSame(selectedRange.start, "day");
    const isRangeEnd = !!selectedRange && date.isSame(selectedRange.end, "day");

    return (
      <td
        key={date.format("YYYY-MM-DD")}
        className="day"
        onClick={() => onDateClick?.(date.valueOf())}
        data-is-today={date.isSame(dayjs(), "day")}
        data-is-inside-range={!!isInsideRange}
        data-is-range-endcap={!!isRangeEndcap}
        data-is-range-start={!!isRangeStart}
        data-is-range-end={!!isRangeEnd}
      >
        <div className="range-inner" />
        <div className="range-endcap" />
        <div className="number">{date.format("D")}</div>
      </td>
    );
  }

  return (
    <StyledCalendarInput ref={calendarRef} {...rest}>
      <table>
        <thead>
          <tr>
            <th>Su</th>
            <th>Mo</th>
            <th>Tu</th>
            <th>We</th>
            <th>Th</th>
            <th>Fr</th>
            <th>Sa</th>
          </tr>
        </thead>
        <tbody>{renderMonths()}</tbody>
      </table>
    </StyledCalendarInput>
  );
}

export const StyledCalendarInput = styled.div`
  overflow-y: auto;
  background: ${colors.textBackground()};

  > table {
    width: 100%;
    border-collapse: collapse;
    isolation: isolate;

    > thead {
      position: sticky;
      inset-block-start: 0; /* "top" */

      /* "&" works in Chrome, the other works in Safari */
      &,
      > tr > th {
        background: ${colors.textBackground()};
        z-index: 5;
      }

      > tr {
        > th {
          margin: 0;
          font: ${fonts.displayMedium({ size: 13 })};
          color: ${colors.textSecondary()};
          padding: 20px 0 10px;
        }
      }
    }

    > tbody {
      > tr.month-name > th {
        text-align: left;
        padding: 30px 10px 10px;
        font: ${fonts.displayBold({ size: 17 })};
        color: ${colors.text()};
      }

      > tr.month-name[data-is-month-clickable="true"] > th {
        cursor: pointer;
      }

      > tr.week {
        > td {
          padding: 0;
          margin: 0;
          height: 42px; /* Fixed row height makes selected states much easier. */
        }

        > td.day {
          cursor: pointer;
          position: relative;

          > .range-inner {
            position: absolute;
            top: 3px;
            left: 3px;
            width: calc(100% - 6px);
            height: calc(100% - 6px);
          }

          > .range-endcap {
            position: absolute;
            top: 3px;
            left: calc(50% - (42px - 6px) / 2);
            width: calc(42px - 6px);
            height: calc(100% - 6px);
          }

          &[data-is-inside-range="true"] > .range-inner {
            left: 0;
            width: 100%;
            background: ${colors.text({ alpha: 0.1 })};
            z-index: 1;
          }

          &[data-is-range-endcap="true"] > .range-endcap {
            background: ${colors.text()};
            border-radius: 9999px;
            z-index: 2;
          }

          &:first-of-type > .range-inner {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }

          &:last-of-type > .range-inner {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }

          &[data-is-range-start="true"] > .range-inner {
            left: 50%;
            width: 50%;
          }

          &[data-is-range-end="true"] > .range-inner {
            border-top-right-radius: 100%;
            border-bottom-right-radius: 100%;
            right: 50%;
            width: 50%;
          }

          > .number {
            position: relative;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            box-sizing: border-box;
            min-height: 42px;
            width: 42px;
            font: ${fonts.displayMedium({ size: 15, line: "1" })};
            color: ${colors.text()};
            z-index: 3;
          }

          &[data-is-today="true"] {
            > .number {
              color: ${colors.primary()};
            }
          }

          &[data-is-range-endcap="true"] {
            > .number {
              color: ${colors.textBackground()};
            }
          }
        }
      }
    }
  }
`;
