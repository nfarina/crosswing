import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";
import { usePopup } from "../modals/popup/usePopup.js";
import { ModalDecorator } from "../modals/storybook/decorators.js";
import { CrosswingAppDecorator } from "../storybook.js";
import { PopupButton } from "./PopupButton.js";
import { PopupMenu, PopupMenuText } from "./PopupMenu.js";

export default {
  component: PopupButton,
  decorators: [CrosswingAppDecorator()],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PopupButton>;

type Story = StoryObj<typeof PopupButton>;

export const Default: Story = {
  args: {
    title: "Menu",
    popup: {
      onClick: action("onClick"),
      visible: false,
    } as any,
  },
};

export const Opened: Story = {
  args: {
    title: "Menu",
    popup: {
      onClick: action("onClick"),
      visible: true,
    } as any,
  },
};

export const WithPopup: Story = {
  args: {
    title: "Options",
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [ModalDecorator, CrosswingAppDecorator({ layout: "fullscreen" })],
  render: (args) => {
    const menu = usePopup(() => (
      <PopupMenu>
        <PopupMenuText children="This is a menu." />
      </PopupMenu>
    ));

    return (
      <Centered>
        <PopupButton {...args} popup={menu} />
      </Centered>
    );
  },
};

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
