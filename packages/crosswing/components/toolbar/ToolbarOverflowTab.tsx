import {
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { flattenChildren } from "../../hooks/flattenChildren";
import DownArrow from "../../icons/DownArrow.svg?react";
import { usePopup } from "../../modals/popup/usePopup";
import { useRouter } from "../../router/context/RouterContext";
import { colors } from "../../theme/colors/colors";
import { PopupMenu, PopupMenuText } from "../PopupMenu";
import { ToolbarTab, ToolbarTabProps } from "./ToolbarTab";

/**
 * Like a <ToolbarTab> but with a built-in "overflow" menu to contain the actual
 * <ToolbarTab> links.
 */
export function ToolbarOverflowTab({ children }: { children: ReactNode }) {
  const { location } = useRouter();

  const [lastTab, setLastTab] = useState<ReactElement<ToolbarTabProps> | null>(
    null,
  );

  const arrowRef = useRef<HTMLDivElement | null>(null);

  // Coerce children to array, flattening fragments and falsy conditionals.
  const items = flattenChildren(children);

  // Just the <ToolbarTab> children.
  const tabs = items.filter(isToolbarTab);

  // Popup that appears when clicking the disclosure arrow.
  // Transforms <ToolbarTab> children into <PopupMenuText> children.
  // Renders the rest unmodified.
  const popup = usePopup(() => (
    <PopupMenu>
      {items.map((item) =>
        isToolbarTab(item) ? (
          <PopupMenuText
            key={item.props.to}
            to={location.linkTo(item.props.to ?? "")}
            children={item.props.children}
          />
        ) : (
          item
        ),
      )}
    </PopupMenu>
  ));

  const currentPath = location.href({ excludeSearch: true });

  const selectedTab = tabs.find(
    (tab) =>
      tab.props.to && currentPath.startsWith(location.linkTo(tab.props.to)),
  );

  // Store the currently selected tab in lastTab so we can restore it when
  // nothing in the overflow menu is selected.
  useEffect(() => {
    if (selectedTab) {
      setLastTab(selectedTab ?? null);
    }
  }, [selectedTab?.props.to]);

  const tab = selectedTab ?? lastTab ?? tabs[0] ?? null;

  function onArrowClick(e: MouseEvent<HTMLDivElement>) {
    // Don't let the click bubble up.
    e.stopPropagation();

    // Also don't let the <a> link be followed.
    e.preventDefault();

    popup.toggle(arrowRef);
  }

  function onSelectedTabClick() {
    // If you clicked the tab while it's active, then pop the menu up.
    popup.toggle(arrowRef);
  }

  return (
    <StyledToolbarOverflowTab
      to={selectedTab ? undefined : tab?.props.to}
      onClick={selectedTab ? onSelectedTabClick : undefined}
      children={
        <>
          <div className="text">{tab?.props.children ?? "More"}</div>
          <div className="separator" />
          <div className="arrow" onClick={onArrowClick} ref={arrowRef}>
            <DownArrow />
          </div>
        </>
      }
      selected={!!selectedTab}
    />
  );
}

function isToolbarTab(item: ReactNode): item is ReactElement<ToolbarTabProps> {
  return isValidElement(item) && !!item.type?.["isToolbarTab"];
}

export const StyledToolbarOverflowTab = styled(ToolbarTab)`
  /* "Undo" the padding set by ToolbarTab. */
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;

  > .separator {
    align-self: stretch;
    margin: 7px 0 7px 10px;
    width: 1px;
    background: ${colors.separator()};
  }

  &[data-selected="true"] {
    > .separator {
      display: none;
    }
  }

  > .arrow {
    padding: 0 5px 0 3px;
    align-self: stretch;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;

    > svg {
      path {
        fill: currentColor;
      }
    }
  }
`;
