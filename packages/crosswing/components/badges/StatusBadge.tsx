import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { ErrorIcon } from "../../icons/Error.js";
import { InfoCircleIcon } from "../../icons/InfoCircle.js";
import { WarningIcon } from "../../icons/Warning.js";

export function StatusBadge({
  children,
  type = "info",
  size = "normal",
  hideIcon = false,
  right,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  type: "error" | "warning" | "info";
  size?: "smallest" | "normal";
  /** True to hide the info/warning/error icon to the left of the children. */
  hideIcon?: boolean;
  /** Optional element placed to the right of any children and wrapped in a div with the class "right". */
  right?: ReactNode;
}) {
  return (
    <StyledStatusBadge
      data-type={type}
      data-size={size}
      data-has-icon={!hideIcon}
      {...rest}
    >
      {!hideIcon && type === "info" && <InfoCircleIcon className="icon" />}
      {!hideIcon && type === "warning" && <WarningIcon className="icon" />}
      {!hideIcon && type === "error" && <ErrorIcon className="icon" />}
      <div className="children">{children}</div>
      {right && <div className="right">{right}</div>}
    </StyledStatusBadge>
  );
}

export const StyledStatusBadge = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px 15px;
  border-radius: 6px;

  &[data-has-icon="true"] {
    padding-left: 10px;
  }

  &[data-type="info"] {
    background: ${colors.lightBlue({ lighten: 0.1 })};
    color: ${colors.lightBlue({ darken: 0.5 })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.lightBlue({ darken: 0.6 })};
      color: ${colors.lightBlue({ lighten: 0.06 })};
    }
  }

  &[data-type="warning"] {
    background: ${colors.gold({ lighten: 0.1 })};
    color: ${colors.gold({ darken: 0.55 })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.gold({ darken: 0.6 })};
      color: ${colors.gold()};
    }
  }

  &[data-type="error"] {
    background: ${colors.red({ lighten: 0.25 })};
    color: ${colors.red({ darken: 0.45 })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.red({ darken: 0.55 })};
      color: ${colors.red({ lighten: 0.2 })};
    }
  }

  > .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  > .children {
    flex-grow: 1;
    font: ${fonts.display({ size: 15, line: "21px" })};

    a,
    *[data-is-link="true"] {
      color: currentColor;
      text-decoration: underline;
    }
  }

  > .right {
    flex-shrink: 0;
    margin-left: 10px;
    display: flex;
    flex-flow: row;
    align-items: center;

    > * {
      flex-shrink: 0;
    }
  }

  &[data-size="smallest"] {
    padding: 2px 7px;
    border-radius: 3px;

    &[data-has-icon="true"] {
      padding-left: 6px;
    }

    > .icon {
      width: 13px;
      height: 13px;
      margin-right: 3px;
    }

    > .children {
      font: ${fonts.display({ size: 12, line: "16px" })};
    }
  }
`;
