import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { ActionMenu, ActionSeparator } from "./ActionMenu";
import { ActionContainer } from "./useActions";

export default {
  component: ActionMenu,
  decorators: [
    CrosswingAppDecorator({ layout: "mobile" }),
    ActionContainerDecorator,
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ActionMenu>;

function ActionContainerDecorator(Story: () => any) {
  return (
    <ActionContainer onClose={action("close")}>
      <Story />
    </ActionContainer>
  );
}

export const Menu = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      { title: "Edit Amount", onClick: action("edit amount") },
      { title: "Edit Retailer", onClick: action("edit retailer") },
    ]}
  />
);

export const Groups = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      { title: "Settings…", onClick: action("settings") },
      ActionSeparator,
      { title: "Edit Amount", disabled: true, onClick: action("edit amount") },
      { title: "Edit Retailer", onClick: action("edit retailer") },
    ]}
  />
);

export const Destructive = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      { title: "Copy", onClick: action("copy") },
      { title: "Delete", onClick: action("delete"), destructive: true },
    ]}
  />
);

export const DestructiveWithSubtitles = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      {
        title: "Personal Checking",
        subtitle: "••••1234",
        onClick: action("copy"),
      },
      {
        title: "Business Checking",
        subtitle: "••••4321",
        onClick: action("delete"),
        destructive: true,
      },
    ]}
  />
);

export const Selected = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      { title: "Red", onClick: action("red"), selected: true },
      { title: "Blue", onClick: action("blue") },
    ]}
  />
);

export const Subtitle = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      {
        title: "Standard",
        subtitle: "Normal user account",
        onClick: action("standard"),
        selected: true,
      },
      { title: "Virtual", subtitle: "Can't log in", onClick: action("blue") },
    ]}
  />
);

export const Overflow = () => (
  <ActionMenu
    onClose={action("close")}
    items={[
      { title: "Apple" },
      { title: "Blueberry" },
      { title: "Cherry" },
      { title: "Grape" },
      { title: "Lemon" },
      { title: "Lime" },
      { title: "Orange" },
      { title: "Plum" },
      { title: "Strawberry" },
    ]}
  />
);
