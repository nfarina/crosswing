import { InputTransformer } from "crosswing/components/forms/useInputValue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utcPlugin from "dayjs/plugin/utc.js";
import { DateRange } from "../forms/DateRange";

dayjs.extend(utcPlugin);
dayjs.extend(customParseFormat);

/**
 * Works with date ranges in a known format, optionally in UTC.
 */
export function dateRangeTransformer({
  formats = ["M/D/YYYY", "M/D/YY"],
  splitChars = [" ", "-", "–", "to"],
  utc,
}: {
  formats?: string[];
  splitChars?: string[];
  utc?: boolean;
} = {}): InputTransformer<DateRange> {
  return {
    parse(text: string) {
      if (!text) {
        return null;
      }

      let start: number | null = null;
      let end: number | null = null;

      for (const splitChar of splitChars) {
        const parts = text.split(splitChar).filter((p) => p.trim());

        if (parts.length === 2) {
          const maybeStart = parseDate(parts[0].trim());
          const maybeEnd = parseDate(parts[1].trim());

          if (maybeStart && maybeEnd) {
            start = maybeStart;
            end = maybeEnd;
            break;
          }
        }
      }

      function parseDate(text: string): number | null {
        for (const format of formats) {
          const maybeDate = utc ? dayjs.utc(text, format) : dayjs(text, format);

          if (maybeDate.isValid()) {
            return maybeDate.valueOf();
          }
        }

        return null;
      }

      // Still invalid?
      if (!start || !end) {
        throw new Error("Invalid date range");
      }

      if (start > end) {
        throw new Error("Start is after end");
      }

      return { start, end };
    },
    format(value: DateRange | null) {
      if (value === null) return "";

      // Use the first format in the list, or a fallback.
      const format = formats[0] ?? "M/D/YYYY";

      if (utc) {
        return `${dayjs.utc(value.start).format(format)} - ${dayjs
          .utc(value.end)
          .format(format)}`;
      } else {
        return `${dayjs(value.start).format(format)} - ${dayjs
          .utc(value.end)
          .format(format)}`;
      }
    },
  };
}
