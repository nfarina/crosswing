import { RefObject, useEffect, useRef } from "react";

export const HotKeyContextDataAttributes = { "data-hotkey-context": true };

export type HotKeyOnPressHandler = () => boolean | void;

export type UseHotkeyOptions = {
  /**
   * The element on which this hotkey should be "bound". Used to control when
   * this hotkey triggers with respect to things like modals that may supercede
   * the hotkey if they've placed a HotKeyContextClassName on an ancestor
   * element. You can omit or pass `null` to always allow the hotkey to
   * trigger; this should be reserved for rare global hotkeys.
   */
  target?: RefObject<Element> | null;
  onPress?: HotKeyOnPressHandler;
  /** Set to true to disable handling this hotkey. */
  disabled?: boolean;
  /** Set to true to handle even single keypresses while inside an <input> mode. */
  alwaysFire?: boolean;
};

export function useHotkey(
  hotkey: string,
  handlerOrOptions: UseHotkeyOptions | HotKeyOnPressHandler,
) {
  const {
    target = null,
    onPress,
    disabled = false,
    alwaysFire = false,
  } = typeof handlerOrOptions === "function"
    ? { onPress: handlerOrOptions }
    : handlerOrOptions;

  const onPressCallback = useRef<(() => any) | null>(onPress ?? null);

  useEffect(() => {
    onPressCallback.current = onPress ?? null;
  });

  useEffect(() => {
    if (disabled) return;

    const parsed = parseHotkey(hotkey);

    function onKeyDown(event: KeyboardEvent) {
      const { key, ctrlKey, altKey, shiftKey, metaKey } = event;

      if (target && !target.current) {
        // You are intending to target a ref and it's null? Don't do anything.
        return;
      }

      const isMatch =
        parsed.key === key &&
        !!parsed.ctrlKey === !!ctrlKey &&
        !!parsed.altKey === !!altKey &&
        !!parsed.shiftKey === !!shiftKey &&
        !!parsed.metaKey === !!metaKey;

      // console.log(
      //   "Hotkey pressed:",
      //   formatHotkey(event, { originalCase: true }),
      // );

      if (!isMatch) {
        return;
      }

      // Is this a "naked" key?
      if (!ctrlKey && !altKey && !shiftKey && !metaKey) {
        if (!alwaysFire && !AlwaysFireOnKeys.includes(key)) {
          // Make sure you're not in a text entry context.
          if (
            event.target instanceof HTMLElement &&
            IgnoredElements.includes(event.target.tagName)
          ) {
            return;
          }

          // Make sure you're not in a contentEditable element!
          if (
            event.target instanceof HTMLElement &&
            event.target.isContentEditable
          ) {
            return;
          }
        }
      }

      // Did you specify a target, and if so, is it obscured by a modal or other
      // element marked with `data-hotkey-context`?
      if (target?.current && isObscuredByContext(target.current)) {
        return;
      }

      // console.log("Hotkey matched:", formatHotkey(event), "on", target);

      // If we handled a hotkey, it shouldn't do anything else!
      const result = onPressCallback.current?.();

      if (result !== false) {
        event.preventDefault();
      }
    }

    // console.log("Add listener for ", hotkey, "on", target);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      // console.log("Remove listener for ", hotkey, "on", target);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hotkey, disabled, target, alwaysFire]);
}

const IgnoredElements = ["INPUT", "TEXTAREA", "SELECT"];
const AlwaysFireOnKeys = ["Enter", "Escape"];

export type Hotkey = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

/**
 * Parses a hotkey provided in the format "ctrl+shift+a" to a Hotkey object.
 */
export function parseHotkey(hotkey: string): Hotkey {
  const parts = hotkey.split("+");

  return {
    key: parts.pop()!,
    ctrlKey: parts.includes("ctrl"),
    altKey: parts.includes("alt"),
    shiftKey: parts.includes("shift"),
    metaKey: parts.includes("cmd"),
  };
}

/**
 * Formats a Hotkey to a display format using unicode characters, like "⇧⌘A".
 */
export function formatHotkey(
  { key, ctrlKey, altKey, shiftKey, metaKey }: Hotkey,
  { originalCase }: { originalCase?: boolean } = {},
): string {
  let formatted = "";

  if (ctrlKey) formatted += "⌃";
  if (altKey) formatted += "⌥";
  if (shiftKey) formatted += "⇧";
  if (metaKey) formatted += "⌘";

  return formatted + originalCase ? key : key.toUpperCase();
}

/**
 * Given an Element, returns true if the Element is "obscured" by another
 * element marked with `data-hotkey-context`. It doesn't have to visually
 * be obscured - it just needs to be "below" the element in the DOM tree.
 * Typically you would add `data-hotkey-context` to a modal overlay, such
 * that elements "underneath" the overlay don't trigger hotkeys.
 */
function isObscuredByContext(target: Element): boolean {
  // Grab all hotkey contexts present in the DOM.
  const contexts = document.querySelectorAll("*[data-hotkey-context=true]");

  // If any of them are in front of the target, then we won't fire.
  for (let i = 0; i < contexts.length; i++) {
    const context = contexts[i];

    const isObscured =
      target.compareDocumentPosition(context) &
      Node.DOCUMENT_POSITION_FOLLOWING;

    if (isObscured) {
      // console.log("Hotkey blocked by context:", context);
      return true;
    }
  }

  return false;
}
