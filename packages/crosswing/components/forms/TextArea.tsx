import {
  ChangeEvent,
  FocusEvent,
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { useHost } from "../../host/context/HostContext.js";
import { useScrollAboveKeyboard } from "../../host/features/useScrollAboveKeyboard.js";
import { StatusBadge, StyledStatusBadge } from "../badges/StatusBadge.js";

/** How to render errors when given via the `TextInput.error` property. */
export type TextAreaErrorStyle = "color" | "message";

/**
 * Automatically trims text entered by the user, and adjusts height to fit
 * the content.
 *
 * Note that the "onChange" event is not exposed since it will bypass our
 * automatic trimming.
 */
export function TextArea({
  value = "",
  autoFocusOnDesktop,
  autoSelect,
  onValueChange,
  error,
  errorStyle = "message",
  autoSizing,
  autoTrim = true,
  style,
  className,
  onFocus,
  onBlur,
  minHeight = 22, // default line height
  maxHeight = Number.POSITIVE_INFINITY,
  ...rest
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
  value?: string;
  autoFocusOnDesktop?: boolean;
  /** When the input is auto-focused initially, any existing value will be selected. */
  autoSelect?: boolean;
  /** Automatically trims text entered by the user. */
  autoTrim?: boolean;
  onValueChange?: (newValue: string) => void;
  error?: Error | null;
  errorStyle?: TextAreaErrorStyle;
  autoSizing?: boolean;
  minHeight?: number;
  maxHeight?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  //
  // Auto-trimming copied from TextInput
  //

  const { container } = useHost();

  // Track whether you've ever focused the input so we don't open up a new
  // blank form with lots of "Required" errors right away.
  const [hasEverFocused, setHasEverFocused] = useState(false);
  const [focused, setFocused] = useState(false);

  const [innerValue, setInnerValue] = useState(value);

  // If the value unexpectedly changes, reset our internal state.
  if (autoTrim && innerValue.trim() !== value.trim()) {
    setInnerValue(value);
  }

  // Check after rendering to see if you handed us a value that wasn't already
  // trimmed, and trim it for you!
  useLayoutEffect(() => {
    if (autoTrim && value.trim() !== value) {
      onValueChange?.(value.trim());
    }
  }, [autoTrim, value.trim() !== value]);

  const autoFocus =
    rest.autoFocus ?? (autoFocusOnDesktop && container === "web");

  useLayoutEffect(() => {
    if (autoFocus && autoSelect && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, []);

  useScrollAboveKeyboard(ref);

  function onInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.currentTarget.value;
    setInnerValue(newValue);
    onValueChange?.(newValue.trim());
  }

  //
  // Auto-sizing
  //

  useLayoutEffect(() => {
    if (!autoSizing) return;

    const textarea = ref.current!;
    const container = textarea.parentElement!;

    // If we are invisible, we can't measure anything, so bail.
    if (container.offsetWidth === 0 || container.offsetHeight === 0) return;

    // When mounted in Storybook, our rects will be 0,0,0,0, so we need to wait a tic.
    requestAnimationFrame(() => {
      // To compute the "desired" height of the <textarea>, we do a little trick
      // where we set the height to 0, then set the scrollHeight as the height.
      // But! We need to make sure the overall component's size doesn't change
      // unless necessary, otherwise it will cause a reflow and make the
      // component jump around if it's in a scrolling container.
      const oldHeight = container.style.height;
      container.style.height = container.offsetHeight + "px";

      textarea.style.height = minHeight + "px";
      const newHeight = Math.max(
        Math.min(textarea.scrollHeight, maxHeight),
        minHeight,
      );
      textarea.style.height = `${newHeight}px`;

      // Restore the old height to avoid reflows.
      container.style.height = oldHeight;
    });
  });

  //
  // Focus & Error Management
  //

  function onInputFocus(e: FocusEvent<HTMLTextAreaElement>) {
    setFocused(true);
    setHasEverFocused(true);
    onFocus?.(e);
  }

  function onInputBlur(e: FocusEvent<HTMLTextAreaElement>) {
    setFocused(false);
    onBlur?.(e);
  }

  const showError = !!error && (!!value || hasEverFocused) && !focused;

  // Separate any data- attributes from rest.
  const dataAttrs = {};
  const restAttrs = {};
  for (const key of Object.keys(rest)) {
    if (key.startsWith("data-")) {
      dataAttrs[key] = rest[key];
    } else {
      restAttrs[key] = rest[key];
    }
  }

  return (
    <StyledTextArea
      style={style}
      className={className}
      data-error={showError}
      data-error-style={errorStyle}
      data-value-empty={!innerValue}
      {...dataAttrs}
    >
      <textarea
        value={innerValue}
        onChange={onInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        autoFocus={autoFocus}
        data-auto-sizing={!!autoSizing}
        ref={ref}
        {...restAttrs}
      />
      {showError && (
        <StatusBadge
          type="error"
          size="smallest"
          hideIcon
          children={error.message}
        />
      )}
    </StyledTextArea>
  );
}

export const StyledTextArea = styled.div`
  display: flex;
  flex-flow: row;
  box-sizing: border-box;

  > textarea {
    /* Remove intrinsic size and allow it to fit whatever container you put it in. */
    width: 0;
    flex-grow: 1;

    appearance: none;
    outline: none;
    display: block;
    box-sizing: border-box;
    font: ${fonts.display({ size: 16, line: "22px" })};
    color: ${colors.text()};
    border: none;
    border-radius: 0;
    padding: 0;
    background: transparent;

    &[data-auto-sizing="true"] {
      /* Hide the little resize grip since we are auto-sizing. */
      resize: none;
    }

    &::-webkit-input-placeholder {
      color: ${colors.darkGray()};
      font: inherit;
    }

    /* Target Safari browsers only, which drop the bottom padding from the placeholder: http://browserbu.gs/css-hacks/webkit-full-page-media/ */
    _::-webkit-full-page-media,
    &::-webkit-input-placeholder {
      padding-bottom: inherit;
    }

    &:disabled {
      color: ${colors.text({ alpha: 0.5 })};

      @media (prefers-color-scheme: dark) {
        color: ${colors.text({ alpha: 0.5 })};
      }
    }

    transition: color 0.2s ease-in-out;
  }

  > ${StyledStatusBadge} {
    display: none;
    margin: 7px 7px 7px 0;
    align-self: center;
    max-width: 30%;
  }

  &[data-error="true"][data-error-style="color"],
  &[data-error="true"][data-error-style="message"] {
    > textarea {
      color: ${colors.red()};
    }
  }

  &[data-error="true"][data-error-style="message"] {
    > ${StyledStatusBadge} {
      display: unset;
    }
  }
`;
