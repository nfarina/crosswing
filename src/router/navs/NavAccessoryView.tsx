import { MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { AndroidBackButtonClassName } from "../../host/context/HostContext";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts";
import { Link } from "../Link";

export interface NavAccessory {
  icon?: ReactNode;
  title?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  /** True if this accessory should be triggered by the hardware "Back" button on Android devices. */
  back?: boolean;
  to?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => any;
}

export interface NavAccessoryViewProps {
  accessory: NavAccessory;
  align?: "left" | "right";
}

export function NavAccessoryView({ accessory, align }: NavAccessoryViewProps) {
  const { icon, title, disabled, destructive, to, onClick, back } = accessory;
  const children = title || <div className="icon" />;

  const sharedProps = {
    "data-disabled": !!disabled,
    "data-destructive": !!destructive,
    // If this button is marked as a "back button", allow it to be targeted by
    // the Android back button handler.
    className: back ? AndroidBackButtonClassName : "",
    "data-align": align,
    "data-icon": !!icon,
    children: icon || children,
  };

  if (to) {
    return <StyledNavAccessoryView as={Link} to={to} {...sharedProps} />;
  } else {
    return (
      <StyledNavAccessoryView
        as={StyledButton}
        onClick={onClick}
        {...sharedProps}
      />
    );
  }
}

export const StyledNavAccessoryView = styled.div`
  color: ${colors.text()};
  transition: opacity 0.2s ease-in-out;
  text-decoration: none;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &[data-destructive="true"] {
    color: ${colors.red()};
  }

  &[data-align="left"] {
    justify-content: flex-start;
    padding-left: 10px;
  }

  &[data-align="right"] {
    justify-content: flex-end;
    padding-right: 10px;
  }

  &[data-icon="true"] {
    > svg {
      path {
        fill: currentcolor;
      }
    }
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledButton = styled.button`
  appearance: none;
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  color: ${colors.text()};
  font: ${fonts.display({ size: 16, line: "1.2" })};
  display: flex;
  box-sizing: border-box;
  align-items: center;

  &[data-destructive="true"] {
    color: ${colors.red()};
  }

  &[data-align="left"] {
    justify-content: flex-start;
    padding-left: 10px;
  }

  &[data-align="right"] {
    justify-content: flex-end;
    padding-right: 10px;
  }

  &[data-icon="true"] {
    > svg {
      path {
        fill: currentcolor;
      }
    }
  }

  &[data-disabled="true"] {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
  }
`;
