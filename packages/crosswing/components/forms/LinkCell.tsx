import { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import DisclosureArrow from "../../icons/DisclosureArrow.svg?react";
import { Link } from "../../router/Link.js";

/**
 * A versatile mobile clickable form component. Is a Link but can behave like
 * a button.
 */
export function LinkCell({
  to,
  left,
  icon,
  label,
  action,
  title,
  subtitle,
  children,
  badge,
  hideDisclosure,
  ellipsize,
  disabled,
  onKeyDown,
  ...rest
}: {
  to?: string | null;
  left?: ReactNode;
  icon?: ReactNode;
  label?: ReactNode;
  action?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  badge?: ReactNode;
  hideDisclosure?: boolean;
  ellipsize?: boolean;
  disabled?: boolean;
} & Omit<HTMLAttributes<HTMLAnchorElement>, "title">) {
  const isClickable = !!to || !!rest.onClick;

  // Allow activating LinkCell with "space" since it behaves like a button.
  function onLinkKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") {
      event.preventDefault();
      console.log(event.target);
      if (event.target instanceof HTMLAnchorElement) {
        event.target.click();
      }
      onKeyDown?.(event);
    }
  }

  return (
    <StyledLinkCell
      to={to}
      data-disabled={!!disabled}
      data-ellipsize={!!ellipsize}
      data-clickable={isClickable}
      onKeyDown={onLinkKeyDown}
      {...rest}
    >
      {left && <div className="left">{left}</div>}
      {icon && <div className="icon" children={icon} />}
      <div className="content">
        {label && <span className="label">{label}</span>}
        {action && <div className="action">{action}</div>}
        {title && <div className="title">{title}</div>}
        {subtitle && <div className="subtitle">{subtitle}</div>}
        {children && <div className="children">{children}</div>}
      </div>
      {badge && <div className="badge">{badge}</div>}
      {isClickable && !hideDisclosure && (
        <DisclosureArrow className="disclosure" />
      )}
    </StyledLinkCell>
  );
}

export const StyledLinkCell = styled(Link)`
  display: flex;
  flex-flow: row;
  min-height: 60px;
  align-items: center;
  text-decoration: none;
  padding-left: 10px;

  &[data-clickable="false"] {
    cursor: default;
  }

  > .left {
    margin-right: 10px;
  }

  > .icon {
    margin-right: 6px;
    display: flex;

    > svg path {
      fill: ${colors.text()};
    }
  }

  > .content {
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    margin: 10px 6px 10px 0;

    > .label {
      font: ${fonts.displayBold({ size: 11, line: "16px" })};
      color: ${colors.text()};
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: -2px 0 5px;
    }

    > .action {
      font: ${fonts.displayBold({ size: 14, line: "20px" })};
      color: ${colors.text()};
    }

    > .title {
      font: ${fonts.display({ size: 16, line: "22px" })};
      color: ${colors.text()};
    }

    > .subtitle {
      font: ${fonts.display({ size: 14, line: "20px" })};
      color: ${colors.textSecondary()};
    }

    > .children {
      margin-right: 10px;
      display: flex;
      flex-flow: column;

      > * {
        flex-grow: 1;
      }
    }
  }

  > .badge {
    margin: 0 10px;
  }

  > .disclosure {
    flex-shrink: 0;
    margin-right: 2px;
  }

  &[data-ellipsize="true"] {
    > .content {
      > .label,
      > .action,
      > .title,
      > .subtitle {
        width: 0;
        min-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &[data-disabled="true"] {
    cursor: default;
    pointer-events: none;

    > .content {
      > .label,
      > .action,
      > .title {
        opacity: 0.5;
      }

      > .subtitle {
        opacity: 0.75;
      }
    }

    > .disclosure {
      opacity: 0.5;
    }
  }
`;
