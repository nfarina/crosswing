import {
    cloneElement,
    HTMLAttributes,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import { styled } from "styled-components";
import { useRouter } from "../../router/context/RouterContext";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts/fonts";
import {
    SeparatorEdges,
    SeparatorLayout,
    StyledSeparatorLayout,
} from "../SeparatorLayout";
import { LinkListCell } from "./LinkListCell";

export function LinkList<T extends { id: string }>({
  items = [],
  renderItem,
  after,
  onScroll,
  /** True if this list should be a natural height instead of just filling up its container. */
  autoSize,
  separators = "bottom",
  ...rest
}: {
  items?: T[];
  renderItem?: (item: T) => ReactElement<any>;
  after?: ReactNode;
  autoSize?: boolean;
  separators?: SeparatorEdges;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">) {
  // const [scrolledToActive, setScrolledToActive] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { location } = useRouter();

  // Get the next path component after our current location, if any.
  // This will be the ID of the item that's currently selected.
  const currentId = location.segments[location.claimIndex];
  // const selectedItem = items.find(({ id }) => id === currentId);

  useEffect(() => {
    // Do an initial scroll of the list to the selected item, if any.
    listRef.current
      ?.querySelector(`[data-id="${currentId}"]`)
      ?.scrollIntoView();
  }, []);

  function renderItemWithProps(item: T) {
    const rendered = renderItem?.(item) ?? <LinkListCell title={item.id} />;

    return cloneElement(rendered, {
      ...(!rendered.key ? { key: item.id } : null),
      ...(!rendered.props.to ? { to: item.id } : null),
      "data-id": item.id,
    });
  }

  const renderItems = () => {
    const renderedItems: ReactNode[] = [];

    let lastGroup = "";

    for (const item of items) {
      const rendered = renderItemWithProps(item);

      const group = rendered.props.group ?? "";

      if (group !== lastGroup) {
        renderedItems.push(<LinkListHeading key={group} children={group} />);
      }

      renderedItems.push(rendered);
      lastGroup = group;
    }

    return renderedItems;
  };

  return (
    <StyledLinkList ref={listRef} data-auto-size={!!autoSize} {...rest}>
      <SeparatorLayout onScroll={onScroll} edges={separators}>
        {renderItems()}
        {!!after && after}
      </SeparatorLayout>
    </StyledLinkList>
  );
}

export const LinkListHeading = styled.div`
  background: ${colors.textBackgroundAlt()};
  padding: 10px;
  font: ${fonts.displayMedium({ size: 13, line: "1" })};
  color: ${colors.text()};
`;

export const StyledLinkList = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;

  > ${StyledSeparatorLayout} {
    height: 0;
    flex-grow: 1;
    overflow-y: auto;

    > * {
      z-index: 1;
    }

    > ${LinkListHeading} {
      position: sticky;
      inset-block-start: 0; /* "top" */
      z-index: 2;
    }
  }

  &[data-auto-size="true"] {
    > ${StyledSeparatorLayout} {
      height: auto;
      flex-grow: 0;
    }
  }
`;
