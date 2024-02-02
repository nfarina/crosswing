import { styled } from "styled-components";
import { colors } from "../colors/colors";
import { fonts } from "../fonts/fonts";
import Copy from "../icons/Copy.svg?react";
import { useBanner } from "../modals/banner/useBanner";
import { Clickable } from "./Clickable";

export function IDView({ name, id }: { name: string; id: string }) {
  const copiedBanner = useBanner(() => `${name} ID copied to clipboard.`);

  function onClick() {
    navigator.clipboard.writeText(id);
    copiedBanner.show();
  }

  return (
    <StyledIDView onClick={onClick}>
      <Copy />
      <span className="text">{id}</span>
    </StyledIDView>
  );
}

export const StyledIDView = styled(Clickable)`
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: ${colors.textSecondary()};
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
  }

  &:hover {
    color: ${colors.text()};
  }
`;
