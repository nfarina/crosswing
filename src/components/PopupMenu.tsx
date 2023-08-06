import React, {
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  createContext,
  useContext,
} from "react";
import { styled } from "styled-components";
import { PopupView } from "../modals/popup/PopupView.js";
import { PopupChildProps } from "../modals/popup/usePopup.js";
import { Link } from "../router/Link.js";
import { colors } from "../theme/colors/colors.js";
import { fonts } from "../theme/fonts.js";
import { Select } from "./forms/Select.js";
import { StyledToggle, Toggle } from "./forms/Toggle.js";

// Used to drill the onClose prop down to the PopupMenu children without
// having to clone elements and deal with "keys".
export type OnCloseHandler = (() => any) | null | undefined;

export const OnCloseContext = createContext<OnCloseHandler>(null);
OnCloseContext.displayName = "OnCloseContext";

export function useOnClose(): OnCloseHandler {
  return useContext(OnCloseContext);
}

export function PopupMenu({
  arrowBackground,
  arrowBackgroundDark,
  placement = "below",
  onClose,
  children,
  ...rest
}: {
  arrowBackground?: string;
  arrowBackgroundDark?: string;
  children?: ReactNode;
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
        <OnCloseContext.Provider value={onClose}>
          {children}
        </OnCloseContext.Provider>
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
  ...rest
}: {
  children?: ReactNode;
  onClick?: () => void;
  to?: string;
  target?: string;
  disabled?: boolean;
  selected?: boolean;
  destructive?: boolean;
} & Omit<HTMLAttributes<HTMLAnchorElement & HTMLDivElement>, "onClick">) {
  // We want to automatically close the menu when you click something.
  const onClose = useOnClose();

  function onButtonClick() {
    onClick?.();
    onClose?.();
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
      background: ${colors.extraDarkGray()};
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
}: {
  children?: ReactNode;
  detail?: ReactNode;
  on?: boolean;
  onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}) {
  return (
    <StyledPopupMenuToggle onClick={onClick} data-disabled={!!disabled}>
      <div className="content">
        {children && <div className="children">{children}</div>}
        {detail && <div className="detail">{detail}</div>}
      </div>
      <Toggle on={on} smaller disabled={disabled} />
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
