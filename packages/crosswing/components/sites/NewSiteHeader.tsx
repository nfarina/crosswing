import { use, useEffect } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { SidebarIcon } from "../../icons/Sidebar";
import { SidebarMenuIcon } from "../../icons/SidebarMenu";
import { usePopup } from "../../modals/popup/usePopup";
import { sort } from "../../shared/sort";
import { AutoBorderView } from "../AutoBorderView";
import { Button, StyledButton } from "../Button";
import { PopupButton } from "../PopupButton";
import { PopupMenu, PopupMenuHeader, PopupMenuText } from "../PopupMenu";
import { NewSiteContext } from "./NewSiteContext";
import { SiteHeaderAccessoryView } from "./SiteHeaderAccessory";

export function NewSiteHeader({ siteTitle }: { siteTitle: string }) {
  const { sidebarVisible, setSidebarVisible, pages, sidebarMode, accessories } =
    use(NewSiteContext);

  const sorted = sort(Array.from(pages.values()), (a) => a.link.length);

  const [currentPage] = sorted.slice(-1);

  // Use the current page for the document title.
  useEffect(() => {
    if (currentPage) document.title = currentPage.title + " | " + siteTitle;
    else document.title = siteTitle;
  });

  const backStack = sorted.slice(0, -2).reverse();

  const pagesPopup = usePopup(() => (
    <PopupMenu>
      <PopupMenuHeader children="Navigate back to" />
      {backStack.map((page) => (
        <PopupMenuText key={page.link} to={page.link} children={page.title} />
      ))}
      <PopupMenuText to="/">Home</PopupMenuText>
    </PopupMenu>
  ));

  return (
    <StyledNewSiteHeader
      data-sidebar-mode={sidebarMode}
      data-sidebar-visible={sidebarVisible}
    >
      <div
        className="sidebar-toggle"
        data-visible={!sidebarVisible || sidebarMode === "overlay"}
      >
        <Button
          data-tooltip="Open sidebar"
          icon={
            sidebarMode === "overlay" ? <SidebarMenuIcon /> : <SidebarIcon />
          }
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
      </div>
      <div className="title-left" />
      <PopupButton
        className="page-title"
        title={currentPage?.title}
        popup={pagesPopup}
        hideDisclosure
      />
      <div className="title-right" />
      <div className="accessories">
        {accessories
          .filter(
            (accessory) =>
              !accessory.placement || accessory.placement === "header",
          )
          .map((accessory) => (
            <SiteHeaderAccessoryView
              key={accessory.key}
              accessory={accessory}
            />
          ))}
      </div>
    </StyledNewSiteHeader>
  );
}

export const StyledNewSiteHeader = styled(AutoBorderView)`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 5px 10px;
  min-height: 50px;
  box-sizing: border-box;
  color: ${colors.mediumGray()};
  font: ${fonts.display({ size: 14 })};
  position: relative;

  > .sidebar-toggle {
    flex-shrink: 0;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    width: 38px;
    transition: width 0.2s ease-in-out;

    > ${StyledButton} {
      min-width: 38px;
      min-height: 36px;

      &:not(:hover) {
        background: transparent;
      }
    }

    &[data-visible="false"] {
      width: 0;
    }
  }

  > .page-title {
    min-height: 36px;
    padding: 5px 7px;
    transition: margin-left 0.2s ease-in-out;

    &:not(:hover) {
      background: transparent;
    }

    > .content {
      > .title {
        font: ${fonts.displayBlack({ size: 22 })};
        position: relative;
        top: -0.5px;
      }
    }
  }

  > .title-right {
    flex-grow: 1;
  }

  > .accessories {
    padding-right: 5px;
    width: 70px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  &[data-sidebar-mode="shrink"][data-sidebar-visible="true"] {
    > .page-title {
      margin-left: -8px;
    }
  }

  &[data-sidebar-mode="overlay"] {
    > .sidebar-toggle {
      /* Match accessories width to center the title. */
      width: 70px;
    }

    > .title-left {
      flex-grow: 1;
    }
  }
`;
