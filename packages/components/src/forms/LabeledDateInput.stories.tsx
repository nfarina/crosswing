import { ModalDecorator } from "@cyber/modals/storybook";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { SeparatorDecorator } from "../SeparatorLayout.js";
import { LabeledDateInput } from "./LabeledDateInput.js";

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
