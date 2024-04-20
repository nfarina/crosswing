import { useState } from "react";
import styled from "styled-components";
import { ErrorView, StyledErrorView } from "../../components/ErrorView.js";
import { Modal } from "../context/useModal.js";
import { useDialog } from "../dialog/useDialog.js";
import { AlertButton, AlertView } from "./useAlert.js";

export type ErrorHandler = (error: Error | string) => void;

export function useErrorAlert({
  onClose,
}: { onClose?: () => void } = {}): Modal<Parameters<ErrorHandler>> {
  // If we were given an Error object, we can expand it to show the stack trace.
  const [expanded, setExpanded] = useState(false);

  function getMessage(error?: Error | string) {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return ensurePeriod(error.message);
    } else {
      return "Something went wrong.";
    }
  }

  const modal = useDialog(
    (error?: Error | string) => {
      const message = getMessage(error);

      function onAlertClose() {
        onClose?.();
        modal.hide();
      }

      const detailsButton: AlertButton = {
        title: "Details",
        onClick: () => setExpanded((expanded) => !expanded),
        leaveOpen: true,
      };

      const okButton: AlertButton = {
        title: "OK",
        primary: true,
      };

      return (
        <ErrorAlertView
          title="Error"
          message={message}
          children={
            expanded && error instanceof Error && <ErrorView error={error} />
          }
          buttons={[
            ...(error instanceof Error ? [detailsButton] : []),
            okButton,
          ]}
          onClose={onAlertClose}
          data-expanded={expanded}
        />
      );
    },
    { stretch: expanded },
  );

  return modal;
}

function ensurePeriod(str: string): string {
  str = str.trim();
  // Add a period if the string doesn't end with a period, question mark, or exclamation point.
  if (!/[.!?]$/.test(str)) {
    str += ".";
  }
  return str;
}

const ErrorAlertView = styled(AlertView)`
  &[data-expanded="true"] {
    max-width: 100%;
  }

  ${StyledErrorView} {
    max-height: 250px;
  }
`;
