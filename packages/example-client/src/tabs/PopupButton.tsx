import { Button } from "@cyber/components/Button";
import {
  PopupMenu,
  PopupMenuHeader,
  PopupMenuText,
} from "@cyber/components/PopupMenu";
import { usePopup } from "@cyber/modals/popup";
import React from "react";

export default function PopupButton() {
  const popup = usePopup(() => (
    <PopupMenu>
      <PopupMenuHeader children="Message" />
      <PopupMenuText children="Hello World" />
    </PopupMenu>
  ));

  return <Button primary title="Show Popup" onClick={popup.onClick} />;
}
