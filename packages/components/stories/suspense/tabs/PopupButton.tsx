import { usePopup } from "@cyber/modals/popup";
import { Button } from "../../../Button";
import { PopupMenu, PopupMenuHeader, PopupMenuText } from "../../../PopupMenu";

export default function PopupButton() {
  const popup = usePopup(() => (
    <PopupMenu>
      <PopupMenuHeader children="Message" />
      <PopupMenuText children="Hello World" />
    </PopupMenu>
  ));

  return <Button primary title="Show Popup" onClick={popup.onClick} />;
}
