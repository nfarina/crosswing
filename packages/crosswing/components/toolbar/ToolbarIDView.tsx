import { useRef } from "react";
import { styled } from "styled-components";
import { useElementSize } from "../../hooks/useElementSize";
import { IDView } from "../IDView";

export function ToolbarIDView(props: Parameters<typeof IDView>[0]) {
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

  return <StyledToolbarIDView {...props} />;
}

export const StyledToolbarIDView = styled(IDView)`
  min-width: 16px;
`;
