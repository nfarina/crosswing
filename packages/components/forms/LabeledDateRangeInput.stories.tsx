import { ModalDecorator } from "@crosswing/modals/storybook";
import { Days } from "@crosswing/shared/timespan";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { Meta } from "@storybook/react";
import { useState } from "react";
import { SeparatorDecorator } from "../SeparatorLayout";
import { DateRange, dateRange } from "./DateRange";
import { LabeledDateRangeInput } from "./LabeledDateRangeInput";

export default {
  component: LabeledDateRangeInput,
  decorators: [
    SeparatorDecorator,
    ModalDecorator,
    CrosswingAppDecorator({ layout: "mobile" }),
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
