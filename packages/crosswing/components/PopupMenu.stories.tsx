import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import { styled } from "styled-components";
import { usePopup } from "../modals/popup/usePopup";
import { ModalDecorator } from "../modals/storybook/ModalDecorator";
import { RouterDecorator } from "../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../theme/storybook";
import { Button } from "./Button";
import {
  PopupMenu,
  PopupMenuHeader,
  PopupMenuSelect,
  PopupMenuSeparator,
  PopupMenuText,
  PopupMenuToggle,
} from "./PopupMenu";
import { SelectOption } from "./forms/Select";

export default {
  component: PopupMenu,
  decorators: [CrosswingAppDecorator(), RouterDecorator, ModalDecorator],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PopupMenu>;

export const Mixed = () => (
  <PopupMenu>
    <PopupMenuHeader children="Account" />
    <PopupMenuText
      children="Sync with Stripe…"
      onClick={action("onStripeClick")}
    />
    <PopupMenuText
      disabled
      children="Sync with QuickBooks…"
      onClick={action("onQuickBooksClick")}
    />
    <PopupMenuText
      destructive
      children="Delete Account…"
      onClick={action("onDeleteAccountClick")}
    />
    <PopupMenuSeparator />
    <PopupMenuToggle
      children="Sort by Recently Seen"
      on={true}
      onClick={action("sortByRecent")}
    />
    <PopupMenuSeparator />
    <PopupMenuText children="Go to User" to="/users/bob" />
  </PopupMenu>
);

export const Select = () => (
  <PopupMenu>
    <PopupMenuText
      children="Adjust Widgets…"
      onClick={action("onStripeClick")}
    />
    <PopupMenuSelect>
      <SelectOption title="Red" value="red" />
      <SelectOption title="Blue" value="blue" />
    </PopupMenuSelect>
  </PopupMenu>
);

export const Dynamic: StoryObj = {
  render: () => {
    const smallMenu = (
      <PopupMenu>
        <PopupMenuText>Thing 1</PopupMenuText>
        <PopupMenuText>Thing 2</PopupMenuText>
      </PopupMenu>
    );

    const largeMenu = (
      <PopupMenu>
        {[...Array(100)].map((_, i) => (
          <PopupMenuText key={i}>Item {i + 1}</PopupMenuText>
        ))}
      </PopupMenu>
    );

    const wideMenu = (
      <PopupMenu>
        <PopupMenuText>Thing 1</PopupMenuText>
        <PopupMenuText>
          Pariatur aute incididunt amet sunt id cupidatat. Ullamco incididunt
          aliquip sunt ullamco et proident sint nulla cillum adipisicing eu.
        </PopupMenuText>
      </PopupMenu>
    );

    const popup1 = usePopup(() => smallMenu);
    const popup2 = usePopup(() => largeMenu);
    const popup3 = usePopup(() => wideMenu, { placement: "above" });
    const popup4 = usePopup(() => largeMenu, { placement: "above" });
    const popup5 = usePopup(() => smallMenu);

    return (
      <FourCorners>
        <Button primary onClick={popup1.onClick}>
          Show Menu
        </Button>
        <Button primary onClick={popup2.onClick}>
          Show Large Menu
        </Button>
        <Button primary onClick={popup3.onClick}>
          Show Wide Menu
        </Button>
        <Button primary onClick={popup4.onClick}>
          Show Large Menu
        </Button>
        <Button primary onClick={popup5.onClick}>
          Show Menu
        </Button>
      </FourCorners>
    );
  },
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    RouterDecorator,
    ModalDecorator,
  ],
  parameters: {
    layout: "fullscreen",
  },
};

//
// Components
//

const FourCorners = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  > *:nth-child(1) {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  > *:nth-child(2) {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  > *:nth-child(3) {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  > *:nth-child(4) {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }

  > *:nth-child(5) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
