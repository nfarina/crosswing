import {
  FormatNumberOptions,
  formatNumber,
  parseNumber,
} from "@cyber/shared/numeric";
import { InputTransformer } from "../values/useInputValue.js";

/**
 * Handles entering of numeric values in a text input that are stored as
 * integers.
 */
export function numericTransformer({
  allowZero = false,
  dropZeros = "none",
  ...formatOptions
}: FormatNumberOptions & {
  /** True to allow the user to enter zero as a value; otherwise zero will be coerced to null. */
  allowZero?: boolean;
} = {}) {
  // A forgiving number parsing function.
  function parse(text: string): number | null {
    const trimmed = text.trim();

    // If the text is empty or contains only "-" or prefix/suffix characters,
    // then you're still typing something and we'll return a null (empty) value.
    const { prefix, suffix } = formatOptions;
    const unfinished = [
      "",
      "-",
      prefix,
      suffix,
      "-" + prefix,
      prefix + "-",
      ",",
    ];

    if (trimmed === "" || unfinished.includes(trimmed)) {
      return allowZero ? 0 : null;
    }

    const parsed = parseNumber(text, { dropZeros, ...formatOptions });

    if (Number.isNaN(parsed)) {
      throw new Error("Invalid");
    } else if (!allowZero && parsed === 0) {
      return null;
    } else {
      return parsed;
    }
  }

  function format(value: number | null): string {
    if (value === null) {
      return "";
    }

    if (!allowZero && value === 0) {
      return ""; // Zero is treated as "no value".
    }

    // Return a value that's friendly for editing (prefix/suffix would just
    // get in the way).
    return formatNumber(value, {
      ...formatOptions,
      dropZeros: dropZeros !== "none" ? dropZeros : "all",
      commas: false,
      prefix: "",
      suffix: "",
    });
  }

  function display(value: number | null): string {
    if (value === null) {
      return "";
    }

    // Format it the way you want it.
    return formatNumber(value, { dropZeros, ...formatOptions });
  }

  // Don't cast the return type as an InputTransformer, instead return
  // our concrete type which includes display() as a non-optional method.
  return { parse, format, display } satisfies InputTransformer<number>;
}
