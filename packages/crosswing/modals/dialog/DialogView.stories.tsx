import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";
import { styled } from "styled-components";
import { TextInput } from "../../components/forms/TextInput.js";
import { useFormValues } from "../../components/forms/useFormValues.js";
import { useInputValue } from "../../components/forms/useInputValue.js";
import { TipView } from "../../components/TipView.js";
import { InfoCircleIcon } from "../../icons/InfoCircle.js";
import { RouterDecorator } from "../../router/storybook/RouterDecorator.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { ModalDecorator } from "../storybook/decorators.js";
import { DialogView } from "./DialogView.js";

export default {
  component: DialogView,
  decorators: [CrosswingAppDecorator(), ModalDecorator, RouterDecorator],
  parameters: {
    layout: "centered",
    backgrounds: { default: "modal" },
  },
} satisfies Meta<typeof DialogView>;

type Story = StoryFn<typeof DialogView>;

export const Basic: Story = () => (
  <DialogView
    title="Basic dialog"
    onClose={action("onClose")}
    children="This is a basic dialog with some content."
    buttons={[
      { title: "Cancel", onClick: action("cancel") },
      { title: "Confirm", primary: true, onClick: action("confirm") },
    ]}
  />
);

export const ProjectCreation: Story = () => {
  const projectName = useInputValue({
    required: true,
    validate: (value) => {
      if (value === "banana") {
        throw new Error("Bananas are not allowed!");
      }
    },
  });

  const form = useFormValues({
    inputs: [projectName],
    onSubmit: action("submit"),
  });

  return (
    <DialogView
      {...form.props}
      title="Project name"
      onClose={action("onClose")}
      buttons={[
        { title: "Cancel", onClick: action("cancel") },
        {
          title: "Create project",
          primary: true,
          autoFocus: false,
          onClick: action("create"),
          type: "submit",
          ...form.buttonProps,
        },
      ]}
    >
      <ProjectForm>
        <TextInput
          newStyle
          {...form.valueProps(projectName)}
          placeholder="Enter project name (use 'banana' for an error)"
          // errorStyle="none"
          autoFocus
        />
        <TipView icon={<InfoCircleIcon />} title="What's a project?">
          Projects keep chats, files, and custom instructions in one place. Use
          them for ongoing work, or just to keep things tidy.
        </TipView>
      </ProjectForm>
    </DialogView>
  );
};

export const LongContent: Story = () => (
  <DialogView
    title="Dialog with long content"
    onClose={action("onClose")}
    buttons={[
      { title: "Cancel", onClick: action("cancel") },
      { title: "Save", primary: true, onClick: action("save") },
    ]}
  >
    <p>This dialog has a lot of content to demonstrate scrolling.</p>
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
    ))}
  </DialogView>
);

export const NoButtons: Story = () => (
  <DialogView title="No buttons dialog" onClose={action("onClose")}>
    This dialog has no footer buttons, only the close X.
  </DialogView>
);

export const NoTitle: Story = () => (
  <DialogView
    onClose={action("onClose")}
    hideCloseButton
    buttons={[
      { title: "Cancel", onClick: action("cancel") },
      { title: "OK", primary: true, onClick: action("ok") },
    ]}
  >
    This dialog has no header title, only content and buttons.
  </DialogView>
);

export const WorkingState: Story = () => {
  const [working, setWorking] = useState(false);

  function handleSubmit() {
    setWorking(true);
    action("submit")();
    setTimeout(() => setWorking(false), 2000);
  }

  return (
    <DialogView
      title="Working state example"
      onClose={action("onClose")}
      disabled={working}
      buttons={[
        { title: "Cancel", onClick: action("cancel") },
        {
          title: "Submit",
          primary: true,
          working,
          onClick: handleSubmit,
        },
      ]}
    >
      <p>Click Submit to see the working state.</p>
    </DialogView>
  );
};

export const MultipleButtons: Story = () => (
  <DialogView
    title="Multiple buttons"
    onClose={action("onClose")}
    buttons={[
      { title: "Cancel", onClick: action("cancel") },
      { title: "Save Draft", onClick: action("save-draft") },
      { title: "Publish", primary: true, onClick: action("publish") },
    ]}
  >
    <p>This dialog demonstrates multiple action buttons.</p>
  </DialogView>
);

const ProjectForm = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
`;
