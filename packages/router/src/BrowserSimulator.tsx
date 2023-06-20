import { colors, fonts } from "@cyber/theme";
import React, { HTMLAttributes, ReactNode, useContext, useState } from "react";
import { styled } from "styled-components";
import { AppRouter } from "./AppRouter.js";
import { MemoryHistory } from "./MemoryHistory.js";
import { RouterContext } from "./context.js";

export function BrowserSimulator({
  rootPath,
  initialPath,
  children,
  ...rest
}: {
  rootPath?: string;
  initialPath?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const [history] = useState(() => new MemoryHistory(initialPath));

  return (
    <AppRouter
      path={rootPath}
      history={history}
      render={() => (
        <StyledBrowserSimulator {...rest}>
          <AddressBar />
          <div className="content">{children}</div>
        </StyledBrowserSimulator>
      )}
    />
  );
}

export const StyledAddressBar = styled.div`
  background: ${colors.textBackgroundPanel()};
  padding: 10px;
  overflow: auto;
  font: ${fonts.display({ size: 14, line: "1.3" })};
  color: ${colors.textSecondary()};
`;

export const StyledBrowserSimulator = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledAddressBar} {
    flex-shrink: 0;
    border-bottom: 1px solid ${colors.separator()};
  }

  > .content {
    height: 0;
    flex-grow: 1;
    display: flex;
    flex-flow: column;

    > * {
      flex-grow: 1;
    }
  }
`;

export function AddressBar() {
  const { location } = useContext(RouterContext);

  return <StyledAddressBar>{location.href()}</StyledAddressBar>;
}
