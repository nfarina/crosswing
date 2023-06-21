import { colors, fonts } from "@cyber/theme";
import React, {
  ChangeEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
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

export const StyledBrowserSimulator = styled.div`
  display: flex;
  flex-flow: column;

  > input {
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
  const { history, location } = useContext(RouterContext);
  const [focused, setFocused] = useState(false);
  const [draftLocation, setDraftLocation] = useState("");

  function onFocus(e: ChangeEvent<HTMLInputElement>) {
    setFocused(true);
    setDraftLocation(location.href());
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setDraftLocation(e.target.value);
  }

  function onBlur() {
    setFocused(false);
    history.navigate(location.linkTo(draftLocation));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onBlur();

      if (e.target instanceof HTMLInputElement) {
        e.target.blur();
      }
    }
  }

  return (
    <StyledAddressBar
      value={focused ? draftLocation : location.href()}
      onFocus={onFocus}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}

export const StyledAddressBar = styled.input`
  background: ${colors.textBackgroundPanel()};
  padding: 10px;
  font: ${fonts.display({ size: 14, line: "1.3" })};
  color: ${colors.textSecondary()};
  outline: none;
  border: none;
`;
