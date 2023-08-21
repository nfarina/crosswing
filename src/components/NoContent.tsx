import React, { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../theme/colors/colors";
import { fonts } from "../theme/fonts";
import { Button } from "./Button";
import { Clickable } from "./Clickable";
import { LinkButton } from "./LinkButton";

export function NoContent({
  title,
  subtitle,
  primaryText,
  children,
  action,
  actionTo,
  actionWorking,
  primaryAction,
  onActionClick,
  orAction,
  orText,
  onOrActionClick,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  primaryText?: boolean;
  action?: ReactNode;
  actionTo?: string;
  actionWorking?: boolean;
  primaryAction?: boolean;
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  orAction?: ReactNode;
  orText?: ReactNode;
  onOrActionClick?: () => void;
}) {
  return (
    <StyledNoContent data-primary-text={!!primaryText} {...rest}>
      {title && <div className="title">{title}</div>}
      {subtitle && <div className="subtitle">{subtitle}</div>}
      {action && !actionTo && (
        <Button
          className="action"
          children={action}
          onClick={onActionClick}
          primary={primaryAction}
          working={actionWorking}
        />
      )}
      {action && actionTo && (
        <LinkButton
          className="action"
          children={action}
          to={actionTo}
          primary={primaryAction}
        />
      )}
      {orAction && (
        <Clickable className="or" onClick={onOrActionClick}>
          {orText ?? "or"} <span className="link">{orAction}</span>
        </Clickable>
      )}
      {!!children && <div className="children">{children}</div>}
    </StyledNoContent>
  );
}

export const StyledNoContent = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 30px 10px;
  box-sizing: border-box;
  background: ${colors.textBackground()};

  > * {
    max-width: 400px;
    flex-shrink: 0;
  }

  > .title {
    font: ${fonts.display({ size: 20, line: "1.4" })};
    color: ${colors.textSecondary()};
    text-align: center;

    a {
      text-decoration: none;
      color: ${colors.primary()};
    }
  }

  > .subtitle {
    font: ${fonts.display({ size: 16, line: "28px" })};
    color: ${colors.textSecondary()};
    text-align: center;
    word-break: break-word;

    a {
      text-decoration: none;
      color: ${colors.primary()};
    }
  }

  &[data-primary-text="true"] {
    > .title,
    > .subtitle {
      color: ${colors.text()};
    }
  }

  > * + * {
    margin-top: 30px;
  }

  > .or {
    font: ${fonts.display({ size: 14, line: "22px" })};
    color: ${colors.text()};
    text-align: center;

    > .link {
      color: ${colors.text()};
      border-bottom: 1px dotted ${colors.textSecondary()};
    }
  }

  > .children {
    margin-top: 30px;
  }
`;
