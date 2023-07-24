import { ModalDecorator } from "@cyber/modals/storybook";
import { Days } from "@cyber/shared/timespan";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { SeparatorDecorator } from "../SeparatorLayout.js";
import { DateRange, dateRange } from "./DateRange.js";
import { LabeledDateRangeInput } from "./LabeledDateRangeInput.js";

export default {
  component: LabeledDateRangeInput,
  decorators: [
    SeparatorDecorator,
    ModalDecorator,
    CyberAppDecorator({ layout: "mobile" }),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LabeledDateRangeInput>;

export const Empty = () => {
  const [date, setDate] = useState<DateRange | null>(null);

  return (
    <LabeledDateRangeInput
      style={{ marginTop: "50px" }}
      label="Name"
      value={date}
      onValueChange={setDate}
    />
  );
};

export const DefaultValue = () => {
  const [date, setDate] = useState<DateRange | null>(
    dateRange(Date.now() - Days(7), Date.now() - Days(2)),
  );

  return (
    <LabeledDateRangeInput
      style={{ marginTop: "50px" }}
      label="Name"
      value={date}
      onValueChange={setDate}
    />
  );
};
