import { useRouter } from "@cyber/router/context";
import { Link } from "@cyber/router/link";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { Clickable } from "../Clickable.js";

export interface ToolbarTabProps {
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  selected?: boolean;
}

export function ToolbarTab({
  to,
  onClick,
  selected,
  ...rest
}: ToolbarTabProps & Pick<HTMLAttributes<HTMLElement>, "className" | "style">) {
  const { location } = useRouter();

  if (to) {
    return (
      <StyledToolbarTabLink
        to={to}
        data-is-toolbar-tab
        data-selected={!!location.tryClaim(to)}
        {...rest}
      />
    );
  } else {
    return (
      <StyledToolbarTabButton
        onClick={onClick}
        data-is-toolbar-tab
        data-selected={!!selected}
        {...rest}
      />
    );
  }
}
// We use this instead of comparing item.type === ToolbarTab because that class
// pointer is not stable during development with hot reloading.
ToolbarTab.isToolbarTab = true;

export const StyledToolbarTabLink = styled(Link)`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};
  background: ${colors.textBackgroundAlt()};

  &[data-selected="true"] {
    background: ${colors.textBackground()};
  }
`;

export const StyledToolbarTabButton = styled(Clickable)`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px;
  color: ${colors.text()};
  font: ${fonts.display({ size: 15 })};

  &[data-selected="true"] {
    background: ${colors.textBackground()};
  }
`;
