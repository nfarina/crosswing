import { useMatchMedia } from "./useMatchMedia";

/**
 * Returns true if the user prefers a dark UI.
 */
export function usePrefersDarkMode(): boolean {
  return useMatchMedia("(prefers-color-scheme: dark)");
}
