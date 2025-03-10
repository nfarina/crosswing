import { FormEvent, KeyboardEvent, ReactNode, useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { AlertButton, AlertView } from "../../modals/alert/AlertView.js";
import { Modal } from "../../modals/context/useModal.js";
import { useDialog } from "../../modals/dialog/useDialog.js";
import { StyledTextArea, TextArea } from "./TextArea.js";
import { InputTransformer, useInputValue } from "./useInputValue.js";

// Automagically adjusts the type given to onSubmit() to be nullable, based on
// whether you've provided nullable = true.
export type Prompt<T> = RequiredPrompt<T> | NullablePrompt<T>;

export type BasePrompt<T> = {
  title?: ReactNode;
  message?: ReactNode;
  placeholder?: string;
  spellCheck?: boolean;
  okText?: string;
  cancelText?: string;
  destructiveText?: string;
  initialValue?: T;
  initialStringValue?: string;
  numeric?: boolean;
  leaveOpen?: boolean;
  working?: boolean;
  transformer?: InputTransformer<T>;
  validate?: (value: T) => void;
};

export type RequiredPrompt<T> = BasePrompt<T> & {
  onSubmit?: (value: T) => void;
};

export type NullablePrompt<T> = BasePrompt<T> & {
  nullable: true;
  onSubmit?: (value: T | null) => void;
};

export function usePrompt<T extends any[], U = string>(
  renderPrompt: (...args: T) => Prompt<U>,
): Modal<T> {
  const dialog = useDialog((...args: T) => (
    <PromptView prompt={renderPrompt(...args)} onClose={dialog.hide} />
  ));
  return dialog;
}

export function PromptView<T = string>({
  prompt,
  onClose,
}: {
  prompt: Prompt<T>;
  onClose: () => void;
}) {
  const {
    title,
    message,
    placeholder,
    spellCheck,
    okText,
    cancelText,
    destructiveText,
    initialValue,
    initialStringValue: defaultValue,
    leaveOpen,
    working,
    transformer,
    numeric,
    validate,
    onSubmit,
  } = prompt;

  const nullable = "nullable" in prompt && !!prompt.nullable;

  const input = useInputValue({
    initialValue,
    initialStringValue: defaultValue,
    transformer,
    onValueChange,
    validate,
  });

  const [error, setError] = useState<Error | null>(input.error);

  const canSubmit = (() => {
    // You can always submit nullable prompts. They may not validate though and
    // you'll get an error message.
    if (nullable) return true;

    if (transformer) {
      // If you have a transformer, check to see if the resulting string value
      // is empty or not.
      // Actually this check will make it impossible to see the errors from
      // the transformer since they aren't displayed until you click OK.
      // return !!transformer.format(input.value);
    }

    // Otherwise just check to see if you've entered anything.
    return !!input.props.value;
  })();

  const cancelButton: AlertButton = {
    title: cancelText || "Cancel",
  };

  const okButton: AlertButton = {
    title: destructiveText || okText || "OK",
    primary: true,
    autoFocus: false, // Don't steal focus from the text field.
    destructive: !!destructiveText,
    disabled: !canSubmit || !!working,
    leaveOpen: true, // We close the dialog ourselves only if the input validates.
    onClick: trySubmit,
  };

  function onValueChange(newValue: T | null, newStringValue: string) {
    if (!newStringValue || newValue) {
      // Clear out the error if you're starting over, or if you have a valid
      // value at any point.
      setError(null);
    }
  }

  function trySubmit() {
    if (!canSubmit) return;
    if (input.error) {
      // Now's the time to show any errors.
      setError(input.error);
    } else {
      onSubmit?.(input.value as any);
      if (!leaveOpen) onClose();
    }
  }

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    trySubmit();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      trySubmit();
    }
  }

  // We want to render our own errors instead of relying on TextInput's error
  // badges, because we're short on horizontal space in our AlertView.
  const { error: _, ...inputProps } = input.props;

  return (
    <AlertView
      title={title}
      message={message}
      onClose={onClose}
      buttons={[cancelButton, okButton]}
    >
      <StyledForm onSubmit={onFormSubmit}>
        <TextArea
          placeholder={placeholder}
          autoFocus
          autoSelect
          spellCheck={!!spellCheck}
          disabled={!!working}
          autoSizing
          onKeyDown={onKeyDown}
          {...inputProps}
        />
        {!!error && <div className="error">{error.message}</div>}
      </StyledForm>
    </AlertView>
  );
}

const StyledForm = styled.form`
  > ${StyledTextArea} {
    width: 100%;
    box-shadow: 0 -1px 0 ${colors.controlBorder()};
    max-height: 200px;
    overflow-y: auto;

    > textarea {
      padding: 18.5px 10px; /* For legacy compatibility with previous TextInput approach. */
    }
  }

  > .error {
    padding: 15px 25px;
    font: ${fonts.displayMedium({ size: 14 })};
    color: ${colors.red()};
    text-align: center;
    box-shadow: 0 -1px 0 ${colors.controlBorder()};

    @media (prefers-color-scheme: dark) {
      box-shadow: 0 -1px 0 ${colors.controlBorder()};
    }
  }
`;
