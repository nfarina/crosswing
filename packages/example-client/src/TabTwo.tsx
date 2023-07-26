import { NoContent } from "@cyber/components/NoContent";
import {
  PopupMenu,
  PopupMenuHeader,
  PopupMenuText,
} from "@cyber/components/PopupMenu";
import { usePopup } from "@cyber/modals/popup";
import React from "react";

export default function TabTwo() {
  const popupMenu = usePopup(() => (
    <PopupMenu>
      <PopupMenuHeader children="Message" />
      <PopupMenuText children="Hello World" />
    </PopupMenu>
  ));

  return (
    <NoContent
      title="Tab Two"
      action="Show Popup"
      primaryAction
      onActionClick={popupMenu.onClick}
    />
  );
}
