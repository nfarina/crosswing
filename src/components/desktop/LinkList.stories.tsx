import React from "react";
import { styled } from "styled-components";
import { BrowserSimulator } from "../../router/storybook/RouterDecorator.js";
import { capitalize } from "../../shared/strings.js";
import { CyberAppDecorator } from "../../theme/storybook.js";
import { LinkButton } from "../LinkButton.js";
import CSSColors from "./CSSColors.json";
import { LinkList, StyledLinkList } from "./LinkList.js";
import { LinkListCell } from "./LinkListCell.js";

export default {
  component: LinkList,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

type Color = { id: string; hex: string };

const Colors: Color[] = Object.entries(CSSColors).map(([name, hex]) => ({
  id: name,
  hex,
}));

export const Normal = () => {
  return (
    <BrowserSimulator>
      <StyledList>
        <LinkButton to="/">Deselect</LinkButton>
        <LinkList items={Colors} renderItem={renderColor} />
      </StyledList>
    </BrowserSimulator>
  );
};

export const AutoScroll = () => {
  return (
    <BrowserSimulator initialPath="gold">
      <StyledList>
        <LinkButton to="/">Deselect</LinkButton>
        <LinkList items={Colors} renderItem={renderColor} />
      </StyledList>
    </BrowserSimulator>
  );
};

const renderColor = ({ id, hex }: Color) => (
  <LinkListCell
    key={id}
    to={id}
    title={capitalize(id)}
    right={<ColorWell style={{ backgroundColor: hex }} />}
  />
);

const StyledList = styled.div`
  display: flex;
  flex-flow: column;

  > a {
    margin: 10px;
    flex-shrink: 0;
  }

  > ${StyledLinkList} {
    flex-grow: 1;
  }
`;

const ColorWell = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
`;
