import { copyToClipboard } from "./ipc.js";
import { HostFeatures } from "./types.js";

export interface HostClipboard {
  copy: (text: string) => void;
}

// Cached.
let inputEl: HTMLTextAreaElement | null = null;

export function useClipboard(features?: HostFeatures | undefined) {
  if (features?.clipboard) {
    // Our host supports it!
    return { copy: copyToClipboard };
  } else {
    // Do it old-school.
    if (!inputEl) {
      inputEl = document.createElement("textarea");
      inputEl.style.position = "absolute";
      inputEl.style.left = "-9999px";
      inputEl.style.top = "0";
      inputEl.id = "copy-to-clipboard-helper";
      inputEl.setAttribute("aria-hidden", "true"); // Ignore screen readers.
      inputEl.tabIndex = -1; // Prevent tab focus.

      document.body.appendChild(inputEl);
    }

    return { copy: browserCopy };
  }
}

function browserCopy(text: string) {
  if (!inputEl) return;

  // https://www.sitepoint.com/javascript-copy-to-clipboard/
  inputEl.value = text;
  inputEl.select();
  document.execCommand("copy");
  inputEl.blur();
}
