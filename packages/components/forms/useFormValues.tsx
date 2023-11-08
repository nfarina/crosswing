import { NavAccessory } from "@cyber/router/navs";
import { ButtonHTMLAttributes, FormHTMLAttributes } from "react";
import { InputValue } from "./useInputValue";
import { ObjectValue } from "./useObjectValue";
import { ToggleValue } from "./useToggleValue";

export type FormValue = InputValue<any> | ToggleValue | ObjectValue<any>;

export type FormValues = {
  submit: () => void;
  canSubmit: boolean;
  /** Should be spread onto to `form`. */
  props: Pick<FormHTMLAttributes<HTMLFormElement>, "onKeyDown">;
  /** Props for form elements; simply propagates the `disabled` prop. */
  valueProps<T extends FormValue>(value: T): T["props"];
  /** Props for a NavAccessory that should submit the form. */
  navProps: Pick<NavAccessory, "onClick" | "disabled">;
  /** Props for a <button> that should submit the form. */
  buttonProps: Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "disabled"
  >;
};

/** Meant for useAsyncTask to conform to. */
export type TaskLike = {
  run: () => void;
  isRunning: boolean;
};

/**
 * Provides an abstraction around a set of FormValues.
 */
export function useFormValues({
  inputs,
  onSubmit,
  disabled,
  task,
  defaultCanSubmit = false,
}: {
  inputs: FormValue[];
  onSubmit?: () => void;
  /**
   * Pass true to automatically disable any inputs spread onto components
   * via `form.valueProps()`.
   */
  disabled?: boolean;
  /**
   * If you pass a task, we will automatically wire up:
   *   onSubmit -> task.run
   *   disabled -> task.isRunning
   */
  task?: TaskLike;
  /**
   * Usually the default state of the form, as initially presented without any
   * changes by the user, is not submittable. This is useful for presenting a
   * form containing object properties. If you pass `true`, we will assume that
   * the form is submittable by default even without changing anything.
   */
  defaultCanSubmit?: boolean;
}): FormValues {
  const hasErrors = inputs.some((input) => "error" in input && input.error);
  const hasChanged = inputs.some((input) => input.hasChanged);

  // Unless you specified a value for disabled, we'll set it based on the task,
  // if known.
  if (disabled === undefined) {
    disabled = task?.isRunning ?? false;
  }

  const canSubmit = !hasErrors && (hasChanged || defaultCanSubmit) && !disabled;

  function submit() {
    // If you can't actually submit, this is a programming error.
    if (!canSubmit) {
      console.error("Attempted to submit a form not currently submittable.");
      return;
    }

    task?.run();
    onSubmit?.();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!canSubmit) {
      return;
    }

    if (event.key === "Enter") {
      // First check that you aren't in some control that would likely handle
      // the enter key. Unless you're holding "meta" (command), in which case
      // you probably want to submit the form.
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA" && !event.metaKey) {
        return;
      }

      event.preventDefault();
      submit();
    }
  }

  function valueProps<T extends FormValue>(value: T) {
    return {
      ...value.props,
      disabled: disabled || value.props.disabled,
    };
  }

  return {
    submit,
    canSubmit,
    props: { onKeyDown },
    valueProps,
    navProps: { onClick: submit, disabled: !canSubmit },
    buttonProps: { onClick: submit, disabled: !canSubmit },
  };
}
