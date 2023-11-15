import { BrowserSimulator } from "@crosswing/router/storybook";
import { capitalize } from "@crosswing/shared/strings";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { styled } from "styled-components";
import { LinkButton } from "../LinkButton";
import CSSColors from "./CSSColors.json";
import { LinkList, StyledLinkList } from "./LinkList";
import { LinkListCell } from "./LinkListCell";

export default {
  component: LinkList,
  decorators: [CrosswingAppDecorator({ layout: "mobile" })],
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
