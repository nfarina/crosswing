import { Meta } from "@storybook/react";
import React, { CSSProperties, ReactNode } from "react";
import { styled } from "styled-components";
import { ColorBuilder, colors } from "../colors/index.js";
import { fonts } from "../fonts.js";
import { CyberAppDecorator } from "../storybook.js";

export default {
  title: "theme/colors",
  parameters: { layout: "centered" },
  decorators: [CyberAppDecorator({ layout: "centered" })],
} satisfies Meta;

export const Palette = () => {
  const views: ReactNode[] = [];

  for (const [name, builder] of Object.entries(colors)) {
    views.push(<ColorView key={name} name={name} builder={builder} />);
  }

  return <PaletteView>{views}</PaletteView>;
};

const PaletteView = styled.div`
  display: grid;
  grid-gap: 20px;
  padding: 10px;
  grid-template-columns: repeat(5, minmax(60px, 1fr));
`;

function ColorView({ name, builder }: { name: string; builder: ColorBuilder }) {
  return (
    <SolidColorView style={{ background: builder() }}>
      <div className="name">{name}</div>
    </SolidColorView>
  );
}

const SolidColorView = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-block;
  position: relative;

  > .name {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%, 100%);
    padding: 3px 10px;
    border-radius: 3px;
    background: ${colors.textBackgroundPanel()};
    color: ${colors.text()};
    font: ${fonts.displayMedium({ size: 12 })};
    z-index: 1;
    display: none;
  }

  &:hover > .name {
    display: block;
  }
`;

export const Transform = () => {
  function renderBadges() {
    const badges: ReactNode[] = [];

    for (let i = 0; i < 10; i++) {
      badges.push(
        <div
          key={String(i)}
          className="badge"
          style={
            {
              "--background-color": colors.mediumBlue({
                hue: i * 35,
              }),
              "--color": colors.mediumBlue({
                hue: i * 35,
                darken: 0.5,
                saturation: 2,
              }),
            } as CSSProperties
          }
        >
          You have no unread messages.
        </div>,
      );
    }

    return badges;
  }

  return <Badges>{renderBadges()}</Badges>;
};

const Badges = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 10px;

  > .badge {
    flex-grow: 0;
    padding: 10px;
    border-radius: 6px;
    background: var(--background-color);
    color: var(--color);
    font: ${fonts.displayMedium({ size: 14 })};
  }

  > .badge + .badge {
    margin-top: 10px;
  }
`;
