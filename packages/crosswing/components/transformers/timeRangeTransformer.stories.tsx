import dayjs from "dayjs";
import { CrosswingAppDecorator } from "../../storybook";
import { Button } from "../Button";
import { dateRange, formatDateRange } from "../forms/DateRange";
import { TextInput } from "../forms/TextInput";
import { useInputValue } from "../forms/useInputValue";
import { TransformerDecorator } from "./storybook";
import { timeRangeTransformer } from "./timeRangeTransformer";

export default {
  component: timeRangeTransformer, // Just for the title.
  decorators: [CrosswingAppDecorator({ width: "wide" }), TransformerDecorator],
  parameters: { layout: "centered" },
};

export const Default = () => {
  const range = useInputValue({
    transformer: timeRangeTransformer({ dateRange: dateRange() }),
  });

  return (
    <>
      <TextInput placeholder="Ex: 3-4pm" {...range.props} />
      <Button
        children="Reset Value to 12pm-2pm"
        onClick={() =>
          range.set({
            start: dayjs().set("hour", 12).set("minute", 0).valueOf(),
            end: dayjs().set("hour", 14).set("minute", 0).valueOf(),
          })
        }
      />
      <pre>
        Parsed: {JSON.stringify(range.value)}
        <br />({formatDateRange(range.value)})<br />
        Error: {range.error?.message ?? ""}
      </pre>
    </>
  );
};
