import { useAsyncTask } from "@crosswing/hooks/useAsyncTask";
import { wait } from "@crosswing/shared/wait";
import { colors } from "@crosswing/theme/colors";
import { fonts } from "@crosswing/theme/fonts";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { styled } from "styled-components";
import { DialogContainer } from "../dialog/useDialog";
import { AlertView } from "./AlertView";

export default {
  component: AlertView,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    DialogContainerDecorator,
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AlertView>;

function DialogContainerDecorator(Story: () => any) {
  return (
    <DialogContainer onClose={action("close")}>
      <Story />
    </DialogContainer>
  );
}

export const ShortText = () => (
  <AlertView
    title="Notice"
    message="You have been put on notice."
    buttons={[{ primary: true, title: "Understood" }]}
    onClose={action("close")}
  />
);

export const LongText = () => (
  <AlertView
    title="Using development server"
    message="Running scripts on the development server can trigger extra security layers on some banks."
    buttons={[{ title: "OK", primary: true }]}
    onClose={action("close")}
  />
);

export const TitleOnly = () => (
  <AlertView
    title="Something happened."
    buttons={[{ title: "OK", primary: true }]}
    onClose={action("close")}
  />
);

export const MessageOnly = () => (
  <AlertView
    message="You have been put on notice."
    buttons={[{ title: "OK", primary: true }]}
    onClose={action("close")}
  />
);

export const WithChildren = () => (
  <AlertView
    title="Title"
    message="With message!"
    children={<Content className="content">Children in a div!</Content>}
    buttons={[{ title: "OK", primary: true }]}
    onClose={action("close")}
  />
);

export const WithChildrenStretched = () => (
  <AlertView
    style={{ height: "400px" }}
    title="Title"
    message="With message!"
    children={<Content className="content">Children in a div!</Content>}
    buttons={[{ title: "OK", primary: true }]}
    onClose={action("close")}
  />
);

export const LeaveOpen = () => {
  const onClose = action("close");

  const saveTask = useAsyncTask({
    func: () => wait(2000),
    onComplete: onClose,
    onError: null,
  });

  return (
    <AlertView
      message="Save now?"
      buttons={[
        { title: "Cancel" },
        {
          title: "Save",
          primary: true,
          onClick: saveTask.run,
          disabled: saveTask.isRunning,
          leaveOpen: true,
        },
      ]}
      onClose={onClose}
    />
  );
};

const Content = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${colors.textBackgroundAlt()};
  font: ${fonts.display({ size: 12 })};
  color: ${colors.text()};
  border-top: 1px solid ${colors.controlBorder({ alpha: 0.5 })};
`;
