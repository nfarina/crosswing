import { TransitionGroup } from "react-transition-group";
import { styled } from "styled-components";
import { safeArea } from "../../host/features/safeArea";
import { Toast } from "../context/ModalContext.js";
import { ToastView } from "./ToastView.js";

export * from "./ToastView.js";

export function ToastContainer({
  toasts = [],
  onToastClose,
}: {
  toasts?: Toast[];
  onToastClose?(toast: Toast): void;
}) {
  const renderToast = (toast: Toast) => {
    const { key, ...rest } = toast;

    return (
      <ToastView key={key} {...rest} onClose={() => onToastClose?.(toast)} />
    );
  };

  return (
    <StyledToastContainer>
      <TransitionGroup component={null}>
        {toasts.map(renderToast)}
      </TransitionGroup>
    </StyledToastContainer>
  );
}

export const StyledToastContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: calc(20px + ${safeArea.top()});
  padding-right: calc(20px + ${safeArea.right()});
  padding-bottom: calc(20px + ${safeArea.bottom()});
  padding-left: calc(20px + ${safeArea.left()});
  pointer-events: none;

  > * {
    width: 350px;
    max-width: 100%;
    pointer-events: auto;
  }

  > * + * {
    margin-top: 10px;
  }
`;
