import { ReactNode, useState } from "react";
import { styled } from "styled-components";
import { AlertButton, AlertView } from "../modals/alert/AlertView.js";
import { Modal } from "../modals/context/useModal.js";
import { useDialog } from "../modals/dialog/useDialog.js";
import { ProgressView } from "./ProgressView.js";

export type ProgressHandler = (message?: ReactNode) => void;

export interface ProgressModal extends Modal<Parameters<ProgressHandler>> {
  setProgress(progress: number | null): void;
}

/**
 * A sticky alert that displays a progress donut and a message, along with a
 * cancel button (if an onCancel handler is provided).
 */
export function useProgressAlert({
  onCancel,
}: {
  onCancel?: () => void;
} = {}): ProgressModal {
  const [progress, setProgress] = useState<number | null>(null);

  // const [canceling, setCanceling] = useState(false);

  const cancelButton: AlertButton = {
    title: "Cancel",
    onClick: () => {
      onCancel?.();
      // setCanceling(true);
    },
    // disabled: canceling,
    // leaveOpen: true,
  };

  const modal = useDialog(
    (message?: ReactNode) => (
      <StyledAlertView
        onClose={modal.hide}
        message={message}
        buttons={onCancel ? [cancelButton] : undefined}
        data-has-message={!!message}
        children={<ProgressView size="50px" progress={progress} />}
      />
    ),
    { sticky: true },
  );

  return {
    show(message?: ReactNode) {
      // Reset state to initial.
      // setCanceling(false);

      modal.show(message);
    },
    hide: modal.hide,
    isVisible: modal.isVisible,
    setProgress,
  };
}

const StyledAlertView = styled(AlertView)`
  > .children {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  &[data-has-message="true"] {
    > .children {
      padding-top: 0;
      margin-top: -10px;
    }
  }

  &[data-has-message="false"] {
    min-width: unset;
  }
`;
