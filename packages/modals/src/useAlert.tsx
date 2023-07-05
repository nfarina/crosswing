import React, { ReactNode } from "react";
import { AlertButton, AlertView } from "./AlertView.js";
import { UseDialogOptions, useDialog } from "./useDialog.js";
import { Modal } from "./useModal.js";

export interface Alert {
  title?: ReactNode;
  message?: ReactNode;
  children?: ReactNode;
  okText?: string;
  onClose?: () => void;
  hideButtons?: boolean;
}

export function useAlert<T extends any[]>(
  renderAlert: (...args: T) => Alert | string,
  options?: UseDialogOptions,
): Modal<T> {
  const modal = useDialog((...args: T) => {
    const alert = renderAlert(...args);
    const { title, message, children, okText, hideButtons, onClose } =
      typeof alert === "string"
        ? {
            title: "",
            message: alert,
            children: null,
            okText: "OK",
            hideButtons: false,
            onClose: () => {},
          }
        : alert;

    function onAlertClose() {
      onClose?.();
      modal.hide();
    }

    const okButton: AlertButton = {
      title: okText || "OK",
      primary: true,
    };

    return (
      <AlertView
        title={title}
        message={message}
        children={children}
        buttons={hideButtons ? [] : [okButton]}
        onClose={onAlertClose}
      />
    );
  }, options);

  return modal;
}
