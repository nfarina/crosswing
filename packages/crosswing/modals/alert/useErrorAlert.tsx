import { Modal } from "../context/useModal";
import { useAlert } from "./useAlert.js";

export type ErrorHandler = (error: Error | string) => void;

export function useErrorAlert({
  onClose,
}: { onClose?: () => void } = {}): Modal<Parameters<ErrorHandler>> {
  function getMessage(error?: Error | string) {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return ensurePeriod(error.message);
    } else {
      return "Something went wrong.";
    }
  }

  return useAlert((error?: Error | string) => ({
    title: "Error",
    message: getMessage(error),
    onClose,
  }));
}

function ensurePeriod(str: string): string {
  str = str.trim();
  // Add a period if the string doesn't end with a period, question mark, or exclamation point.
  if (!/[.!?]$/.test(str)) {
    str += ".";
  }
  return str;
}
