import { useElementSize } from "@cyber/hooks/useElementSize";
import Copy from "@cyber/icons/Copy.svg?react";
import { useBanner } from "@cyber/modals/banner";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { useRef } from "react";
import { styled } from "styled-components";
import { Clickable } from "../Clickable";

export function ToolbarIDView({ name, id }: { name: string; id: string }) {
  const copiedBanner = useBanner(() => `${name} ID copied to clipboard.`);

  const ref = useRef<HTMLDivElement | null>(null);

  // Cleverly construct a fake "ref" to the parent so we can monitor its size,
  // since our <Clickable> doesn't support ref forwarding.
  const parentRef = { current: ref.current?.parentElement ?? null };

  useElementSize(parentRef, (size) => {
    if (!ref.current) return;

    if (size.width < 50) {
      ref.current.style.display = "none";
    } else {
      ref.current.style.display = "";
    }
  });

  function onClick() {
    navigator.clipboard.writeText(id);
    copiedBanner.show();
  }

  return (
    <StyledToolbarIDView onClick={onClick}>
      <Copy />
      <span className="text" ref={ref}>
        {id}
      </span>
    </StyledToolbarIDView>
  );
}

export const StyledToolbarIDView = styled(Clickable)`
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-end;
  min-width: 16px;
  color: ${colors.textSecondary({ alpha: 0.5 })};
  transition: color 0.2s ease-in-out;

  > svg {
    flex-shrink: 0;
    margin-right: 2px;
    width: 16px;
    height: 16px;

    path {
      fill: currentColor;
    }
  }

  > .text {
    font: ${fonts.displayMono({ size: 13 })};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${colors.text()};
  }
`;
