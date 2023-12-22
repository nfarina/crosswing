import {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { useHost } from "../../host/context/HostContext";
import { useScrollAboveKeyboard } from "../../host/features/useScrollAboveKeyboard";
import { StatusBadge, StyledStatusBadge } from "../badges/StatusBadge";

/** How to render errors when given via the `TextInput.error` property. */
export type TextInputErrorStyle = "color" | "message";

/**
 * A text input that supports automatically trimming user-entered input.
 *
 * Note that the "onChange" event is not exposed since it will bypass our
 * automatic trimming.
 */
export function TextInput({
  value = "",
  autoFocusOnDesktop,
  autoSelect,
  onValueChange,
  error,
  errorStyle = "message",
  /** If true, uses a more number-friendly font. */
  numeric,
  autoTrim = true,
  style,
  className,
  onFocus,
  onBlur,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value?: string;
  autoFocusOnDesktop?: boolean;
  /** When the input is auto-focused initially, any existing value will be selected. */
  autoSelect?: boolean;
  numeric?: boolean;
  /** Automatically trims text entered by the user. */
  autoTrim?: boolean;
  onValueChange?: (newValue: string) => void;
  error?: Error | null;
  errorStyle?: TextInputErrorStyle;
}) {
  const { container } = useHost();

  // Track whether you've ever focused the input so we don't open up a new
  // blank form with lots of "Required" errors right away.
  const [hasEverFocused, setHasEverFocused] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [innerValue, setInnerValue] = useState<string>(value);

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
    if (autoFocus && autoSelect && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useScrollAboveKeyboard(inputRef);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setInnerValue(newValue);
    onValueChange?.(autoTrim ? newValue.trim() : newValue);
  }

  function onInputFocus(e: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    setHasEverFocused(true);
    onFocus?.(e);
  }

  function onInputBlur(e: FocusEvent<HTMLInputElement>) {
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
    <StyledTextInput
      style={style}
      className={className}
      data-error={showError}
      data-error-style={errorStyle}
      data-value-empty={!innerValue}
      {...dataAttrs}
    >
      <input
        ref={inputRef}
        value={innerValue}
        onChange={onInputChange}
        data-numeric={!!numeric}
        {...(numeric ? { inputMode: "decimal" } : null)}
        autoFocus={autoFocus}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
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
    </StyledTextInput>
  );
}

export const StyledTextInput = styled.div`
  display: flex;
  flex-flow: row;
  box-sizing: border-box;

  > input {
    /* Remove intrinsic size and allow it to fit whatever container you put it in. */
    width: 0;
    flex-grow: 1;
    padding: 0;

    appearance: none;
    display: block;
    box-sizing: border-box;
    font: ${fonts.display({ size: 16 })};
    color: ${colors.text()};
    border: none;
    border-radius: 0;
    background: transparent;

    &[data-numeric="true"] {
      font: ${fonts.numeric({ size: 16 })};
      letter-spacing: 0.5px;
    }

    &:focus {
      /* Better outline styles on focus for desktop TBD. */
      outline: none;
    }

    &::-webkit-input-placeholder {
      color: ${colors.darkGray()};
      font: inherit;
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
    max-width: 50%;
  }

  &[data-error="true"][data-error-style="color"],
  &[data-error="true"][data-error-style="message"] {
    > input {
      color: ${colors.red()};
    }
  }

  &[data-error="true"][data-error-style="message"] {
    > ${StyledStatusBadge} {
      display: unset;
    }
  }
`;
