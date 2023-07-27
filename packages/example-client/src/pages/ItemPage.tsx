import {
  TabbedButton,
  TabbedButtonLayout,
} from "@cyber/components/TabbedButtonLayout";
import { StyledToolbar } from "@cyber/components/toolbar/Toolbar";
import { useRouter } from "@cyber/router/context";
import { NavLayout } from "@cyber/router/navs";
import { colors } from "@cyber/theme/colors";
import React, { lazy } from "react";
import { styled } from "styled-components";

const PanelOne = lazy(() => import("../panels/PanelOne.js"));

// Simulate a slow import.
const PanelTwo = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../panels/PanelTwo.js") as any);
    }, 1000);
  });
});

export default function ItemPage({ itemId }: { itemId: string }) {
  const { location } = useRouter();

  const panel = location.searchParams().get("panel");

  return (
    <NavLayout title="Item" subtitle={<>Item ID: {itemId}</>}>
      <StyledItemPage>
        <TabbedButtonLayout searchParam="panel">
          <TabbedButton value="one" title="Panel One" />
          <TabbedButton value="two" title="Panel Two" />
        </TabbedButtonLayout>
        {panel === "one" && <PanelOne />}
        {panel === "two" && <PanelTwo />}
      </StyledItemPage>
    </NavLayout>
  );
}

const StyledItemPage = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledToolbar} {
    flex-shrink: 0;
    border-bottom: 1px solid ${colors.separator()};
  }

  > :last-child {
    flex-grow: 1;
  }
`;
