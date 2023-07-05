// String utility functions that I didn't want to incorporate all of lodash
// to get.

export interface CapitalizeOptions {
  allWords?: boolean;
}

export function capitalize(
  s: string,
  { allWords }: CapitalizeOptions = {},
): string {
  if (allWords) {
    return s
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");
  } else {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export function truncate(
  s: string,
  {
    length = 30,
    omission = "…",
  }: {
    length?: number;
    omission?: string;
  } = {},
): string {
  if (s && s.length > length) {
    return s.substr(0, length - 1).trimEnd() + omission;
  } else {
    return s;
  }
}

export function makePosessive(s: string): string {
  if (s.endsWith("'s") || s.endsWith("’s")) {
    return s; // Roscoe's -> Roscoe's
  } else if (s.endsWith("s")) {
    return s.trimEnd() + "'"; // Bob's Burgers -> Bob's Burgers'
  } else {
    return s.trimEnd() + "'s"; // Enlight -> Enlight's
  }
}

export function joinWith(
  items: string[],
  { trailing, quotes }: { trailing: string; quotes?: boolean | string },
): string {
  const quote =
    typeof quotes === "string" ? quotes : quotes === true ? '"' : null;

  if (quote) {
    items = items.map((item) => `${quote}${item}${quote}`);
  }

  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${trailing} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${trailing} ${
    items[items.length - 1]
  }`;
}

/**
 * Given a list of "items" like ["Apples", "Bananas", "Oranges"],
 * returns a string like "Apples, Bananas, and Oranges".
 * If there are only two items, returns "Apples and Bananas".
 */
export function joinWithAnd(
  items: string[],
  { quotes }: { quotes?: boolean | string } = {},
): string {
  return joinWith(items, { trailing: "and", quotes });
}

/**
 * Given a list of "items" like ["Apples", "Bananas", "Oranges"],
 * returns a string like "Apples, Bananas, or Oranges".
 * If there are only two items, returns "Apples or Bananas".
 */
export function joinWithOr(
  items: string[],
  { quotes }: { quotes?: boolean | string },
): string {
  return joinWith(items, { trailing: "or", quotes });
}

export function camelCaseToSentence(str: string): string {
  return capitalize(str)
    .replace(/([A-Z])/g, " $1")
    .trim();
}
