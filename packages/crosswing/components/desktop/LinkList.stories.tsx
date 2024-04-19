import { styled } from "styled-components";
import { BrowserSimulator } from "../../router/storybook/RouterDecorator.js";
import { capitalize } from "../../shared/strings.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { LinkButton } from "../LinkButton.js";
import CSSColors from "./CSSColors.json";
import { LinkList, StyledLinkList } from "./LinkList.js";
import { LinkListCell } from "./LinkListCell.js";
import { LinkListHeading } from "./LinkListHeading.js";

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

export const Grouped = () => {
  return (
    <BrowserSimulator>
      <StyledList>
        <LinkButton to="/">Deselect</LinkButton>
        <LinkList
          items={Colors}
          renderItem={(color) => renderColor(color, true)}
          separators="both"
        />
      </StyledList>
    </BrowserSimulator>
  );
};

export const GroupedWithCustomHeading = () => {
  return (
    <BrowserSimulator>
      <StyledList>
        <LinkButton to="/">Deselect</LinkButton>
        <LinkList
          items={Colors}
          renderItem={(color) => renderColor(color, true)}
          renderHeading={(group) => (
            <LinkListHeading children={"Letter " + group} />
          )}
          separators="both"
        />
      </StyledList>
    </BrowserSimulator>
  );
};

const renderColor = ({ id, hex }: Color, grouped?: boolean) => (
  <LinkListCell
    key={id}
    to={id}
    title={capitalize(id)}
    right={<ColorWell style={{ backgroundColor: hex }} />}
    group={grouped ? id[0].toUpperCase() : null}
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
