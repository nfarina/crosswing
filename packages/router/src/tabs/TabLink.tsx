import { useHost } from "@cyber/host/context";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { MouseEvent, ReactElement, ReactNode } from "react";
import { styled } from "styled-components";
import { useRouter } from "../context/RouterContext.js";
import { Link } from "../link/Link.js";
import { UnreadBadge } from "./UnreadBadge.js";

export interface TabProps {
  path: string;
  title: ReactNode;
  icon?: ReactNode;
  badge?: number | null | "any";
  render: () => ReactNode;
}

export function TabLink({
  to,
  active,
  tab,
}: {
  to: string;
  active?: boolean;
  tab: ReactElement<TabProps>;
}) {
  const { icon, title, badge } = tab.props;
  const { location } = useRouter();
  const { scrollToTop } = useHost();

  // If you click a tab and have nowhere to navigate to (i.e. you're
  // already at the tab root) then try scrolling to the top, if on iOS.
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (location.href() === to) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <StyledTabLink
      to={to}
      data-active={active}
      data-has-icon={!!icon}
      onClick={onClick}
    >
      <div className="icon" children={icon} />
      <div className="text">{title}</div>
      {!!badge && (
        <UnreadBadge children={badge === "any" ? <>&nbsp;</> : badge} />
      )}
    </StyledTabLink>
  );
}

export const StyledTabLink = styled(Link)`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 5px 0 4px 0;
  text-decoration: none;
  position: relative;
  color: ${colors.mediumGray()};
  background: transparent;
  border-radius: 0;

  @media (prefers-color-scheme: dark) {
    background: transparent;
  }

  > .icon {
    display: flex;

    > svg path {
      fill: currentcolor;
    }
  }

  > .text {
    flex-shrink: 0;
    margin-top: 1px;
    font: ${fonts.display({ size: 11, line: "1" })};
  }

  &[data-active="true"] {
    color: ${colors.text()};
  }

  > ${UnreadBadge} {
    position: absolute;
    top: 3px;
    left: calc(50% + 3px);
  }

  &[data-has-icon="false"] {
    > ${UnreadBadge} {
      left: 50%;
      top: -14px;
      transform: translateX(-50%);
    }
  }
`;
