import { fonts } from "@cyber/theme/fonts";
import { ReactNode } from "react";
import { styled } from "styled-components";
import { Button } from "../Button";
import { StatusBadge } from "./StatusBadge";

export function StatusBanner({
  action,
  actionWorking,
  onActionClick,
  floating,
  ...rest
}: Parameters<typeof StatusBadge>[0] & {
  action?: ReactNode;
  actionWorking?: boolean;
  onActionClick?: () => void;
  floating?: boolean;
}) {
  const actionButton = action ? (
    <ActionButton
      className="action"
      title={action}
      onClick={() => onActionClick?.()}
      // We don't use the "working" property because it adds a spinner to
      // the button, making it wider which can cause the message to be
      // shifted around.
      disabled={actionWorking}
    />
  ) : null;

  return (
    <StyledStatusBanner
      data-has-action={!!action}
      data-action-working={!!actionWorking}
      data-floating={!!floating}
      right={actionButton}
      {...rest}
      onClick={onActionClick ?? rest.onClick}
    />
  );
}

export const StyledStatusBanner = styled(StatusBadge)`
  padding: 10px;
  padding-bottom: 9px;
  align-items: flex-start;

  &[data-floating="false"] {
    border-radius: 0;
  }

  &[data-has-action="true"] {
    cursor: pointer;

    > svg,
    > .children {
      margin-top: 1.5px;
    }
  }

  &[data-action-working="true"] {
    cursor: default;
  }

  &[data-floating="true"] {
    border-radius: 6px;
  }
`;

const ActionButton = styled(Button)`
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 9999px;
  min-height: 0;
  padding: 4px 10px;
  color: currentColor;

  > .content > .title {
    font: ${fonts.displayMedium({ size: 12 })};
    color: currentColor;
  }
`;
