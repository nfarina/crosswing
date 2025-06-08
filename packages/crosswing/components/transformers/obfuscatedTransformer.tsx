import { InputTransformer } from "../forms/useInputValue";

/**
 * Obfuscates a string by replacing the middle portion with asterisks.
 * Useful for API keys.
 */
export function obfuscatedTransformer(): InputTransformer<string> {
  return {
    parse: (text) => text,
    format: (value) => value ?? "",
    display(value: string) {
      if (value === null) return "";

      // Keep the first 4 and last 4 characters, and replace the middle with asterisks.
      return value.slice(0, 4) + "•••••••••••" + value.slice(-4);
    },
  };
}
