import {
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  createContext,
  use,
} from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { PopupPlacement } from "../modals/popup/getPopupPlacement.js";
import { PopupChildProps, PopupView } from "../modals/popup/PopupView.js";
import { Link } from "../router/Link.js";
import { StatusBanner } from "./badges/StatusBanner.js";
import { Select } from "./forms/Select.js";
import { StyledToggle, Toggle } from "./forms/Toggle.js";

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
  padding: 8px 0;
  display: flex;
  flex-flow: column;
  overflow: auto;

  > * {
    flex-shrink: 0;
  }
`;

export function PopupMenuText({
  children,
  onClick,
  to,
  target,
  disabled,
  selected,
  destructive,
  leaveOpen,
  ...rest
}: {
  children?: ReactNode;
  onClick?: () => void;
  to?: string;
  target?: string;
  disabled?: boolean;
  selected?: boolean;
  destructive?: boolean;
  /** If true, clicking the text will not call onClose() automatically. */
  leaveOpen?: boolean;
} & Omit<HTMLAttributes<HTMLAnchorElement & HTMLDivElement>, "onClick">) {
  // We want to automatically close the menu when you click something.
  const onClose = use(OnCloseContext);

  function onButtonClick() {
    onClick?.();
    if (!leaveOpen) onClose?.();
  }

  if (to) {
    return (
      <StyledPopupMenuLink
        to={to}
        target={target}
        onClick={onButtonClick}
        children={children}
        data-disabled={disabled}
        data-selected={selected}
        {...rest}
      />
    );
  } else {
    return (
      <StyledPopupMenuButton
        onClick={onButtonClick}
        children={children}
        data-disabled={!!disabled}
        data-destructive={!!destructive}
        data-selected={!!selected}
        {...rest}
      />
    );
  }
}

const StyledPopupMenuButton = styled.div`
  font: ${fonts.display({ size: 15, line: "22px" })};
  color: ${colors.text()};
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: ${colors.textBackgroundAlt()};
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  &[data-selected="true"] {
    font: ${fonts.displayBold({ size: 15, line: "22px" })};
  }

  &[data-destructive="true"] {
    color: ${colors.red()};
  }
`;

const StyledPopupMenuLink = styled(Link)`
  font: ${fonts.display({ size: 15, line: "22px" })};
  color: ${colors.text()};
  padding: 5px 10px;
  text-decoration: none;

  &:hover {
    background: ${colors.textBackgroundAlt()};
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  &[data-selected="true"] {
    font: ${fonts.displayBold({ size: 15, line: "22px" })};
  }
`;

export const PopupMenuSelect = styled(Select)`
  margin: 5px 10px;

  > select {
    @media (prefers-color-scheme: dark) {
      /* Bump up contrast since the popup has a slightly lighter background than the page. */
      background: ${colors.extraExtraExtraDarkGray()};
    }
    font: ${fonts.displayBold({ size: 14 })};
  }
`;

export function PopupMenuToggle({
  children,
  detail,
  on,
  onClick,
  disabled,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  detail?: ReactNode;
  on?: boolean;
  onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}) {
  return (
    <StyledPopupMenuToggle
      onClick={onClick}
      data-disabled={!!disabled}
      {...rest}
    >
      <div className="content">
        {children && <div className="children">{children}</div>}
        {detail && <div className="detail">{detail}</div>}
      </div>
      <Toggle on={on} size="smallest" disabled={disabled} />
    </StyledPopupMenuToggle>
  );
}

const StyledPopupMenuToggle = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;

  > .content {
    flex-shrink: 0;
    flex-grow: 1;

    display: flex;
    flex-flow: column;

    > .children {
      font: ${fonts.display({ size: 15, line: "22px" })};
      color: ${colors.text()};
    }

    > .detail {
      font: ${fonts.display({ size: 12, line: "18px" })};
      color: ${colors.textSecondary()};
    }
  }

  > ${StyledToggle} {
    margin-left: 10px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  &:hover {
    background: ${colors.textBackgroundAlt()};
  }

  &[data-disabled="true"] {
    pointer-events: none;

    > .content {
      > .children {
        opacity: 0.5;
      }

      > .detail {
        opacity: 0.5;
      }
    }
  }
`;

export const PopupMenuHeader = styled.div`
  padding: 5px 10px;
  font: ${fonts.display({ size: 13, line: "14px" })};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${colors.mediumGray()};

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkGray()};
  }
`;

export const PopupMenuSeparator = styled.div`
  margin: 5px 0 5px 10px;
  height: 1px;
  background: ${colors.separator()};
`;

export const PopupStatusBanner = styled(StatusBanner)`
  margin-top: -10px;
  margin-bottom: 5px;
  border-bottom: 1px solid ${colors.separator()};
  padding-right: 12px;
  padding-bottom: 7px;

  > svg {
    align-self: center;
    margin-right: 6px;
    transform: scale(0.9);
  }

  > .children {
    font: ${fonts.display({ size: 14, line: "20px" })};
  }
`;
