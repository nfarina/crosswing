import { HTMLAttributes, ReactNode, use, useEffect } from "react";
import { styled } from "styled-components";
import { BorderVisibility } from "../AutoBorderView";
import { PanelLayout } from "../PanelLayout";
import { NewSiteContext } from "./NewSiteContext";
import { NewSiteHeader, StyledNewSiteHeader } from "./NewSiteHeader";
import { NewSitePanel } from "./NewSitePanel";

const PanelRestorationKey = Symbol("panel");

export function NewSitePage({
  title,
  accessories,
  panelContent,
  panelAccessories,
  panelVisible = false,
  panelBordered = false,
  panelDefaultSize,
  panelMinSize,
  panelMaxSize,
  onPanelVisibleChange,
  children,
  headerBorderVisibility = "auto",
  ...rest
}: HTMLAttributes<HTMLDivElement> &
  Pick<
    Parameters<typeof PanelLayout>[0],
    "panelDefaultSize" | "panelMinSize" | "panelMaxSize"
  > & {
    title?: string;
    accessories?: ReactNode;
    panelContent?: ReactNode;
    panelAccessories?: ReactNode;
    panelVisible?: boolean;
    panelBordered?: boolean;
    onPanelVisibleChange?: (visible: boolean) => void;
    children: ReactNode;
    headerBorderVisibility?: BorderVisibility;
  }) {
  const { siteTitle } = use(NewSiteContext);

  // Set document title
  useEffect(() => {
    if (siteTitle && title) {
      document.title = title + " | " + siteTitle;
    } else if (title) {
      document.title = title;
    } else if (siteTitle) {
      document.title = siteTitle;
    }
  }, [title, siteTitle]);

  if (!panelContent) {
    return (
      <StyledNewSitePage {...rest}>
        <div className="content">
          <NewSiteHeader
            title={title}
            accessories={accessories}
            hideSiteAccessory={panelVisible}
            borderVisibility={headerBorderVisibility}
          />
          <div className="page-content">{children}</div>
        </div>
      </StyledNewSitePage>
    );
  }

  return (
    <StyledNewSitePage {...rest}>
      <PanelLayout
        edge="right"
        hideDragHandle
        hideBorder={!panelBordered}
        restorationKey={PanelRestorationKey}
        panelDefaultSize={panelDefaultSize}
        panelMinSize={panelMinSize}
        panelMaxSize={panelMaxSize}
        panelVisible={panelVisible && !!panelContent}
        onPanelVisibleChange={onPanelVisibleChange}
        contentMinSize={400}
      >
        <div className="content">
          <NewSiteHeader
            title={title}
            accessories={accessories}
            hideSiteAccessory={panelVisible}
            borderVisibility={headerBorderVisibility}
          />
          <div className="page-content">{children}</div>
        </div>
        <NewSitePanel
          accessories={panelAccessories}
          onClose={() => onPanelVisibleChange?.(false)}
        >
          {panelContent}
        </NewSitePanel>
      </PanelLayout>
    </StyledNewSitePage>
  );
}

const StyledNewSitePage = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;

  > * {
    height: 0;
    flex-grow: 1;
  }

  .content {
    display: flex;
    flex-flow: column;
    position: relative;

    > * {
      flex-shrink: 0;
    }

    > ${StyledNewSiteHeader} {
      z-index: 1;
    }

    > .page-content {
      height: 0;
      flex-grow: 1;
      display: flex;
      flex-flow: column;

      > * {
        height: 0;
        flex-grow: 1;
      }
    }
  }
`;
