import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  use,
  useLayoutEffect,
  useRef,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { DotDotDotIcon } from "../../icons/DotDotDot.js";
import { Button } from "../Button.js";
import { LinkButton } from "../LinkButton.js";
import { PopupButton } from "../PopupButton.js";
import { SearchInput } from "../forms/SearchInput.js";
import { Select } from "../forms/Select.js";
import {
  ToolbarContext,
  ToolbarInsertionRef,
  ToolbarRef,
} from "./ToolbarContext.js";
import { StyledToolbarIDView } from "./ToolbarIDView.js";

export function Toolbar({
  expandTabs,
  children,
  hidden,
  ...rest
}: {
  expandTabs?: boolean;
  children?: ReactNode;
  hidden?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const toolbarRef: ToolbarRef = useRef(null);

  return (
    <StyledToolbar
      ref={toolbarRef}
      data-expand-tabs={!!expandTabs}
      data-hidden={!!hidden}
      {...rest}
    >
      {children}
      {/* For dynamically-added children via toolbarRef, to ensure the insertion point remains at the end of the toolbar. */}
      <noscript />
    </StyledToolbar>
  );
}

/**
 * An insertion point for dynamically-added toolbar buttons.
 */
export function ToolbarInsertionPoint({ name }: { name: string }) {
  const insertionRef: ToolbarInsertionRef = useRef(null);
  const { setInsertionRef } = use(ToolbarContext);

  useLayoutEffect(() => {
    // Pass the ref we created for ourself up to our ToolbarLayout parent
    // (if any).
    setInsertionRef(name, insertionRef);

    return () => {
      setInsertionRef(name, { current: null });
    };
  }, []);

  return <StyledToolbar data-inner-toolbar={true} ref={insertionRef} />;
}

export function ToolbarSpace({
  width,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { width?: number }) {
  const cssProps: CSSProperties = {
    ...style,
    ...(width != null ? { width: `${width}px` } : null),
  };

  return (
    <StyledToolbarSpace style={cssProps} data-fixed={width != null} {...rest} />
  );
}

export const StyledToolbarSpace = styled.div``;

export const ToolbarText = styled.div`
  color: ${colors.text()};
  font: ${fonts.displayMedium({ size: 15 })};
`;

export const toolbarShadows = {
  control: () => `inset 0 0 0 1px ${colors.darkGreen({ alpha: 0.15 })}`,
  controlDark: () => `inset 0 0 0 1px ${colors.white({ alpha: 0.1 })}`,
};

export const ToolbarLinkButton = styled(LinkButton)`
  background: ${colors.extraExtraLightGray()};
  box-shadow: ${toolbarShadows.control()};
  box-sizing: border-box;
  min-height: 30px;
  padding: 3px 9px;
  color: ${colors.text()};
  font: ${fonts.displayMedium({ size: 15, line: "1.5" })};

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraDarkGray()};
    color: ${colors.lightGray()};
    box-shadow: ${toolbarShadows.controlDark()};
  }
`;

export const ToolbarButton = styled(Button)`
  background: ${colors.extraExtraLightGray()};
  box-shadow: ${toolbarShadows.control()};
  box-sizing: border-box;
  min-height: 30px;
  padding: 3px 9px;
  color: ${colors.text()};
  font: ${fonts.displayMedium({ size: 15, line: "1.5" })};

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraDarkGray()};
    color: ${colors.lightGray()};
    box-shadow: ${toolbarShadows.controlDark()};
  }

  &[data-primary="true"] {
    font: ${fonts.displayBold({ size: 15, line: "1.5" })};
    box-shadow: none;
  }
`;

export const ToolbarPopupButton = styled(PopupButton)`
  background: ${colors.extraExtraLightGray()};
  box-shadow: ${toolbarShadows.control()};
  box-sizing: border-box;
  min-height: 30px;
  padding: 3px 9px;
  color: ${colors.text()};
  font: ${fonts.displayMedium({ size: 15, line: "1.5" })};

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraDarkGray()};
    color: ${colors.lightGray()};
    box-shadow: ${toolbarShadows.controlDark()};
  }

  &[data-primary="true"] {
    font: ${fonts.displayBold({ size: 15, line: "1.5" })};
    box-shadow: none;
  }
`;

export const ToolbarMoreButton = styled(ToolbarButton).attrs({
  icon: <DotDotDotIcon />,
})`
  width: 36px;
  padding: 1px 0 0 0;
`;

export const ToolbarSidebarButton = ({
  active,
  ...rest
}: {
  active?: boolean;
} & Parameters<typeof ToolbarButton>[0]) => (
  <StyledToolbarSidebarButton
    data-sidebar-visible={!!active}
    children={<div />}
    {...rest}
  />
);

export const StyledToolbarSidebarButton = styled(ToolbarButton)`
  width: 36px;
  padding: 1px;
  position: relative;

  > div {
    position: absolute;
    top: 3.5px;
    right: 3.5px;
    bottom: 3.5px;
    width: 13px;
    border-top-right-radius: 3.5px;
    border-bottom-right-radius: 3.5px;
    border-top-left-radius: 1.5px;
    border-bottom-left-radius: 1.5px;
    background: ${colors.text({ alpha: 0.5 })};
  }

  &[data-sidebar-visible="true"] {
    /* Colors from StatusBadge */
    background: ${colors.lightBlue({ lighten: 0.1, alpha: 0.5 })};

    > div {
      background: ${colors.lightBlue({ darken: 0.5 })};
    }

    @media (prefers-color-scheme: dark) {
      background: ${colors.lightBlue({ darken: 0.6, alpha: 0.8 })};

      > div {
        background: ${colors.lightBlue({ lighten: 0.06 })};
      }
    }
  }
`;

export const ToolbarIconButton = styled(ToolbarButton)`
  width: 36px;
  padding: 1px 0 0 0;
`;

export const ToolbarSearch = styled(SearchInput)`
  height: 30px;
  width: 175px;

  > input {
    border: none;
    box-shadow: ${toolbarShadows.control()};
    border-radius: 6px;

    @media (prefers-color-scheme: dark) {
      box-shadow: ${toolbarShadows.controlDark()};
    }
  }
`;

/** Expands the search input to fill the available space (on mobile only). */
export const ToolbarFlexSearch = styled(ToolbarSearch)`
  @media (max-width: 500px) {
    width: auto;
    flex-grow: 1;
  }
`;

export const ToolbarSelect = styled(Select)`
  select {
    background: ${colors.extraExtraLightGray()};
    box-shadow: ${toolbarShadows.control()};
    box-sizing: border-box;
    height: 30px;
    padding-top: 4px;
    padding-bottom: 4px;
    font: ${fonts.displayMedium({ size: 15, line: "1.5" })};

    @media (prefers-color-scheme: dark) {
      background: ${colors.extraExtraDarkGray()};
      color: ${colors.lightGray()};
      box-shadow: ${toolbarShadows.controlDark()};
    }
  }
`;

export const ToolbarFlexSelect = styled(ToolbarSelect)`
  flex-grow: 1;
`;

export const StyledToolbar = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 50px;
  background: ${colors.textBackground()};
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    margin: 10px;
  }

  > * + * {
    margin-left: 0px;
  }

  /* Prevent right margin getting ignored when toolbar is overflowed on Safari. 
     https://stackoverflow.com/a/38997047/66673 */
  &::after {
    content: "";
    /* File under "CSS is weird" */
    padding: 1px;
    margin-left: -2px;
  }

  > ${StyledToolbarSpace} {
    margin: 0;
  }

  > ${StyledToolbarSpace}[data-fixed=false] {
    flex-grow: 1;
    align-self: stretch;
  }

  > *[data-is-toolbar-tab="true"] {
    margin: 0 10px 0 0;
    align-self: stretch;
    box-shadow:
      1px 0 0 ${colors.separator()},
      -1px 0 0 ${colors.separator()};
  }

  &[data-expand-tabs="true"] {
    > *[data-is-toolbar-tab="true"] {
      width: 0;
      flex-grow: 1;
      margin-right: 0px;
    }
  }

  > *[data-is-toolbar-tab="true"] + *[data-is-toolbar-tab="true"] {
    margin-left: -10px;
  }

  > ${ToolbarSearch} {
    margin: 0 10px;
  }

  > ${StyledToolbarIDView} {
    align-self: stretch;
    /* We want the ID view to only take up as much space as is available, never make the toolbar overflow. */
    width: 0;
    flex-grow: 1;
    /* Undo the top/bottom margin that a typical child of a <Toolbar> would have. */
    margin-top: 0;
    margin-bottom: 0;
  }

  &[data-inner-toolbar="true"] {
    /* Let the parent toolbar determine background, if any. */
    background: none;
    /* Undo the default right margin that a typical child of a <Toolbar> would have, because our own last child will account for that, if present. */
    margin-right: 0;
    /* Undo the top/bottom margin that a typical child of a <Toolbar> would have. */
    margin-top: 0;
    margin-bottom: 0;
    overflow: visible;

    > *:first-child {
      margin-left: 0;
    }

    > *:last-child {
      margin-right: 10px;
    }
  }

  &[data-hidden="true"] {
    display: none;
  }
`;
