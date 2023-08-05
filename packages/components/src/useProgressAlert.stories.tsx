import { useAsyncTask } from "@cyber/hooks/useAsyncTask";
import { useErrorAlert } from "@cyber/modals/alert/error";
import { ModalDecorator } from "@cyber/modals/storybook";
import { wait } from "@cyber/shared/wait";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import { useProgressAlert } from "./useProgressAlert.js";

export default {
  component: useProgressAlert,
  decorators: [CyberAppDecorator({ layout: "mobile" }), ModalDecorator],
  parameters: { layout: "centered" },
};

export const Indeterminate = () => {
  const errorAlert = useErrorAlert();
  const progressAlert = useProgressAlert();

  useAsyncTask({
    async func() {
      progressAlert.show("Processing Payment…");

      await wait(2000);

      progressAlert.hide();
    },
    runOnMount: true,
    onError: errorAlert.show,
    onFinally: progressAlert.hide,
  });

  return null;
};

export const IndeterminateWithoutMessage = () => {
  const errorAlert = useErrorAlert();
  const progressAlert = useProgressAlert();

  useAsyncTask({
    async func() {
      progressAlert.show();

      await wait(2000);

      progressAlert.hide();
    },
    runOnMount: true,
    onError: errorAlert.show,
    onFinally: progressAlert.hide,
  });

  return null;
};

export const IndeterminateWithError = () => {
  const errorAlert = useErrorAlert();
  const progressAlert = useProgressAlert();

  useAsyncTask({
    async func() {
      console.log("Running func!");
      progressAlert.show("Processing Payment…");

      await wait(2000);

      if (window) throw new Error("Test error!");
    },
    onError: errorAlert.show,
    onFinally: progressAlert.hide,
    runOnMount: true,
  });

  return null;
};

export const Progress = () => {
  const errorAlert = useErrorAlert();
  const progressAlert = useProgressAlert({ onCancel: () => task.cancel() });

  const task = useAsyncTask({
    async func() {
      progressAlert.setProgress(0);
      progressAlert.show("Issuing Cards…");

      for (let i = 1; i <= 10; i++) {
        if (this.isCanceled()) {
          action("task")("Task was canceled!");
          break;
        }

        await wait(250);
        progressAlert.setProgress(i / 10);

        if (i > 5) {
          progressAlert.show("Almost Done…");
        }
      }

      await wait(1000);
    },
    runOnMount: true,
    onError: errorAlert.show,
    onFinally: progressAlert.hide,
  });

  return null;
};
