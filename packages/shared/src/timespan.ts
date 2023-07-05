//
// Just some functions to make working with time spans easier and more concise.
//

// This looks like a lot of code, but it "compresses" down a ton after all the
// types are removed.

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

export function Seconds(seconds: number): number;
export function Seconds(seconds: number | null): number | null;
export function Seconds(seconds: number | undefined): number | undefined;
export function Seconds(
  seconds: number | null | undefined,
): number | null | undefined;
export function Seconds(
  seconds: number | null | undefined,
): number | null | undefined {
  return seconds != null ? seconds * ONE_SECOND : seconds;
}

export function Minutes(minutes: number): number;
export function Minutes(minutes: number | null): number | null;
export function Minutes(minutes: number | undefined): number | undefined;
export function Minutes(
  minutes: number | null | undefined,
): number | null | undefined;
export function Minutes(
  minutes: number | null | undefined,
): number | null | undefined {
  return minutes != null ? minutes * ONE_MINUTE : minutes;
}

export function Hours(hours: number): number;
export function Hours(hours: number | null): number | null;
export function Hours(hours: number | undefined): number | undefined;
export function Hours(
  hours: number | null | undefined,
): number | null | undefined;
export function Hours(
  hours: number | null | undefined,
): number | null | undefined {
  return hours != null ? hours * ONE_HOUR : hours;
}

export function Days(days: number): number;
export function Days(days: number | null): number | null;
export function Days(days: number | undefined): number | undefined;
export function Days(
  days: number | null | undefined,
): number | null | undefined;
export function Days(
  days: number | null | undefined,
): number | null | undefined {
  return days != null ? days * ONE_DAY : days;
}

export function Weeks(weeks: number): number;
export function Weeks(weeks: number | null): number | null;
export function Weeks(weeks: number | undefined): number | undefined;
export function Weeks(
  weeks: number | null | undefined,
): number | null | undefined;
export function Weeks(
  weeks: number | null | undefined,
): number | null | undefined {
  return weeks != null ? weeks * ONE_WEEK : weeks;
}

/**
 * Given an amount of milliseconds, returns a string roughly approximating the
 * duration, like "36 minutes", "2 hours", "1 day", "2 years".
 */
export function formatTimeSpan(ms: number): string {
  const pluralize = (num: number, unit: string) => {
    const rounded = Math.floor(num);
    return rounded === 1 ? `${rounded} ${unit}` : `${rounded} ${unit}s`;
  };

  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  // We generally work with time spans that are a whole number of units.

  if (weeks >= 1 && weeks === Math.round(weeks)) {
    return pluralize(weeks, "week");
  }

  if (days >= 1 && days === Math.round(days)) {
    return pluralize(days, "day");
  }

  if (hours >= 1 && hours === Math.round(hours)) {
    return pluralize(hours, "hour");
  }

  if (minutes >= 1 && minutes === Math.round(minutes)) {
    return pluralize(minutes, "minute");
  }

  if (seconds >= 1 && seconds === Math.round(seconds)) {
    return pluralize(seconds, "second");
  }

  // Maybe at this point we do an "about XYZ days" type thing?

  return pluralize(ms, "millisecond");
}
