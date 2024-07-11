import { useState } from "react";
import styled from "styled-components";
import {
  ErrorView,
  StyledErrorView,
  getErrorProps,
} from "../../components/ErrorView.js";
import { ErrorLike } from "../../shared/errors.js";
import { truncate } from "../../shared/strings.js";
import { Modal } from "../context/useModal.js";
import { useDialog } from "../dialog/useDialog.js";
import { AlertButton, AlertView } from "./useAlert.js";

export type ErrorHandler = (error: ErrorLike) => void;

export function useErrorAlert({
  onClose,
}: { onClose?: () => void } = {}): Modal<Parameters<ErrorHandler>> {
  // If we were given an Error object, we can expand it to show the stack trace.
  const [expanded, setExpanded] = useState(false);

  const modal = useDialog(
    (error?: ErrorLike) => {
      const errorObj = getErrorProps(error ?? {});
      let { message, stack, userFacing } = errorObj;

      let niceMessage =
        message && userFacing !== false
          ? ensurePeriod(message)
          : "Something went wrong.";

      // If the message is super long, truncate it.
      if (niceMessage.length > 300) {
        niceMessage = truncate(niceMessage, { length: 300 });

        // If there's no stack put the full message in the stack so you can
        // scroll around to read the whole thing.
        if (!stack) {
          stack = message;
        }
      }

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
          message={niceMessage}
          children={expanded && stack && <ErrorView error={errorObj} />}
          buttons={[...(stack ? [detailsButton] : []), okButton]}
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
