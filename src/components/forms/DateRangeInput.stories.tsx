import { useState } from "react";
import { styled } from "styled-components";
import { ModalDecorator } from "../../modals/storybook/ModalDecorator";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { CyberAppDecorator } from "../../theme/storybook";
import { DateRange } from "./DateRange";
import { DateRangeInput, StyledDateRangeInput } from "./DateRangeInput";

export default {
  component: DateRangeInput,
  decorators: [
    ModalDecorator,
    CyberAppDecorator({ layout: "fullscreen" }),
    RouterDecorator,
  ],
  // Need a stretched layout for our modal to show.
  parameters: { layout: "fullscreen" },
};

export const Default = () => {
  const [range, setRange] = useState<DateRange | null>(null);

  return (
    <Container>
      <DateRangeInput value={range} onValueChange={setRange} />
    </Container>
  );
};

// Special layout putting the button at the top so that the desktop-mode
// popup can appear below.
const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  > ${StyledDateRangeInput} {
    margin-top: 10px;
    flex-shrink: 0;
  }
`;