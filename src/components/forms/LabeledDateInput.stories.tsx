import { Meta } from "@storybook/react";
import { useState } from "react";
import { ModalDecorator } from "../../modals/storybook/ModalDecorator";
import { CyberAppDecorator } from "../../theme/storybook";
import { SeparatorDecorator } from "../SeparatorLayout";
import { LabeledDateInput } from "./LabeledDateInput";

export default {
  component: LabeledDateInput,
  decorators: [
    SeparatorDecorator,
    ModalDecorator,
    CyberAppDecorator({ layout: "mobile" }),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LabeledDateInput>;

export const Empty = () => {
  const [date, setDate] = useState<null | number>(null);

  return (
    <LabeledDateInput
      style={{ marginTop: "50px" }}
      label="Name"
      value={date}
      onValueChange={setDate}
    />
  );
};

export const DefaultValue = () => {
  const [date, setDate] = useState<null | number>(Date.now());

  return (
    <LabeledDateInput
      style={{ marginTop: "50px" }}
      label="Name"
      value={date}
      onValueChange={setDate}
    />
  );
};
