import { lazy } from "react";
import { styled } from "styled-components";
import { colors } from "../../../../colors/colors";
import { useRouter } from "../../../../router/context/RouterContext";
import { NavLayout } from "../../../../router/navs/NavLayout";
import { TabbedButton, TabbedButtonLayout } from "../../../TabbedButtonLayout";
import { StyledToolbar } from "../../../toolbar/Toolbar";

const PanelOne = lazy(() => import("../panels/PanelOne"));

// Simulate a slow import.
const PanelTwo = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../panels/PanelTwo") as any);
    }, 1000);
  });
});

export default function PageTwo() {
  const { location } = useRouter();

  const panel = location.searchParams().get("panel");

  return (
    <NavLayout title="Page Two">
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
