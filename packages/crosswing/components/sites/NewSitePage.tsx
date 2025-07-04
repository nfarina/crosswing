import { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { BorderVisibility } from "../AutoBorderView";
import { PanelLayout } from "../PanelLayout";
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
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  Pick<
    Parameters<typeof PanelLayout>[0],
    "panelDefaultSize" | "panelMinSize" | "panelMaxSize"
  > & {
    title?: ReactNode;
    accessories?: ReactNode;
    panelContent?: ReactNode;
    panelAccessories?: ReactNode;
    panelVisible?: boolean;
    panelBordered?: boolean;
    onPanelVisibleChange?: (visible: boolean) => void;
    children: ReactNode;
    headerBorderVisibility?: BorderVisibility;
  }) {
  if (!panelContent) {
    return (
      <StyledNewSitePage {...rest}>
        <PageLayout>
          <NewSiteHeader
            title={title}
            accessories={accessories}
            hideSiteAccessory={panelVisible}
            borderVisibility={headerBorderVisibility}
          />
          <div className="page-content">{children}</div>
        </PageLayout>
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
        <PageLayout>
          <NewSiteHeader
            title={title}
            accessories={accessories}
            hideSiteAccessory={panelVisible}
            borderVisibility={headerBorderVisibility}
          />
          <div className="page-content">{children}</div>
        </PageLayout>
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
`;

const PageLayout = styled.div`
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
`;
