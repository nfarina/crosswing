import {
  ComponentType,
  createContext,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  use,
  useRef,
} from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { CheckIcon } from "../icons/Check.js";
import { PopupPlacement } from "../modals/popup/getPopupPlacement.js";
import {
  Hotkeys,
  HotkeyView,
  StyledHotkeyView,
} from "../modals/popup/HotkeyView.js";
import { PopupChildProps, PopupView } from "../modals/popup/PopupView.js";
import { Link } from "../router/Link.js";
import { StatusBanner } from "./badges/StatusBanner.js";
import { Clickable } from "./Clickable.js";
import { FileInput } from "./forms/FileInput.js";
import { Select } from "./forms/Select.js";
import { Toggle } from "./forms/Toggle.js";
import { useListKeyboardNavigationJS } from "./useListKeyboardNavigationJS.js";

// Used to drill the onClose prop down to the PopupMenu children without
// having to clone elements and deal with "keys".
export type OnCloseHandler = (() => any) | null | undefined;

export const OnCloseContext = createContext<OnCloseHandler>(null);
OnCloseContext.displayName = "OnCloseContext";

export function PopupMenu({
  arrowBackground,
  arrowBackgroundDark,
  placement,
  keyboardNavigation = true,
  onClose,
  onScroll,
  onScrollCapture,
  children,
  ...rest
}: {
  arrowBackground?: string;
  arrowBackgroundDark?: string;
  children?: ReactNode;
  placement?: PopupPlacement;
  /** If false, will not add automatic keyboard navigation to the menu. */
  keyboardNavigation?: boolean;
} & Partial<PopupChildProps> &
  HTMLAttributes<HTMLDivElement>) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Add keyboard navigation with auto-focus
  useListKeyboardNavigationJS(menuRef, {
    role: "menu",
    disabled: !keyboardNavigation,
  });

  return (
    <PopupView
      placement={placement}
      arrowBackground={arrowBackground}
      arrowBackgroundDark={arrowBackgroundDark}
      {...rest}
    >
      {/* Send any onScroll events to the menu since it has overflow: auto */}
      <StyledPopupMenu
        ref={menuRef}
        onScroll={onScroll}
        onScrollCapture={onScrollCapture}
      >
        <OnCloseContext value={onClose}>{children}</OnCloseContext>
      </StyledPopupMenu>
    </PopupView>
  );
}

export const StyledPopupMenu = styled.div`
  padding: 5px;
  display: flex;
  flex-flow: column;
  overflow: auto;

  > * {
    flex-shrink: 0;
  }
`;

export function PopupMenuText({
  icon,
  children,
  detail,
  onClick,
  component = null,
  to,
  right,
  target,
  disabled,
  selectable = true,
  selected,
  checked,
  hotkeys,
  destructive,
  leaveOpen,
  ellipsize,
  ...rest
}: {
  icon?: ReactNode;
  children?: ReactNode;
  detail?: ReactNode;
  right?: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  component?: string | ComponentType<any> | null;
  to?: string;
  target?: string;
  disabled?: boolean;
  /** If false, then behaves like disabled=true, but doesn't dim out the item. Default true. */
  selectable?: boolean;
  selected?: boolean;
  checked?: boolean;
  hotkeys?: Hotkeys | null;
  destructive?: boolean;
  /** If true, clicking the text will not call onClose() automatically. */
  leaveOpen?: boolean;
  ellipsize?: boolean;
} & Omit<HTMLAttributes<HTMLAnchorElement & HTMLDivElement>, "onClick">) {
  // We want to automatically close the menu when you click something.
  const onClose = use(OnCloseContext);

  function onButtonClick(e: MouseEvent<HTMLElement>) {
    onClick?.(e);
    if (onClick && !leaveOpen) onClose?.();
  }

  function onMouseEnter(e: MouseEvent<HTMLElement>) {
    // Move focus to the hovered item for seamless keyboard/mouse interaction
    if (!disabled) {
      (e.currentTarget as HTMLElement).focus();
    }
    rest.onMouseEnter?.(e as any);
  }

  function getAs(): string | ComponentType<any> {
    if (typeof component === "string" && !onClick) return component;
    if (to) return Link;
    return component ?? Clickable; // Default to button for menu items to ensure they're focusable
  }

  // Determine if this item should be focusable
  const isInteractive =
    !disabled && selectable && (onClick || to || component !== "div");

  return (
    <StyledPopupMenuText
      as={getAs()}
      {...(to ? { to, target } : {})}
      onClick={onButtonClick}
      onMouseEnter={onMouseEnter}
      data-disabled={disabled}
      data-selected={selected}
      data-checked={checked}
      data-destructive={destructive}
      data-ellipsize={ellipsize}
      data-selectable={selectable}
      // ARIA and focusability attributes
      role="menuitem"
      aria-disabled={disabled}
      tabIndex={isInteractive ? 0 : -1}
      {...rest}
    >
      {icon && <div className="icon">{icon}</div>}
      <div className="content">
        {children && <div className="children">{children}</div>}
        {detail && <div className="detail">{detail}</div>}
      </div>
      {right && <div className="right">{right}</div>}
      {checked != null && (
        <div className="checked">
          {checked ? <CheckIcon /> : <div className="not-checked" />}
        </div>
      )}
      {hotkeys && <HotkeyView hotkeys={hotkeys} />}
    </StyledPopupMenuText>
  );
}

export const StyledPopupMenuText = styled.div`
  padding: 7px 12px;
  border-radius: 13px;
  cursor: default;
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 7px;
  color: ${colors.text()};
  box-sizing: border-box; /* Needed for <a> elements */

  &[data-selectable="true"] {
    cursor: pointer;
  }

  /* For Links. */
  text-decoration: none;

  > .icon {
    flex-shrink: 0;
    flex-grow: 0;
    width: 15px;
    height: 15px;

    > svg {
      width: 100%;
      height: 100%;
    }
  }

  > .content {
    flex-grow: 1;
    min-width: 0; /* Enable ellipsizing when needed. */
    display: flex;
    flex-flow: column;

    > .children {
      font: ${fonts.display({ size: 15, line: "22px" })};
      ${"text-wrap: pretty;"}
    }

    > .detail {
      font: ${fonts.display({ size: 12, line: "18px" })};
      color: ${colors.textSecondary()};
      ${"text-wrap: pretty;"}
    }
  }

  > .right {
    flex-shrink: 0;
    flex-grow: 0;
  }

  > .checked {
    flex-shrink: 0;
    width: 22px;
    height: 22px;

    > svg {
      width: 100%;
      height: 100%;
    }
  }

  > ${StyledHotkeyView} {
    margin-left: 10px;
  }

  &[data-selectable="true"] {
    &:hover,
    &:focus,
    &.focused {
      background: ${colors.buttonBackgroundHover()};
      outline: none;
    }
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }

  &[data-selected="true"] {
    > .content > .children {
      font: ${fonts.displayBold({ size: 15, line: "22px" })};
    }
  }

  &[data-destructive="true"] {
    color: ${colors.red({ darken: 0.2 })};

    @media (prefers-color-scheme: dark) {
      color: ${colors.red({ lighten: 0.15 })};
    }

    > .content > .detail {
      color: ${colors.red({ darken: 0.2, desaturate: 0.45 })};

      @media (prefers-color-scheme: dark) {
        color: ${colors.red({ lighten: 0.15, desaturate: 0.65 })};
      }
    }

    &:hover,
    &:focus,
    &.focused {
      background: ${colors.red({ alpha: 0.1 })};
    }
  }

  &[data-ellipsize="true"] {
    > .content {
      > .children,
      > .detail {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;

export const PopupMenuSelect = styled(Select)`
  > select {
    border-radius: 13px;

    &:hover {
      background: ${colors.buttonBackgroundHover()};
    }

    padding: 7px 40px 7px 12px;
    background: transparent;
    font: ${fonts.display({ size: 15, line: "22px" })};
  }

  > .arrow-icon {
    right: 14px;
  }
`;

export function PopupMenuToggle({
  on,
  ...rest
}: Parameters<typeof PopupMenuText>[0] & {
  on?: boolean;
}) {
  return (
    <StyledPopupMenuToggle
      leaveOpen
      // Don't listen for clicks on the Toggle; it would shadow our button element.
      right={
        <Toggle on={on} size="smallest" disabled={rest.disabled} as="div" />
      }
      {...rest}
    />
  );
}

const StyledPopupMenuToggle = styled(PopupMenuText)`
  cursor: pointer;

  > .right {
    margin-left: 12px;
    transform: translateY(1px);
    /* Fix Safari height issue with scaled Toggle component */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const PopupMenuHeader = styled.div`
  padding: 6px 12px 2px;
  font: ${fonts.displayMedium({ size: 12, line: "18px" })};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${colors.textSecondary()};
`;

export const PopupMenuSeparator = styled.div`
  margin: 5px 12px 5px 12px;
  height: 1px;
  background: ${colors.separator()};
`;

export const PopupStatusBanner = styled(StatusBanner)`
  margin-top: -5px;
  margin-bottom: 5px;
  margin-left: -5px;
  margin-right: -5px;
  padding-right: 12px;
  padding-bottom: 9px;

  > svg {
    align-self: center;
    margin-right: 6px;
    transform: scale(0.9);
  }

  > .children {
    font: ${fonts.display({ size: 14, line: "20px" })};
  }

  /* Text doesn't align so this is temporary. */
  padding-left: calc(12px + 5px) !important;
  padding-right: calc(12px + 5px) !important;
  > svg {
    display: none;
  }
`;

/**
 * Specialized version of PopupMenuText that renders a FileInput instead of a
 * button.
 */
export function PopupMenuFileInput({
  leaveOpen = true,
  ...rest
}: (Parameters<typeof PopupMenuText>[0] &
  Parameters<typeof FileInput>[0]) & {}) {
  return (
    <PopupMenuText component={FileInput} leaveOpen={leaveOpen} {...rest} />
  );
}
