import { ReactNode } from "react";
import { styled } from "styled-components";
import { usePopup } from "../../modals/popup/usePopup.js";
import { PopupButton } from "../PopupButton.js";
import { PopupMenu, PopupMenuText } from "../PopupMenu.js";

export type DropdownItem = Parameters<typeof PopupMenuText>[0] & {
  value: string;
  /** Custom display text for the item when it's selected (can be different from children, which is used for the popup menu). */
  display?: ReactNode;
};

export function Dropdown({
  items = [],
  value,
  onValueChange,
  placeholder = "Select",
  disabled,
  ...rest
}: Omit<Parameters<typeof PopupButton>[0], "popup"> & {
  items?: DropdownItem[];
  value?: string;
  onValueChange?: (newValue: string) => void;
  placeholder?: string;
}) {
  const selectedItem = items.find((item) => item.value === value);

  function renderDisplayText() {
    if (selectedItem && selectedItem.display) {
      return selectedItem.display;
    } else if (selectedItem && selectedItem.children) {
      return selectedItem.children;
    } else {
      return placeholder;
    }
  }

  const popup = usePopup(() => (
    <PopupMenu>
      {items.map(({ value: itemValue, ...itemProps }) => (
        <PopupMenuText
          key={itemValue}
          checked={itemValue === value}
          onClick={() => onValueChange?.(itemValue)}
          {...itemProps}
        />
      ))}
    </PopupMenu>
  ));

  return (
    <StyledDropdown
      newStyle
      popup={popup}
      disabled={disabled || items.length === 0}
      {...rest}
    >
      <span className="text">{renderDisplayText()}</span>
    </StyledDropdown>
  );
}

export const StyledDropdown = styled(PopupButton)`
  &[data-new-style="true"] {
    min-height: 36px;
  }
`;
