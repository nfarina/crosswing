import { MouseEvent, ReactElement, ReactNode } from "react";
import { styled } from "styled-components";
import { useHost } from "../../host/context/HostContext";
import PlaceholderIcon from "../../icons/Placeholder.svg?react";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts/fonts";
import { Link } from "../Link";
import { useRouter } from "../context/RouterContext";
import { UnreadBadge } from "./UnreadBadge";

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
  const { icon = <PlaceholderIcon />, title, badge } = tab.props;
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
    <StyledTabLink to={to} data-active={active} onClick={onClick}>
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

    > svg * {
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
`;
