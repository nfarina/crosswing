import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import DisclosureArrow from "../../icons/DisclosureArrow.svg?react";

/**
 * A versatile way to display data in a form setting.
 */
export function TextCell({
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
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
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
}) {
  const isClickable = !!rest.onClick;

  return (
    <StyledTextCell
      {...rest}
      // Pass type=button to disable auto form submit.
      {...(isClickable ? { disabled: !!disabled, type: "button" } : null)}
      data-clickable={isClickable} // For our own use, and for session tracking.
      data-ellipsize={!!ellipsize}
      data-disabled={!!disabled} // An additional prop in case we're not as=button.
      as={isClickable ? "button" : "div"}
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
    </StyledTextCell>
  );
}

export const StyledTextCell = styled.div`
  display: flex;
  flex-flow: row;
  min-height: 60px;
  align-items: center;
  padding: 0 0 0 10px;

  /* Re-enable text selection in a mobile setting. */
  user-select: text;

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
    margin: 10px 0;

    > .label {
      font: ${fonts.displayBold({ size: 11, line: "16px" })};
      color: ${colors.text()};
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: -2px 6px 5px 0;
      word-break: break-word;
    }

    > .action {
      font: ${fonts.displayBold({ size: 14, line: "20px" })};
      color: ${colors.text()};
      margin-right: 6px;
      word-break: break-word;
    }

    > .title {
      font: ${fonts.display({ size: 16, line: "22px" })};
      color: ${colors.text()};
      margin-right: 6px;
      word-break: break-word;
    }

    > .subtitle {
      margin-right: 6px;
      font: ${fonts.display({ size: 14, line: "20px" })};
      color: ${colors.textSecondary()};
      word-break: break-word;
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
    flex-shrink: 0;
    margin: 0 10px;
    display: flex;
    flex-flow: row;
    align-items: center;
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

  &[data-clickable="true"] {
    cursor: pointer;
    /* Undo <button> styles. */
    appearance: none;
    background-color: transparent;
    border: none;
    text-align: left;
  }

  &:disabled,
  &[data-disabled="true"] {
    cursor: default;

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
