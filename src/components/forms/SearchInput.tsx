import React, {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import { styled } from "styled-components";
import CloseCircle from "../../../icons/CloseCircle.svg";
import Search from "../../../icons/Search.svg";
import { useHotkey } from "../../hooks/useHotkey";
import { useHost } from "../../host/context/HostContext";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts";
import { Spinner } from "../Spinner";

export function SearchInput({
  placeholder = "Search",
  value,
  disabled,
  working,
  style,
  className,
  autoFocusOnDesktop,
  onValueChange,
  clearOnEscape = true,
  ...rest
}: {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  working?: boolean;
  autoFocusOnDesktop?: boolean;
  onValueChange?: (newValue: string, selectionStart: number | null) => void;
  clearOnEscape?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  //
  // Hooks
  //

  const { container } = useHost();

  const inputRef = useRef<HTMLInputElement>(null);

  // Allow you to use the hotkey "/" to focus the search bar.
  useHotkey("/", {
    target: inputRef,
    onPress: () => inputRef.current?.select(),
  });

  useEffect(() => {
    // This only makes sense on mobile where the keyboard gets in the way.
    if (container === "web") return;

    const onScroll = (e: Event) => {
      const input = inputRef.current;
      if (!input) return;

      // If we're not focused, nothing to do.
      if (document.activeElement !== input) return;

      // First search the target's parents to make sure you didn't scroll
      // something inside the search bar itself.
      if (containsElement(input, e.target as Element)) return;

      // Must have scrolled something outside the input. Blur ourselves.
      input.blur();
    };

    // Begin listening for window-level touch move events so we can blur on
    // scrolling.
    window.addEventListener("scroll", onScroll, true); // useCapture = true

    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  //
  // Handlers
  //

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    onValueChange?.(e.currentTarget.value, e.currentTarget.selectionStart);
  }

  function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    const input = inputRef.current;

    // Unfocus the input if you pressed enter, to get the keyboard out of
    // the way. This only makes sense on mobile.
    if (container !== "web" && e.key === "Enter") {
      input?.blur();
    }

    // If you pressed escape, clear the text.
    if (e.key === "Escape" && clearOnEscape) {
      if (value != null) {
        // Controlled component.
        onValueChange?.("", null);
      } else {
        // Uncontrolled component.
        if (input) input.value = "";
      }
    }
  }

  //
  // Render
  //

  const autoFocus =
    rest.autoFocus ?? (autoFocusOnDesktop && container === "web");

  return (
    <StyledSearchInput
      style={style}
      className={className}
      data-disabled={!!disabled}
      data-show-close={!!value}
      data-show-spinner={working}
    >
      <input
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={onInputChange}
        onKeyUp={onKeyUp}
        value={value}
        disabled={disabled}
        {...rest}
      />
      <Search className="icon-search" />
      <div className="spinner">
        <Spinner smaller />
      </div>
      <div className="close" onClick={() => onValueChange?.("", null)}>
        <CloseCircle />
      </div>
    </StyledSearchInput>
  );
}

export const StyledSearchInput = styled.div`
  display: flex;
  height: 34px;
  box-sizing: border-box;
  position: relative;

  > input {
    flex-grow: 1;
    width: 0; /* Don't let the <input> intrinsic sizing preferences have any effect on the final size. */

    background: ${colors.textBackground()};
    font: ${fonts.display({ size: 16 })};
    border: 1px solid ${colors.separator()};
    border-radius: 3px;
    appearance: none;
    padding: 9px 30px 8px 30px;
    color: ${colors.text()};

    &:focus {
      /* Better outline styles on focus for desktop TBD. */
      outline: none;
    }

    &::-webkit-input-placeholder {
      color: ${colors.mediumGray()};

      @media (prefers-color-scheme: dark) {
        color: ${colors.darkGray()};
      }
    }
  }

  > .icon-search {
    position: absolute;
    left: 5px;
    top: calc(50% - 12px);
    pointer-events: none;

    path {
      fill: ${colors.mediumGray()};

      @media (prefers-color-scheme: dark) {
        fill: ${colors.darkGray()};
      }
    }
  }

  &[data-disabled="true"] {
    > input {
      color: ${colors.text({ alpha: 0.5 })};
    }

    > .icon-search {
      opacity: 0.5;
    }
  }

  > .spinner {
    position: absolute;
    top: 0px;
    right: 35px;
    bottom: 0px;
    align-items: center;
    justify-content: center;
    display: none;
  }

  > .close {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 8px;
    visibility: hidden;
    cursor: pointer;
  }

  &[data-show-spinner="true"] {
    > input {
      padding-right: 65px;
    }

    > .spinner {
      display: flex;
    }
  }

  &[data-show-close="true"] {
    > .close {
      visibility: visible;
    }
  }
`;

function containsElement(parent: Element, child: Element | null): boolean {
  if (!child) return false; // no more parents
  if (child === parent) return true;
  return containsElement(parent, child.parentElement);
}
