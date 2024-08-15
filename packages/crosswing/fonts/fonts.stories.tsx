import { Meta } from "@storybook/react";
import { ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { CrosswingAppDecorator } from "../storybook.js";
import { FontBuilder, fonts } from "./fonts.js";

export default {
  component: fonts as any, // Just for the auto-title.
  parameters: { layout: "centered" },
  decorators: [CrosswingAppDecorator({ layout: "centered" })],
} satisfies Meta;

export const FontBook = () => {
  const views: ReactNode[] = [];

  for (const [name, builder] of Object.entries(fonts)) {
    views.push(<SpecimenView key={name} name={name} builder={builder} />);
  }

  return <FontBookView>{views}</FontBookView>;
};

function SpecimenView({
  name,
  builder,
}: {
  name: string;
  builder: FontBuilder;
}) {
  return (
    <StyledSpecimenView $builder={builder}>
      <div className="name">{name}</div>
      <div className="specimen">
        The answer is 42. But what is the question?
      </div>
    </StyledSpecimenView>
  );
}

const StyledSpecimenView = styled.div<{ $builder: FontBuilder }>`
  color: ${colors.text()};

  > .name {
    font: ${fonts.display({ size: 14 })};
    margin-bottom: 4px;
    color: ${colors.textSecondary()};
  }

  > .specimen {
    font: ${(p) => p.$builder({ size: 24, line: "32px" })};
  }
`;

const FontBookView = styled.div`
  display: flex;
  flex-flow: column;
  padding: 10px;

  > * + * {
    margin-top: 10px;
  }
`;
