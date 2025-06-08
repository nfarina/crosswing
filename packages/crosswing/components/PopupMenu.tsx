import {
  ComponentType,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  createContext,
  use,
} from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { CheckIcon } from "../icons/Check.js";
import { PopupPlacement } from "../modals/popup/getPopupPlacement.js";
import { PopupChildProps, PopupView } from "../modals/popup/PopupView.js";
import { Link } from "../router/Link.js";
import { StatusBanner } from "./badges/StatusBanner.js";
import { Clickable } from "./Clickable.js";
import { Select } from "./forms/Select.js";
import { Toggle } from "./forms/Toggle.js";

// Used to drill the onClose prop down to the PopupMenu children without
// having to clone elements and deal with "keys".
export type OnCloseHandler = (() => any) | null | undefined;

export const OnCloseContext = createContext<OnCloseHandler>(null);
OnCloseContext.displayName = "OnCloseContext";

export function PopupMenu({
  arrowBackground,
  arrowBackgroundDark,
  placement,
  onClose,
  children,
  ...rest
}: {
  arrowBackground?: string;
  arrowBackgroundDark?: string;
  children?: ReactNode;
  placement?: PopupPlacement;
} & Partial<PopupChildProps> &
  HTMLAttributes<HTMLDivElement>) {
  return (
    <PopupView
      placement={placement}
      arrowBackground={arrowBackground}
      arrowBackgroundDark={arrowBackgroundDark}
      {...rest}
    >
      <StyledPopupMenu>
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
  asDiv,
  to,
  right,
  target,
  disabled,
  selected,
  checked,
  destructive,
  leaveOpen,
  ...rest
}: {
  icon?: ReactNode;
  children?: ReactNode;
  detail?: ReactNode;
  right?: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  asDiv?: boolean;
  to?: string;
  target?: string;
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean;
  destructive?: boolean;
  /** If true, clicking the text will not call onClose() automatically. */
  leaveOpen?: boolean;
} & Omit<HTMLAttributes<HTMLAnchorElement & HTMLDivElement>, "onClick">) {
  // We want to automatically close the menu when you click something.
  const onClose = use(OnCloseContext);

  function onButtonClick(e: MouseEvent<HTMLElement>) {
    onClick?.(e);
    if (!leaveOpen) onClose?.();
  }

  function getAs(): string | ComponentType<any> {
    if (asDiv) return "div";
    if (to) return Link;
    if (onClick) return Clickable;
    return "div";
  }

  return (
    <StyledPopupMenuText
      as={getAs()}
      {...(to ? { to, target } : {})}
      onClick={onButtonClick}
      data-disabled={disabled}
      data-selected={selected}
      data-checked={checked}
      data-destructive={destructive}
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
    </StyledPopupMenuText>
  );
}

export const StyledPopupMenuText = styled.div`
  padding: 7px 12px;
  border-radius: 13px;
  cursor: pointer;
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 7px;
  color: ${colors.text()};

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

    display: flex;
    flex-flow: column;

    > .children {
      font: ${fonts.display({ size: 15, line: "22px" })};
    }

    > .detail {
      font: ${fonts.display({ size: 12, line: "18px" })};
      color: ${colors.textSecondary()};
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

  &:hover {
    background: ${colors.buttonBackgroundHover()};
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
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

    &:hover {
      background: ${colors.red({ alpha: 0.1 })};
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
      // We don't want to shadow the button by making ourselves a <button>
      // as well.
      asDiv
      // Don't listen for clicks on the Toggle.
      right={<Toggle on={on} size="smallest" disabled={rest.disabled} />}
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
