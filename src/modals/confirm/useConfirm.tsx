import React, { ReactNode } from "react";
import { AlertButton, AlertView } from "../alert/AlertView.js";
import { Modal } from "../context/useModal.js";
import { useDialog } from "../dialog/useDialog.js";

export interface Confirm {
  title?: ReactNode;
  message?: ReactNode;
  children?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  destructiveText?: ReactNode;
  /** Can the OK button be clicked? */
  canConfirm?: boolean;
  onConfirm: () => void;
}

type Falsy = false | 0 | "" | null | undefined;

export function useConfirm<T extends any[]>(
  renderConfirm: (...args: T) => Confirm | Falsy,
): Modal<T> {
  const dialog = useDialog((...args: T) => {
    const confirm = renderConfirm(...args);

    if (!confirm) return null;

    const {
      title,
      message,
      children,
      okText,
      cancelText,
      destructiveText,
      canConfirm = true,
      onConfirm,
    } = confirm;

    const cancelButton: AlertButton = {
      title: cancelText || "Cancel",
    };

    const okButton: AlertButton = {
      title: destructiveText || okText || "OK",
      primary: true,
      destructive: !!destructiveText,
      disabled: !canConfirm,
      onClick: onConfirm,
    };

    return (
      <AlertView
        title={title}
        message={message}
        children={children}
        onClose={dialog.hide}
        buttons={[cancelButton, okButton]}
      />
    );
  });

  return dialog;
}
