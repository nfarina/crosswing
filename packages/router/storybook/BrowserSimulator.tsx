import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import {
  ChangeEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { styled } from "styled-components";
import { Router } from "../Router";
import { RouterContext } from "../context/RouterContext";
import { MemoryHistory } from "../history/MemoryHistory";

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
    <Router
      path={rootPath}
      history={history}
      render={() => (
        <StyledBrowserSimulator {...rest}>
          <AddressBar />
          <div className="children">{children}</div>
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

  > .children {
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
  const { history, nextLocation } = useContext(RouterContext);
  const [focused, setFocused] = useState(false);
  const [draftLocation, setDraftLocation] = useState("");

  function onFocus(e: ChangeEvent<HTMLInputElement>) {
    setFocused(true);
    setDraftLocation(nextLocation.href());
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setDraftLocation(e.target.value);
  }

  function onBlur() {
    setFocused(false);
    history.navigate(nextLocation.linkTo(draftLocation));
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
      value={focused ? draftLocation : nextLocation.href()}
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
