import { ReactNode } from "react";
import { Modal } from "../context/useModal";
import { UseDialogOptions, useDialog } from "../dialog/useDialog";
import { AlertButton, AlertView } from "./AlertView";

export * from "./AlertView";

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
